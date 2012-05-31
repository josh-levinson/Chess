// Created by Josh
var newBoard = InitBoard();

var whiteKingHasMoved = false; // need for castling
var blackKingHasMoved = false; 

var whiteKingPosition = [0, 4]; //shortcut to prevent searching entire board for king
var blackKingPosition = [7, 4];

var currentMove = 'white';

$(document).ready(function(){
   
   $('.piece').draggable({
		revert: 'invalid'
   });
   $('.bl').draggable("disable");
   
   $('.space').droppable({
			hoverClass: 'piece-hover',
			drop: function(event, ui) {
				performMove(ui.draggable, $(this));
				switchTurn();
			},
			accept: function(droppedPiece) {
				return isMoveLegal(droppedPiece, $(this));
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

function isOnBoard(row, column)
{
	if (row < 0 || row > 7 || column < 0 || column > 7)
		return false;
	else
		return true;
}



function convertSpaceModelToDom(spaces)
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

function convertSpaceDomToModel(selector)
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

function switchTurn()
{
	if (currentMove == "white")
	{
		currentMove = "black";
		$('.wh').draggable("disable");
		$('.bl').draggable("enable");
	}
	else
	{
		currentMove = "white";
		$('.bl').draggable("disable");
		$('.wh').draggable("enable");
	}
}

function performMove(movedDomPiece, targetSpaceDom)
{
		
		// defensive coding to protecting against calls after dom has moved
		if (typeof movedDomPiece == 'undefined')
			return false;
		
		// get piece from location of dropped piece
		var pieceRow = parseInt(movedDomPiece.parent()[0].classList[3].substr(3, 1));
		var pieceCol = parseInt(movedDomPiece.parent()[0].classList[4].substr(3, 1));
		var movedPiece = newBoard[pieceRow][pieceCol];
		
		var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
		var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
		// actually moved piece in model
		newBoard[spaceRow][spaceCol] = movedPiece;
		newBoard[pieceRow][pieceCol] = null;
		
		// need to keep track of king moves for check testing
		if (movedPiece.type == 'king')
		{
			if (movedPiece.color == 'white')
			{
				// keep track for castling
				if (whiteKingHasMoved == false)
					whiteKingHasMoved = true;
				whiteKingPosition = [spaceRow, spaceCol];
			}
			else
			{
				if (blackKingHasMoved == false)
					blackKingHasMoved = true;
				blackKingPosition = [spaceRow, spaceCol];
			}
		}
		
		// empty, replace dom element
		$(targetSpaceDom).empty();
		$(targetSpaceDom).append(movedDomPiece);
		
		// reset css set by droppable since they don't expect node to be moved
		$(movedDomPiece).css('top', '0');
		$(movedDomPiece).css('left', '0');
		$(movedDomPiece).css('right', '0');
}

function isMoveLegal(movedDomPiece, targetSpaceDom)
{
		// get piece from location of dropped piece
		var pieceRow = parseInt(movedDomPiece.parent()[0].classList[3].substr(3, 1));
		var pieceCol = parseInt(movedDomPiece.parent()[0].classList[4].substr(3, 1));
		
		// this is copying newBoard[pieceCol] rather than newBoard[pieceRow, pieceCol]
		var movedPiece = newBoard[pieceRow][pieceCol];
		if (movedPiece == null)
			return false;
		
		var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
		var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
		var targetSpace = [spaceRow, spaceCol];
		var legalMoves = determineLegalMoves(movedPiece, pieceRow, pieceCol);
		
		for (i=0; i<legalMoves.length; i++)
		{
			if ((targetSpace[0] == legalMoves[i][0]) && (targetSpace[1] == legalMoves[i][1]))
			{
				return true;
			}
		}
		return false;
}

function determineLegalMoves(piece, pieceRow, pieceCol)
{
	var legalMoves = []; // holds the return moves, a string of row, col pairs
	
	switch (piece.type)
	{
		case 'pawn':
			legalMoves = addPawnMoves(piece, pieceRow, pieceCol);			
			break;
		case 'bishop':
			legalMoves = addDiagonalMoves(piece, pieceRow, pieceCol);
			break;
		case 'knight':
			legalMoves = addKnightMoves(piece, pieceRow, pieceCol);
			break;
		case 'rook':
			legalMoves = addStraightLineMoves(piece, pieceRow, pieceCol);
			break;			
		case 'queen':
			legalMoves = addDiagonalMoves(piece, pieceRow, pieceCol).concat(addStraightLineMoves(piece, pieceRow, pieceCol));
			break;
		case 'king':
			legalMoves = addKingMoves(piece, pieceRow, pieceCol);
			break;
	}
	return legalMoves;	
}

function addStraightLineMoves(piece, pieceRow, pieceCol)
{
	var straightMoves = []; // holds return moves
	
	// start by going up in rows
	for (i=pieceRow+1; i<8; i++)
	{
		var nextSpace = [i, pieceCol];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// then down in rows
	for (i=pieceRow-1; i>-1; i--)
	{
		var nextSpace = [i, pieceCol];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// then up in columns
	for (i=pieceCol+1; i<8; i++)
	{
		var nextSpace = [pieceRow, i];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// finally down in columns
	for (i=pieceCol-1; i>-1; i--)
	{
		var nextSpace = [pieceRow, i];
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			straightMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			straightMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	return straightMoves;
}

function addDiagonalMoves(piece, pieceRow, pieceCol)
{
	var diagonalMoves = [];
	
	// first determine moves going up both rows and cols
	var j = pieceCol + 1; // need to keep track of column as well
	for (i=pieceRow+1; (i < 8 && j < 8); i++)
	{
		var nextSpace = [i, j];
		j++;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// next determine moves going up rows, down cols
	j = pieceCol - 1;
	for (i=pieceRow + 1; (i < 8 && j > -1); i++)
	{
		var nextSpace = [i, j];
		j--;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// next determine moves going down rows, up cols
	j = pieceCol + 1;
	for (i=pieceRow - 1; (i > -1 && j < 8); i--)
	{
		var nextSpace = [i, j];
		j++;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	// finally determine moves going down rows, down cols
	j = pieceCol - 1;
	for (i=pieceRow-1; (i > -1 && j > -1); i--)
	{
		var nextSpace = [i, j];
		j--;
		var spaceOccupied = isOccupied(nextSpace[0], nextSpace[1]);
		if (spaceOccupied == "empty")
			diagonalMoves.push(nextSpace);
		else if (spaceOccupied != piece.color)
		{
			diagonalMoves.push(nextSpace);
			break;
		}
		else
			break;
	}
	return diagonalMoves;
}

function addKnightMoves(piece, pieceRow, pieceCol)
{
	var knightMoves = [];
	// have to manually check moves here unless I figure out a shortcut later
	
	var nextSpace = [pieceRow+2, pieceCol+1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+2, pieceCol-1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-2, pieceCol+1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-2, pieceCol-1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+1, pieceCol+2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+1, pieceCol-2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-1, pieceCol+2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-1, pieceCol-2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	
	return knightMoves;
}

function addPawnMoves(piece, pieceRow, pieceCol)
{
	pawnMoves = [];
	
	if (piece.color == 'black')
	{
		// straight down one space
		if (isOccupied((pieceRow-1), pieceCol) == 'empty')
		{
			pawnMoves.push([pieceRow-1, pieceCol]);
			
			// if first space is empty, check if first move, if so, add two-space move
			if ((pieceRow == 6) && (isOccupied((pieceRow-2), pieceCol) == 'empty'))
				pawnMoves.push([pieceRow-2, pieceCol]);
			
		}
		// or capturing down diagonal spaces
		if (isOccupied((pieceRow-1), pieceCol-1) == 'white')
			pawnMoves.push([pieceRow-1, pieceCol-1]);
		if (isOccupied((pieceRow-1), pieceCol+1) == 'white')
			pawnMoves.push([pieceRow-1, pieceCol+1]);
	}
	else if (piece.color == 'white')
	{
		// straight down one space
		if (isOccupied((pieceRow+1), pieceCol) == 'empty')
		{
			pawnMoves.push([pieceRow+1, pieceCol]);
			if ((pieceRow == 1) && (isOccupied((pieceRow+2), pieceCol) == 'empty'))
				pawnMoves.push([pieceRow+2, pieceCol]);
		}
		// or capturing down diagonal spaces
		if (isOccupied((pieceRow+1), pieceCol-1) == 'black')
			pawnMoves.push([pieceRow+1, pieceCol-1]);
		if (isOccupied((pieceRow+1), pieceCol+1) == 'black')
			pawnMoves.push([pieceRow+1, pieceCol+1]);
	}
	return pawnMoves;
}

function addKingMoves(piece, pieceRow, pieceCol)
{
	kingMoves = [];
	
	// have to manually go through them as far as I know
	for (i = -1; i < 2; i++)
	{
		for (j = -1; j < 2; j++)
		{
			if (isOnBoard(pieceRow + i, pieceCol + j) && isOccupied(pieceRow + i, pieceCol + j) != piece.color)
				kingMoves.push([pieceRow + i, pieceCol + j]);
		}
	}
	
	return kingMoves;
}

function performCheckTest()
{
	var whiteKingChecked = false;
	var blackKingChecked = false;
	
	for (i = 0; i < 8; i++)
	{
		for (j = 0; j < 8; j++)
		{
			if (typeof(newBoard[i][j]) == "Object")
			var currentPiece = newBoard[i][j];
			var currentPieceMoves = determineLegalMoves(currentPiece, i, j);
			for (k = 0; k < currentPieceMoves.length; k++)
			{
				if ((whiteKingPosition[0] == currentPieceMoves[k][0]) && (whiteKingPosition[1] == currentPieceMoves[k][1]))
					whiteKingChecked = true;
				if ((blackKingPosition[0] == currentPieceMoves[k][0]) && (blackingPosition[1] == currentPieceMoves[k][1]))
					blackKingChecked = true;
			}
		}
	}
	
	if (whiteKingChecked && blackKingChecked)
		return "both";
	else if (whiteKingChecked)
		return "white";
	else if (blackKingChecked)
		return "black";
	else
		return "none";
}
