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

function addGridOperations(grid){

	grid.resizeColumn = function(){
		var offset = grid.verticalResizer.endResizing();
		grid.columnUsed.resize(offset);
		grid.selectorBox.fitToRange(grid.activeCell);

		var diff = grid.cols[grid.cols.length-1].offsetLeft + grid.cols[grid.cols.length-1].offsetWidth - grid.offsetWidth;
		if(diff>0){
			for(var i=0;i<diff/grid.cfgs["defaultColWidth"];i++)
				grid.addColumn();
		}

		grid.adjustViewPortX();
		//Fire Fake Event
		if(grid.onColumnSizeChange) grid.onColumnSizeChange(grid.columnUsed);
		grid.columnUsed = undefined;
	}

	grid.getActiveCell = function(){
		return grid.activeCell;
	}

	grid.setValue = function(row,col,value){
		this.cells[row][col].setValue(value);
	}

	grid.setCell = function(row,col,value,fontStyleId){
		this.cells[row][col].setValue(value);
		this.cells[row][col].updateFontStyle(fontStyleId);
	}

	grid.setFontStyle = function(row,col,fontStyleId){
		WrapFontStyle(this.cells[row][col],fontStyleId);
	}

	grid.setLayerStyle = function(row,col,layerStyleId){
		WrapLayerStyle(this.cells[row][col],layerStyleId);
	}

	grid.setLayoutStyle = function(row,col,layoutStyleId){
		WrapLayoutStyle(this.cells[row][col],layoutStyleId);
	}


	grid.getRowCount = function(){
		return grid.viewport.row;
	}

	grid.getColumnCount = function(){
		return grid.viewport.col;
	}

	grid.getColumn = function(index){
		return grid.cols[index];
	}

	grid.getRow = function(index){
		return grid.rows[index];
	}

}