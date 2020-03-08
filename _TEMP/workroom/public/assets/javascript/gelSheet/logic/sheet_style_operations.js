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
function addSheetStyleOperations(sheet){
	//Gets the Font Style Id of a Column if exists else returns default
	sheet.getColumnFontStyleId = function(colIndex){
		if(sheet.cols[colIndex])
			return sheet.cols[colIndex].getFontStyleId();
		else
			return sheet.defaultFontStyleId;
	}
	//Gets the Font Style Id of a Row if exists else returns default
	sheet.getRowFontStyleId = function(rowIndex){
		if(sheet.rows[rowIndex])
			return sheet.rows[rowIndex].getFontStyleId();
		else
			return sheet.defaultFontStyleId;
	}

	//Gets the Font Style Id of a Cell if exists else returns default (of Row, else of Column else of Sheet)
	sheet.getCellFontStyleId = function(rowIndex,colIndex,fontStyleId){
		if(sheet.cells[rowIndex]==undefined)
			if(sheet.rows[rowIndex]!=undefined)
				return sheet.rows[rowIndex].getFontStyleId();
			else
				if(sheet.cols[colsIndex]!=undefined)
					return sheet.cols[colsIndex].getFontStyleId();
				else
					return sheet.defaultFontStyleId;
		else
			if(sheet.cells[rowIndex][colIndex]==undefined)
				return sheet.rows[rowIndex].getFontStyleId();
			else
				return sheet.cells[rowIndex][colIndex].getFontStyleId();
	}

	//Sets the Font Style Id of a Cell if exists else returns default (of Row, else of Column else of Sheet)
	sheet.setCellFontStyleId = function(rowIndex,colIndex,fontStyleId){
		if(sheet.cells[rowIndex]==undefined)
			sheet.addCell(rowIndex, colIndex);
		else
			if(sheet.cells[rowIndex][colIndex]==undefined)
				sheet.addCell(rowIndex, colIndex);

		sheet.cells[rowIndex][colIndex].setFontStyleId(fontStyleId);
	}

	sheet.setColumnFontStyleId = function(column,fontStyleId){
		if(sheet.cols[column]==undefined)
			sheet.addColumn(column);

		sheet.cols[column].setFontStyleId(fontStyleId);

		for(var i=0;i<sheet.cells.length;i++)
			if(sheet.cells[i])
				if(sheet.cells[i][column])
					sheet.cells[i][column].setFontStyleId(fontStyleId);
	}
	
	/**
	 * Arreglar
	 */
	sheet.setRowFontStyleId = function(row,fontStyleId){
		if(sheet.rows[row]==undefined)
			sheet.addRow(row);

		sheet.rows[row].setFontStyleId(fontStyleId);
		if(sheet.cells[row])
			for(var i=0;i<sheet.cells[row].length;i++){
				sheet.cells[row][i].setFontStyleId(fontStyleId);
			}
	}
	
	/**
	 * pepe
	 * Only set the view, not the model.. perico help !
	 */
	sheet.setColumnBgColor = function(column,color){
/*		if(sheet.cols[column]==undefined)
			sheet.addColumn(column);
*/
		for(var i=0;i<sheet.cells.length;i++)
			//if(sheet.cells[i])
				//if(sheet.cells[i][column])
					application.grid.cells[i][column].style.background = color ;
					//Todo change the logic and not the view..
	}

	sheet.setRowBgColor = function(row,color){
		if(sheet.rows[row]==undefined)
			sheet.addRow(row);

		sheet.rows[row].setFontStyleId(fontStyleId);
		if(sheet.cells[row])
			for(var i=0;i<sheet.cells[row].length;i++){
				sheet.cells[row][i].setFontStyleId(fontStyleId);
			}

	}

}