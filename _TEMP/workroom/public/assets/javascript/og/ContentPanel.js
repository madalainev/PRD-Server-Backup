/**
 *  Config options:
 *  	- id
 *  	- title
 *  	- iconCls
 *  	- defaultContent
 *  	- plus all Ext.Panel options
 */
og.ContentPanel = function(config) {
	if (!config) config = {};
	if (!config.listeners) config.listeners = {};
	this.onClose = config.onClose;
	this.contentAutoScroll = typeof config.autoscroll == "undefined" || config.autoscroll;
	Ext.apply(config, {
		autoscroll: false,
		layout: 'contentpanel',
		loaded: false,
		cls: 'og-content-panel', // identifies ContentPanels (see: og.getParentContentPanel)
		items: [{
			xtype: 'panel',
			html: ""
		}],
		listeners: Ext.apply(config.listeners, {
			activate: this.activate,
			deactivate: this.deactivate
		})
	});
	
	og.ContentPanel.superclass.constructor.call(this, config);
	
	this.history = [];
	this.contentLoaded = false;
	
	this.onClose = config.onClose;
	
	if (config.refreshOnWorkspaceChange) {
		og.eventManager.addListener('workspace changed', this.reset, this);
	}
	if (config.refreshOnTagChange) {
		og.eventManager.addListener('tag changed', this.reset, this);
	}
	
	// dirty stuff to allow refreshing a content panel when clicking on its tab
	this.on('render', function() {
		var tab = Ext.get("tabs-panel__" + this.id);
		if (tab) {
			tab.on('click', function() { 
				if (this.id == og._activeTab) {
					this.reset();
				}
				og._activeTab = this.id;
			}, this);
		}
		if (this.ownerCt) {
			this.ownerCt.on('remove', function(ct, item) {
				if (item == this) {
					if (typeof this.onClose == 'function') {
						this.onClose();
					}
				}
			}, this);
		}
	}, this);
};

Ext.extend(og.ContentPanel, Ext.Panel, {

	activate: function() {
		this.active = true;
		if (this.getComponent(0).activate) {
			this.getComponent(0).activate();
		}
		if (!this.loaded) {
			if (this.initialContent) {
				this.history.push(this.defaultContent);
				this.load(this.initialContent);
				this.initialContent = false;
			} else {
				this.load(this.defaultContent);
			}
		}
	},
	
	deactivate: function() {
		this.active = false;
		if (this.getComponent(0).deactivate) {
			this.getComponent(0).deactivate();
		}
	},
	
	setPreventClose: function(prevent) {
		if (!this.preventClose && prevent) {
			// if this panel was closable but now we want to prevent it:
			og.ContentPanel.preventCloseCount++;
			if (og.ContentPanel.preventCloseCount) {
				window.onbeforeunload = function() {return lang("confirm unload page");};
			}
		} else if (this.preventClose && !prevent) {
			// if this panel prevented closing and now becomes closable
			og.ContentPanel.preventCloseCount--;
			if (!og.ContentPanel.preventCloseCount) {
				window.onbeforeunload = null;
			}
		}
		this.preventClose = prevent;
	},
	
	confirmClose: function() {
		if (this.preventClose) {
			if (!confirm(lang("confirm leave panel"))) {
				return false;
			}
			this.setPreventClose(false);
		}
		return !this.preventClose;
	},

	load: function(content, isBack) {

		if (!this.confirmClose()) {
			if (isBack) {
				// put content back to the history stack
				this.history.push(content);
			}
			return false;
		}
		if (content.type == 'start') {
			if (this.closable) {
				this.ownerCt.remove(this);
			} else {
				this.reset();
			}
			return false;
		} else if (content.type == 'back') {
			this.back();
			return false;
		} else if (content.type == 'reload') {
			this.reload();
			return false;
		}
	
		if (this.content && !isBack && this.content.type != 'url' && !content.replace) {
			this.history.push(this.content);
		}
		if (typeof content == 'string') {
			content = {
				type: 'html',
				data: content
			}
		}
		this.content = content;
		if (this.content.type != 'url') {
			var i=0;
			while (this.getComponent(i)) {
				if (this.getComponent(i).doNotRemove) {
					this.getComponent(i).hide();
					i++;
				} else {
					this.remove(this.getComponent(i));
				}
			}
			this.doLayout();
		}
		this.setPreventClose(content.preventClose);
		
		
		if (content.type == 'html') {
			if (this.history.length > 0) {
				var tbar = [{
					text: lang('back'),
					handler: function() {
						this.back();
					},
					scope: this,
					iconCls: 'ico-back'
				},'-'];
			} else if (this.closable) {
				var tbar = [{
					text: lang('cancel'),
					handler: function() {
						this.ownerCt.remove(this);
					},
					scope: this,
					iconCls: 'ico-back'
				},'-'];
			} else if (content.actions) {
				var tbar = [];
			}
			if (content.actions) {
				for (var i=0; i < content.actions.length; i++) {
					tbar.push({
						text: content.actions[i].title,
						handler: function() {
							if (this.url.indexOf('javascript:') == 0) {
								var js = this.url.substring(11);
								eval(js);
							} else {
								if (this.target == '_blank') {
									window.open(this.url);
								} else if (this.target) {
									og.openLink(this.url, {caller: this.target});
								} else {
									og.openLink(this.url);
								}
							}
						},
						scope: content.actions[i],
						iconCls: content.actions[i].name
					});
				}
			}
			if (content.notbar){
				tbar = null;
			}
			var p = new og.HtmlPanel({
				html: og.extractScripts(content.data),
				autoScroll: this.contentAutoScroll,//this.initialConfig.autoScroll,
				tbar: tbar
			});
			this.add(p);
			this.doLayout();
		} else if (content.type == 'url') {
			if (this.active) {
				og.openLink(content.data, {caller: this, preventSwitch: true});
			} else {
				this.loaded = false;
			}
		} else if (content.type == 'panel') {
			if (!content.panel) {
				for (var i=0; this.getComponent(i) && !content.panel; i++) {
					if (this.getComponent(i).getXType() == content.data) {
						// a panel of this type has already been loaded => use it
						content.panel = this.getComponent(i);
					}
				}
				if (!content.panel) {
					// create a new panel of the type
					var config = content.config || {};
					config.xtype = content.data || config.xtype;
					content.panel = Ext.ComponentMgr.create(config);
				}
			}
			this.add(content.panel);
			content.panel.show();
			content.panel.load();
			this.doLayout();
			og.captureLinks(this.id, this);
		} else {
			var html = "<h1>Error: invalid content</h1>";
			html += "<pre>";
			html += og.debug(content);
			html += "</pre>";
			var p = new Ext.Panel({
				html: html,
				autoScroll: true
			});
			this.add(p);
			this.doLayout();
		}
		if (content.type != 'url') {
			this.loaded = true;
		}
		
		return true;
	},
	
	back: function() {
		var prev = this.history.pop();
		if (!prev) {
			this.load({type: 'start'});
		} else if (prev.type == 'html' && prev.url) {
			this.load({type: 'url', data: prev.url}, true);
		} else { 
			this.load(prev, true);
		}
	},
	
	reload: function() {
		if (this.content.type == 'html' && this.content.url) {
			this.load({type:'url',data:this.content.url}, true);
		} else {
			this.load(this.content, true);
		}
	},
		
	reset: function() {
		if (!this.confirmClose()) return;
		this.loaded = false;
		if (this.active) {
			this.load(this.defaultContent);
		}
		this.history = [];
	}
});

og.ContentPanel.preventCloseCount = 0;