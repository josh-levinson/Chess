// Created by Josh
var chessBoard = InitBoard();

var whiteKingHasMoved = false; // need for castling
var blackKingHasMoved = false; 

varKingIsCastling = false;

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
   
   $('.pawnConfirm').click(function(){				
			
			// need to find the pawn which set us off
			var pawnCoordinates;
			var localPiece; // temp to hold current piece
			for (var l=0; l<8; l++)
			{
				if ((isOccupied(chessBoard, 0, l)) != 'empty')
				{
					localPiece = chessBoard[0][l];
					if (localPiece.type == 'pawn')
					{
						pawnCoordinates = [0, l];
					}
				}
				if ((isOccupied(chessBoard, 7, l)) != 'empty')
				{
					localPiece = chessBoard[7][l];
					if (localPiece.type == 'pawn')
					{
						pawnCoordinates = [7, l];
					}
				}
			}
			if (pawnCoordinates != 'undefined')
			{
				var movedPawn = chessBoard[pawnCoordinates[0]][pawnCoordinates[1]];
				var movedPawnDomSpace = convertSpaceModelToDom([pawnCoordinates]);
				var movedPawnDom = $(movedPawnDomSpace + ' .piece');
				var colorPrefix = movedPawn.color.charAt(0).toUpperCase();
				var pawnConfirmed = $('.pawnSelect select').val();
				switch (pawnConfirmed)
				{
					case 'Queen':
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].type = 'queen';
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].value = 9;
						$(movedPawnDom).html(colorPrefix + 'Q');
						$(movedPawnDom).removeClass('pawn').addClass('queen');
						break;
					case 'Rook':
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].type = 'rook';
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].value = 5;
						$(movedPawnDom).html(colorPrefix + 'R');
						$(movedPawnDom).removeClass('pawn').addClass('rook');
						break;
					case 'Bishop':
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].type = 'bishop';
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].value = 3;
						$(movedPawnDom).html(colorPrefix + 'B');
						$(movedPawnDom).removeClass('pawn').addClass('bishop');
						break;
					case 'Knight':
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].type = 'knight';
						chessBoard[pawnCoordinates[0]][pawnCoordinates[1]].value = 3;
						$(movedPawnDom).html(colorPrefix + 'Kn');
						$(movedPawnDom).removeClass('pawn').addClass('knight');
						break;
				}	
			}
		$('.pawnSelect').hide();
		$('.pawnSelect select').val('Queen');
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

	newBoard.whiteKingPos = [0, 4];
        newBoard.blackKingPos = [7, 4];
        
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
	/* takes an array of chess pieces and returns a string that represents
	 * a group of selectors which can be used by jQuery
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

function getSpaceFromPiece(piece)
{
  // take piece, return row/col pair
  var returnSpace = [];
  returnSpace[0] = parseInt(piece.parent()[0].classList[3].substr(3, 1));
  returnSpace[1] = parseInt(piece.parent()[0].classList[4].substr(3, 1));

  return returnSpace;
}

function getOppositeColor(color)
{
	if (color == "white")
		return "black";
	else
		return "white";
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
			alert("Checkmate: " + lastMove + " wins!");
	}
}

function performMove(movedDomPiece, targetSpaceDom)
{
		
	// defensive coding to protecting against calls after dom has moved
	if (typeof movedDomPiece == 'undefined')
		return false;
		
	// remove possibility of last En Passant
	$('.enPassant').removeClass('enPassant');
	
	// get piece from location of dropped piece
        var pieceSpace = getSpaceFromPiece(movedDomPiece);
        
	var pieceRow = pieceSpace[0]; 
	var pieceCol = pieceSpace[1];

	var movedPiece = chessBoard[pieceRow][pieceCol];
	
	var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
	var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
	var destSpaceOccupied = isOccupied(chessBoard, spaceRow, spaceCol);
	
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
			{
				var spaceDiff = pieceCol - spaceCol;
				// check if castling
				if (spaceDiff > 1)
				{
					// moving left, move rook right
					chessBoard[0][2] = chessBoard[0][0];
					chessBoard[0][0] = null;
					$('.c1').append($('.a1 .piece'));
					$('.a1').empty();
					$('.c1 .piece').css('top', '0');
					$('.c1 .piece').css('left', '0');
					$('.c1 .piece').css('right', '0');
				}
				else if (spaceDiff < -1)
				{
					// moving right, move rook left
					chessBoard[0][5] = chessBoard[0][7];
					chessBoard[0][7] = null;
					$('.f1').append($('.h1 .piece'));
					$('.h1').empty();
					$('.f1 .piece').css('top', '0');
					$('.f1 .piece').css('left', '0');
					$('.f1 .piece').css('right', '0');
				}
				whiteKingHasMoved = true;
			}
			chessBoard.whiteKingPos = [spaceRow, spaceCol];
		}
		else
		{
			if (blackKingHasMoved == false)
			{
				var spaceDiff = pieceCol - spaceCol;
				// check if castling
				if (spaceDiff > 1)
				{
					// moving left, move rook right
					chessBoard[7][2] = chessBoard[7][0];
					chessBoard[7][0] = null;
					$('.c8').append($('.a8 .piece'));
					$('.a8').empty();
					$('.c8 .piece').css('top', '0');
					$('.c8 .piece').css('left', '0');
					$('.c8 .piece').css('right', '0');
				}
				else if (spaceDiff < -1)
				{
					// moving right, move rook left
					chessBoard[7][5] = chessBoard[7][7];
					chessBoard[7][7] = null;
					$('.f8').append($('.h8 .piece'));
					$('.h8').empty();
					$('.f8 .piece').css('top', '0');
					$('.f8 .piece').css('left', '0');
					$('.f8 .piece').css('right', '0');
				}
				blackKingHasMoved = true;
			}
			blackKingPosition = [spaceRow, spaceCol];
		}
	}		
	else if (movedPiece.type == 'pawn')
	// check for pawn promotion/en passant
	{	
		// set flag for En Passant (for next turn)
		var spacesMoved = Math.abs(spaceRow - pieceRow);
		
		if (spacesMoved == 2)
			$(movedDomPiece).addClass('enPassant');
			
		// check if last row for pawn promotion
		var destRow;
		var colorPrefix;
		if (movedPiece.color == 'white')
		{
			destRow = 7;
			colorPrefix = 'W';
		}
		else
		{
			destRow = 0;
			colorPrefix = 'B';
		}			
		if (spaceRow == destRow)
		{
			$('.pawnSelect').show();
		}
		
		// check for En Passant
		if (spaceCol != pieceCol)
		{
			/* moved diagonally for capture, must verify two conditions for En Passant:
			a) destination space is empty, b) row "behind" piece has pawn */
			
			if (destSpaceOccupied == 'empty')
			{
				if (movedPiece.color == 'white')
				{
					takenSpace = $(convertSpaceModelToDom([[spaceRow - 1, spaceCol]]));
					takenSpace.empty();
					chessBoard[spaceRow - 1][spaceCol] == null;
				}
				else
				{
					takenSpace = $(convertSpaceModelToDom([[spaceRow + 1, spaceCol]]));
					takenSpace.empty();
					chessBoard[spaceRow + 1][spaceCol] == null;
				}
			}
			
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
                var pieceSpace = getSpaceFromPiece(movedDomPiece); 
		var pieceRow = pieceSpace[0]; 
		var pieceCol = pieceSpace[1]; 
		
		var movedPiece = chessBoard[pieceRow][pieceCol];
		if (movedPiece == null)
			return false;
		
		var spaceRow = parseInt(targetSpaceDom[0].classList[3].substr(3, 1));
		var spaceCol = parseInt(targetSpaceDom[0].classList[4].substr(3, 1));
		
		if (movedPiece.type == 'king')
		{
			if (movedPiece.color == 'white')
				chessBoard.whiteKingPos = [spaceRow, spaceCol];
			else
				chessBoard.blackKingPos = [spaceRow, spaceCol];
		}
		
		
		var targetSpace = [spaceRow, spaceCol];
		var legalMoves = determineLegalMoves(chessBoard, pieceRow, pieceCol);
		
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

function determineLegalMoves(board, pieceRow, pieceCol)
{
	var legalMoves = []; // holds the return moves, a string of row, col pairs
	
	var piece = board[pieceRow][pieceCol];
        
        if (piece != null)
	{
		switch (piece.type)
		{
			case 'pawn':
				legalMoves = addPawnMoves(board, pieceRow, pieceCol);			
				break;
			case 'bishop':
				legalMoves = addDiagonalMoves(board, pieceRow, pieceCol);
				break;
			case 'knight':
				legalMoves = addKnightMoves(board, pieceRow, pieceCol);
				break;
			case 'rook':
				legalMoves = addStraightLineMoves(board, pieceRow, pieceCol);
				break;			
			case 'queen':
				legalMoves = addDiagonalMoves(board, pieceRow, pieceCol).concat(addStraightLineMoves(board, pieceRow, pieceCol));
				break;
			case 'king':
				legalMoves = addKingMoves(board, pieceRow, pieceCol).concat(addKingCastleMoves(board, pieceRow, pieceCol));
				break;
		}
	}
	return legalMoves;	
}

function addStraightLineMoves(board, pieceRow, pieceCol)
{
	var straightMoves = []; // holds return moves
	
	var piece = board[pieceRow][pieceCol];
        
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

function addDiagonalMoves(board, pieceRow, pieceCol)
{
	var diagonalMoves = [];
	
	var piece = board[pieceRow][pieceCol];
        
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

function addKnightMoves(board, pieceRow, pieceCol)
{
	var knightMoves = [];
	// have to manually check moves here unless I figure out a shortcut later
	
	var piece = board[pieceRow][pieceCol];
        
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

function addPawnMoves(board, pieceRow, pieceCol)
{
	pawnMoves = [];
	
	var piece = board[pieceRow][pieceCol];
        
        if (piece.color == 'black')
	{
		dir = -1; // going down
		fRow = 6;
	}
	else
	{
		dir = 1; // up
		fRow = 1;
	}
	
        // can go up/down if space is unoccupied
        if (isOccupied(board, (pieceRow + dir), pieceCol) == 'empty')
          pawnMoves.push([pieceRow + dir, pieceCol]);
	
	if (pieceRow > 0 && pieceRow < 7)
	{
		// if first space is empty, check if first move, if so, add two-space move
		if (pieceRow == fRow)
		{
			if (isOccupied(board, (pieceRow + (dir * 2)), pieceCol) == 'empty')
				pawnMoves.push([pieceRow + (dir * 2), pieceCol]);
		}
		// or capturing diagonal spaces
		if (isOccupied(board, (pieceRow + dir), pieceCol - 1) == getOppositeColor(piece.color))
			pawnMoves.push([pieceRow + dir, pieceCol - 1]);
		if (isOccupied(board, (pieceRow + dir), pieceCol + 1) == getOppositeColor(piece.color))
			pawnMoves.push([pieceRow + dir, pieceCol + 1]);
		// or En Passant moves
		if (isOccupied(board, pieceRow, (pieceCol + 1)) == getOppositeColor(piece.color))
		{
			var adjPawn = $(convertSpaceModelToDom([[pieceRow, pieceCol + 1]])).children();
			if (adjPawn.hasClass('enPassant'))
				pawnMoves.push([pieceRow + dir, pieceCol + 1]);
		}
		if (isOccupied(board, pieceRow, (pieceCol - 1)) == getOppositeColor(piece.color))
		{
			var adjPawn = $(convertSpaceModelToDom([[pieceRow, pieceCol - 1]])).children();
			if (adjPawn.hasClass('enPassant'))
				pawnMoves.push([pieceRow + dir, pieceCol - 1]);
		}			
	}
	
	return pawnMoves;
}

function addKingMoves(board, pieceRow, pieceCol)
{
	kingMoves = [];
	
	var piece = board[pieceRow][pieceCol];
        
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

function addKingCastleMoves(board, pieceRow, pieceCol)
{
      var piece = board[pieceRow][pieceCol];	
  
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
				var currentPieceMoves = determineLegalMoves(testBoard, x, y);
				for (z = 0; z < currentPieceMoves.length; z++)
				{
					if (currentPiece.color == "black" && (testBoard.whiteKingPos[0] == currentPieceMoves[z][0]) && (testBoard.whiteKingPos[1] == currentPieceMoves[z][1]))
						if (currentPiece.type != "pawn" || y != testBoard.whiteKingPos[1])	
							whiteKingChecked = true;
					if (currentPiece.color == "white" && (testBoard.blackKingPos[0] == currentPieceMoves[z][0]) && (testBoard.blackKingPos[1] == currentPieceMoves[z][1]))
						if (currentPiece.type != "pawn" || y != testBoard.blackKingPos[1])
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
	var stillChecked = true;
	var checkStatus;
	
	for (a=0; a < 8; a++)
	{
		for (b = 0; b < 8; b++)
		{
			currentPiece = chessBoard[a][b];
			if (currentPiece != null && currentPiece != undefined)
			{
				currentLegalMoves = determineLegalMoves(chessBoard, a, b);
				if (currentLegalMoves.length > 0)
				{
					if (currentPiece.color == currentMove)
					{
                                                if (currentPiece.type != "king")	
                                                 someoneCanMove = true;
						var futureBoard = cloneObject(chessBoard);
						for (c = 0; c < currentLegalMoves.length; c++)
						{
                                                        if (currentPiece.type == "king" && currentPiece.color == "black")
                                                          futureBoard.blackKingPos = [currentLegalMoves[c][0], currentLegalMoves[c][1]];
                                                        else if (currentPiece.type == "king" && currentPiece.color == "white")
                                                          futureBoard.whiteKingPos = [currentLegalMoves[c][0], currentLegalMoves[c][1]];
                                                        
                                                        futureBoard[currentLegalMoves[c][0]][currentLegalMoves[c][1]] = currentPiece;
						        futureBoard[a][b] = null;
						        
                                                        checkStatus = performCheckTest(chessBoard);
						        if (performCheckTest(futureBoard) != checkStatus)
								stillChecked = false;
						}
					}
				}
			}
		}
	}
	if ((checkStatus == "both" || checkStatus == currentMove) && someoneCanMove == true && stillChecked)
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
