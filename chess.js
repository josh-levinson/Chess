// Created by Josh
var chessBoard = InitBoard();

var whiteKingHasMoved = false; // need for castling
var blackKingHasMoved = false; 

var whiteKingPosition = [0, 4]; //shortcut to prevent searching entire board for king
var blackKingPosition = [7, 4];

// for check testing
var futureWhiteKingPosition = whiteKingPosition;
var futureBlackKingPosition = blackKingPosition;

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

	var newBoard = [];
	
	// initiate multi-dimensional array for newBoard
	for (i=0; i<8; i++)
	{
		newBoard[i] = [];
	}
	
	for (i=1; i<9; i++)
	{
		var whitePawnName = 'white' + i;
		var blackPawnName = 'black' + i;
		newBoard[1][i-1] = pawn[whitePawnName];
		newBoard[6][i-1] = pawn[blackPawnName];				
	}

	newBoard[0][0] = rook['white1'];
	newBoard[0][7] = rook['white2'];
	newBoard[7][0] = rook['black1'];
	newBoard[7][7] = rook['black2'];
				
	newBoard[0][1] = knight['white1'];
	newBoard[0][6] = knight['white2'];
	newBoard[7][1] = knight['black1'];
	newBoard[7][6] = knight['black2'];
				
	newBoard[0][2] = bishop['white1'];
	newBoard[0][5] = bishop['white2'];
	newBoard[7][2] = bishop['black1'];
	newBoard[7][5] = bishop['black2'];
				
	newBoard[0][3] = queen['white'];
	newBoard[7][3] = queen['black'];
				
	newBoard[0][4] = king['white'];
	newBoard[7][4] = king['black'];

	return newBoard;
}

function isOccupied(board, row, column)
{	
	if (board[row][column] == null || board[row][column] == undefined)
		return "empty";
	else
		var occupiedPiece = board[row][column];
	return occupiedPiece.color;
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
	var lastMove = currentMove;
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
	
	var checkMateResult = testCheckmate();
	if (checkMateResult != "nothing")
	{
		if (checkMateResult == "stalemate")
			alert("Stalemate!");
		else
			alert("Checkmate: " + lastMove + " wins!")
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
		var movedPiece = chessBoard[pieceRow][pieceCol];
		
		var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
		var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
		// actually moved piece in model
		chessBoard[spaceRow][spaceCol] = movedPiece;
		chessBoard[pieceRow][pieceCol] = null;
		
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
		
		pieceMoved = true;
}

function isMoveLegal(movedDomPiece, targetSpaceDom)
{
		// get piece from location of dropped piece
		var pieceRow = parseInt(movedDomPiece.parent()[0].classList[3].substr(3, 1));
		var pieceCol = parseInt(movedDomPiece.parent()[0].classList[4].substr(3, 1));
		
		var movedPiece = chessBoard[pieceRow][pieceCol];
		if (movedPiece == null)
			return false;
		
		var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
		var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
		if (movedPiece.type == 'king')
		{
			if (movedPiece.color == 'white')
				futureWhiteKingPosition = [spaceRow, spaceCol];
			else
				futureBlackKingPosition = [spaceRow, spaceCol];
		}
		
		
		var targetSpace = [spaceRow, spaceCol];
		var legalMoves = determineLegalMoves(chessBoard, movedPiece, pieceRow, pieceCol);
		
		for (i=0; i<legalMoves.length; i++)
		{
			if ((targetSpace[0] == legalMoves[i][0]) && (targetSpace[1] == legalMoves[i][1]))
			{
				// finally, test if putting yourself in check, start by copying board for test case
				var specBoard = cloneObject(chessBoard);
				
				// move the piece on this spec board
				specBoard[spaceRow][spaceCol] = movedPiece;
				specBoard[pieceRow][pieceCol] = null;
				
				var checkResult = performCheckTest(specBoard);
				if (currentMove == checkResult || checkResult == "both")
					return false;
				return true;
			}
		}
		return false;
}

function determineLegalMoves(board, piece, pieceRow, pieceCol)
{
	var legalMoves = []; // holds the return moves, a string of row, col pairs
	
	if (piece != null)
	{
		switch (piece.type)
		{
			case 'pawn':
				legalMoves = addPawnMoves(board, piece, pieceRow, pieceCol);			
				break;
			case 'bishop':
				legalMoves = addDiagonalMoves(board, piece, pieceRow, pieceCol);
				break;
			case 'knight':
				legalMoves = addKnightMoves(board, piece, pieceRow, pieceCol);
				break;
			case 'rook':
				legalMoves = addStraightLineMoves(board, piece, pieceRow, pieceCol).concat(addRookCastleMoves(board, piece, pieceRow, pieceCol));
				break;			
			case 'queen':
				legalMoves = addDiagonalMoves(board, piece, pieceRow, pieceCol).concat(addStraightLineMoves(board, piece, pieceRow, pieceCol));
				break;
			case 'king':
				legalMoves = addKingMoves(board, piece, pieceRow, pieceCol).concat(addKingCastleMoves(board, piece, pieceRow, pieceCol));
				break;
		}
	}
	return legalMoves;	
}

function addStraightLineMoves(board, piece, pieceRow, pieceCol)
{
	var straightMoves = []; // holds return moves
	
	// start by going up in rows
	for (i=pieceRow+1; i<8; i++)
	{
		var nextSpace = [i, pieceCol];
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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

function addDiagonalMoves(board, piece, pieceRow, pieceCol)
{
	var diagonalMoves = [];
	
	// first determine moves going up both rows and cols
	var j = pieceCol + 1; // need to keep track of column as well
	for (i=pieceRow+1; (i < 8 && j < 8); i++)
	{
		var nextSpace = [i, j];
		j++;
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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
		var spaceOccupied = isOccupied(board, nextSpace[0], nextSpace[1]);
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

function addKnightMoves(board, piece, pieceRow, pieceCol)
{
	var knightMoves = [];
	// have to manually check moves here unless I figure out a shortcut later
	
	var nextSpace = [pieceRow+2, pieceCol+1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+2, pieceCol-1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-2, pieceCol+1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-2, pieceCol-1];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+1, pieceCol+2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow+1, pieceCol-2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-1, pieceCol+2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	nextSpace = [pieceRow-1, pieceCol-2];
	if ((isOnBoard(nextSpace[0], nextSpace[1])) && (isOccupied(board, nextSpace[0], nextSpace[1]) != piece.color))
		knightMoves.push(nextSpace);
	
	return knightMoves;
}

function addRookCastleMoves(board, piece, pieceRow, pieceCol)
{
	castleMoves = [];
	
	return castleMoves;
}

function addPawnMoves(board, piece, pieceRow, pieceCol)
{
	pawnMoves = [];
	
	if (piece.color == 'black')
	{
		// straight down one space
		if (isOccupied(board, (pieceRow-1), pieceCol) == 'empty')
		{
			pawnMoves.push([pieceRow-1, pieceCol]);
			
			// if first space is empty, check if first move, if so, add two-space move
			if ((pieceRow == 6) && (isOccupied(board, (pieceRow-2), pieceCol) == 'empty'))
				pawnMoves.push([pieceRow-2, pieceCol]);
			
		}
		// or capturing down diagonal spaces
		if (isOccupied(board, (pieceRow-1), pieceCol-1) == 'white')
			pawnMoves.push([pieceRow-1, pieceCol-1]);
		if (isOccupied(board, (pieceRow-1), pieceCol+1) == 'white')
			pawnMoves.push([pieceRow-1, pieceCol+1]);
	}
	else if (piece.color == 'white')
	{
		// straight down one space
		if (isOccupied(board, (pieceRow+1), pieceCol) == 'empty')
		{
			pawnMoves.push([pieceRow+1, pieceCol]);
			if ((pieceRow == 1) && (isOccupied(board, (pieceRow+2), pieceCol) == 'empty'))
				pawnMoves.push([pieceRow+2, pieceCol]);
		}
		// or capturing down diagonal spaces
		if (isOccupied(board, (pieceRow+1), pieceCol-1) == 'black')
			pawnMoves.push([pieceRow+1, pieceCol-1]);
		if (isOccupied(board, (pieceRow+1), pieceCol+1) == 'black')
			pawnMoves.push([pieceRow+1, pieceCol+1]);
	}
	return pawnMoves;
}

function addKingMoves(board, piece, pieceRow, pieceCol)
{
	kingMoves = [];
	
	// have to manually go through them as far as I know
	for (i = -1; i < 2; i++)
	{
		for (j = -1; j < 2; j++)
		{
			if (isOnBoard(pieceRow + i, pieceCol + j) && isOccupied(board, pieceRow + i, pieceCol + j) != piece.color)
				kingMoves.push([pieceRow + i, pieceCol + j]);
		}
	}
	return kingMoves;
}

function addKingCastleMoves(board, piece, pieceRow, pieceCol)
{
	castleMoves = [];
	if (currentMove == "white" && piece.color == "white")
	{
		if (!whiteKingHasMoved)
		{
			if ((isOccupied(chessBoard, 0, 1) == "empty") && (isOccupied(chessBoard, 0, 2) == "empty") && (isOccupied(chessBoard, 0, 3) == "empty"))
				castleMoves.push([0, 1]);
			if ((isOccupied(chessBoard, 0, 5) == "empty") && (isOccupied(chessBoard, 0, 6) == "empty"))
				castleMoves.push([0, 6]);
		}
	}
	else if (piece.color == "black")
	{
		if (!blackKingHasMoved)
		{
			if ((isOccupied(chessBoard, 7, 1) == "empty") && (isOccupied(chessBoard, 7, 2) == "empty") && (isOccupied(chessBoard, 7, 3) == "empty"))
				castleMoves.push([7, 1]);
			if ((isOccupied(chessBoard, 7, 5) == "empty") && (isOccupied(chessBoard, 7, 6) == "empty"))
				castleMoves.push([7, 6]);
		}
	}
	return castleMoves;
}

function performCheckTest(testBoard)
{
	var whiteKingChecked = false;
	var blackKingChecked = false;
	
	for (x = 0; x < 8; x++)
	{
		for (y = 0; y < 8; y++)
		{
			if (typeof(testBoard[x][y]) == "object")
			{
				var currentPiece = testBoard[x][y];
				var currentPieceMoves = determineLegalMoves(testBoard, currentPiece, x, y);
				for (z = 0; z < currentPieceMoves.length; z++)
				{
					if (currentPiece.color == "black" && (futureWhiteKingPosition[0] == currentPieceMoves[z][0]) && (futureWhiteKingPosition[1] == currentPieceMoves[z][1]))
						whiteKingChecked = true;
					if (currentPiece.color == "white" && (futureBlackKingPosition[0] == currentPieceMoves[z][0]) && (futureBlackKingPosition[1] == currentPieceMoves[z][1]))
						blackKingChecked = true;
				}
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

function testCheckmate()
{
	var someoneCanMove = false;
	var currentPiece = null;
	var currentLegalMoves = null;
	
	for (a=0; a < 8; a++)
	{
		for (b = 0; b < 8; b++)
		{
			currentPiece = chessBoard[a][b];
			if (currentPiece != null || currentPiece != undefined)
			{
				currentLegalMoves = determineLegalMoves(chessBoard, currentPiece, a, b);
				if (currentLegalMoves.length > 0)
				{
					if (currentPiece.color == currentMove)
						someoneCanMove = true;
				}
			}
		}
	}
	var checkStatus = performCheckTest(chessBoard);
	if ((checkStatus == "both" || checkStatus == currentMove) && someoneCanMove == true)
		return "checkmate";
	else if (someoneCanMove == false)
		return "stalemate";
	return "nothing";
}

function cloneObject(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
