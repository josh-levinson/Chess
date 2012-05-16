/**
 * @author Josh
 */

function InitBoard()
{
	// init pieces to start
	var whiteKing = {type: 'king', color: 'white', value: 100};
	var blackKing = {type: 'king', color: 'black', value: 100};
	
	var whiteQueen = {type: 'queen', color: 'white', value: 10};
	var blackQueen = {type: 'queen', color: 'black', value: 10};
	
	var whiteRook = {type: 'rook', color: 'white', value: 5};
	var blackRook = {type: 'rook', color: 'black', value: 5};
	
	var whiteKnight = {type: 'knight', color: 'white', value: 3};
	var blackKnight = {type: 'knight', color: 'black', value: 3};
	
	var whiteBishop = {type: 'bishop', color: 'white', value: 3};
	var blackBishop = {type: 'bishop', color: 'black', value: 3};
	
	var whitePawn = {type: 'pawn', color: 'white', value: 1};
	var blackPawn = {type: 'pawn', color: 'black', value: 1};

	var chessBoard = [];
	
	// initiate multi-dimensional array for chessboard
	for (i=0; i<8; i++)
	{
		chessBoard[i] = [];
	}
	
	for (i=0; i<8; i++)
	{
		chessBoard[1][i] = blackPawn;
		chessBoard[6][i] = whitePawn;				
	}

	chessBoard[0][0], chessBoard[0][7] = whiteRook;
	chessBoard[7][0], chessBoard[7][7] = blackRook;
				
	chessBoard[0][1], chessBoard[0, 6] = whiteKnight;
	chessBoard[7][1], chessBoard[7, 6] = blackKnight;
				
	chessBoard[0][2], chessBoard[0, 5] = whiteBishop;
	chessBoard[7][2], chessBoard[7, 5] = blackBishop;
				
	chessBoard[0][3] = whiteQueen;
	chessBoard[7][3] = blackQueen;
				
	chessBoard[0][4] = whiteKing;
	chessBoard[7][4] = blackKing;

	return chessBoard;
}

function DetermineLegalMoves(piece, location)
{
	var color = piece.color;
	var type = piece.type;
	var currentRow = location[0];
	var currentCol = location[1];
	
	var legalMoves; // holds the return moves, a string of locations
	
	switch (type)
	{
		case 'pawn':
			if (color == 'black')
				return currentRow + (currentCol - 1);
			else
				return currentRow + (currentCol + 1);
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
	
	
}


 $(document).ready(function(){
   
   var newBoard = InitBoard();

   
   $('.piece').draggable({
	
   });
   
   $('.space').droppable({
			hoverClass: 'piece-hover',
			drop: function(event, ui) {
				$(this).addClass("piece-dropped");
			}
   });
   
});
   