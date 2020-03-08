/**
 *  CalendarManager
 */
og.CalendarManager = function() {
	var actions;
	this.doNotRemove = true;
	this.needRefresh = false;
	
	if (!og.CalendarManager.store) {
		og.CalendarManager.store = new Ext.data.Store({
	        proxy: new og.GooProxy({
	            url: og.getUrl('event', 'view_calendar', {day: today_date.format('d'), month: today_date.format('n'), year: today_date.format('Y')})
	        }),
	        reader: new Ext.data.JsonReader({
	            root: 'events',
	            totalProperty: 'totalCount',
	            id: 'id'
	        }),
	        remoteSort: true,
			listeners: {
				'load': function() {
					var d = this.reader.jsonData;
					var ws = og.clean(Ext.getCmp('workspace-panel').getActiveWorkspace().name);
					var tag = og.clean(Ext.getCmp('tag-panel').getSelectedTag().name);
				}
			},
			renderTo: Ext.getBody()
	    });
    }
    this.store = og.CalendarManager.store;
    this.store.addListener({messageToShow: {fn: this.showMessage, scope: this}});
    //--------------------------------------------
    //--------------------------------------------

	og.CalendarManager.superclass.constructor.call(this, {
		store: this.store,
		layout: 'fit',
		//tbar: og.CalendarToolbarItems,
        closable: true
    });

	var tagevid = og.eventManager.addListener("tag changed", function(tag) {
		if (!this.ownerCt) {
			og.eventManager.removeListener(tagevid);
			return;
		}
		if (this.ownerCt.active) {
			this.load({start:0});
		} else {
    		this.needRefresh = true;
    	}
	}, this);
};

Ext.extend(og.CalendarManager, Ext.Panel, {
	load: function(params) {
		if (!params) params = {};
		Ext.apply(this.store.baseParams, {
			tag: Ext.getCmp('tag-panel').getSelectedTag().name,
			active_project: Ext.getCmp('workspace-panel').getActiveWorkspace().id
		});
		this.store.load({
			params: Ext.apply(params, {
				tag: Ext.getCmp('tag-panel').getSelectedTag().name,
				active_project: Ext.getCmp('workspace-panel').getActiveWorkspace().id
			})
		});
		this.needRefresh = false;
	},
	
	activate: function() {
		if (this.needRefresh) {
			this.load({start: 0});
		}
	},
	
	showMessage: function(text) {
		this.innerMessage.innerHTML = text;
	}
});

Ext.reg("events", og.CalendarManager);