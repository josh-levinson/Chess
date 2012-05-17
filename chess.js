// Created by Josh
var newBoard = InitBoard();


$(document).ready(function(){

   $('.piece').draggable({
		snap:true
   });
   
   $('.space').droppable({
			hoverClass: 'piece-hover',
			drop: function(event, ui) {
				$(this).addClass("piece-dropped");
			}
   });
   
});
   

function InitBoard()
{
	// init pieces to start
	var king = {};
	king['white'] = {type: 'king', color: 'white', value: 100};
	king['black'] = {type: 'king', color: 'black', value: 100};
	
	var queen = {};
	queen['white'] = {type: 'queen', color: 'white', value: 9};
	queen['black'] = {type: 'queen', color: 'black', value: 9};
	
	var rook = {};
	rook['white1'] = {type: 'rook', color: 'white', value: 5};
	rook['white2'] = {type: 'rook', color: 'white', value: 5};
	rook['black1'] = {type: 'rook', color: 'black', value: 5};
	rook['black2'] = {type: 'rook', color: 'black', value: 5};
	
	var knight = {};
	knight['white1'] = {type: 'knight', color: 'white', value: 3};
	knight['white2'] = {type: 'knight', color: 'white', value: 3};
	knight['black1'] = {type: 'knight', color: 'black', value: 3};
	knight['black2'] = {type: 'knight', color: 'black', value: 3};
	
	
	var bishop = {};
	bishop['white1'] = {type: 'bishop', color: 'white', value: 3};
	bishop['white2'] = {type: 'bishop', color: 'white', value: 3};
	bishop['black1'] = {type: 'bishop', color: 'black', value: 3};
	bishop['black2'] = {type: 'bishop', color: 'black', value: 3};
	
	var pawn = {};
	for (i=1; i<9; i++)
	{
		var whitePawnName = 'white' + i;
		var blackPawnName = 'black' + i;
		pawn[whitePawnName] = {type: 'pawn', color: 'white', value: 1};
		pawn[blackPawnName] = {type: 'pawn', color: 'black', value: 1};
	}

	var chessBoard = [];
	
	// initiate multi-dimensional array for chessboard
	for (i=0; i<8; i++)
	{
		chessBoard[i] = [];
	}
	
	for (i=1; i<9; i++)
	{
		var whitePawnName = 'white' + i;
		var blackPawnName = 'black' + i;
		chessBoard[1][i-1] = pawn[whitePawnName];
		chessBoard[6][i-1] = pawn[blackPawnName];				
	}

	chessBoard[0][0] = rook['white1'];
	chessBoard[0][7] = rook['white2'];
	chessBoard[7][0] = rook['black1'];
	chessBoard[7][7] = rook['black2'];
				
	chessBoard[0][1] = knight['white1'];
	chessBoard[0][6] = knight['white2'];
	chessBoard[7][1] = knight['black1'];
	chessBoard[7][6] = knight['black2'];
				
	chessBoard[0][2] = bishop['white1'];
	chessBoard[0][5] = bishop['white2'];
	chessBoard[7][2] = bishop['black1'];
	chessBoard[7][5] = bishop['black2'];
				
	chessBoard[0][3] = queen['white'];
	chessBoard[7][3] = queen['black'];
				
	chessBoard[0][4] = king['white'];
	chessBoard[7][4] = king['black'];

	return chessBoard;
}

function isOccupied(row, column)
{
	var targetNode = $(".row" + row + ".col" + column + " > div.piece");
	if (targetNode.length > 0)
	{
		if (targetNode.hasClass('bl'))
			return 'black';
		else
			return 'white';
	}
	return 'empty';
}

function convertModelToDom(spaces)
{
	/* takes array of spaces and returns string that represents
	 * multiple selectors which can be used by jQuery
	 */
	var domSelectors = [];
	
	for (i=0; i<spaces.length; i++)
	{
		domSelectors.push(".row" + spaces[i][0] + ".col" + spaces[i][1]);
	}
	return domSelectors.join(", ");
}

function convertDomToModel(selector)
{
	/* takes jQuery selector string, splits into
	 * array of locations
	 */
	var locations = [];
	var selectors = selector.split(' ');
	for (i=0; i<selectors.length; i++)
	{
		var curSelector = [];
		curSelector[0] = parseInt(selectors[i].substr(4,1));
		curSelector[1] = parseInt(selectors[i].substr(9,1));
		locations.push(curSelector);
	}
	return locations;	
}

function DetermineLegalMoves(pieceType, pieceColor, pieceRow, pieceCol)
{
	var legalMoves = []; // holds the return moves, a string of row, col pairs
	
	switch (pieceType)
	{
		case 'pawn':
			if (pieceColor == 'black')
				legalMoves.push([currentRow-1, currentCol])
			else
				legalMoves.push([currentRow+1, currentCol])
			break;
		case 'bishop':
		
			break;
		case 'knight':
		
			break;
		case 'rook':
		
			break;
			
		case 'queen':
		
			break;
		case 'king':
			
			break;
	}
	return legalMoves;
	
	
}