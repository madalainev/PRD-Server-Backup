/*  Gelsheet Project, version 0.0.1 (Pre-alpha)
 *  Copyright (c) 2008 - Ignacio Vazquez, Fernando Rodriguez, Juan Pedro del Campo
 *
 *  Ignacio "Pepe" Vazquez <elpepe22@users.sourceforge.net>
 *  Fernando "Palillo" Rodriguez <fernandor@users.sourceforge.net>
 *  Juan Pedro "Perico" del Campo <pericodc@users.sourceforge.net>
 *
 *  Gelsheet is free distributable under the terms of an GPL license.
 *  For details see: http://www.gnu.org/copyleft/gpl.html
 *
 */
function Column(index){
	var self = this;

	self.constructor = function(index){
		//this.cells = new Array();
		this.index = index;
		this.size = 80;
		this.fontStyleId = 0;
	}

	self.setFontStyleId = function(fontStyleId){
		this.fontStyleId = fontStyleId;
		//for(var i=0;i<this.cells.length;i++)
		//	this.cells[i].setFontStyleId(fontStyleId);
	}


	self.getFontStyleId = function(){
		return this.fontStyleId;
	}

	self.setSize = function(size){
		this.size = size;
	}

	self.getSize = function(){
		return this.size;
	}

	self.addCell = function(cell){
		this.cells.push(cell);
	}

	self.getIndex = function(){
		return this.index;
	}

	self.constructor(index);

	return self;
}