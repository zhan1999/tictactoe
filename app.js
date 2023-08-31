const params = {
	boardSize : 3,
	empty : 0,
	gameStatusResultNoWinner : 0,
	gameStatusResultDraw : 3,
}

const board = [
	[params.empty, params.empty, params.empty],
	[params.empty, params.empty, params.empty],
	[params.empty, params.empty, params.empty]
];

const players = [1, 2];

const gameStatus = {
	xMove : true,
	result : params.gameStatusResultNoWinner,  
	numberOfMoves : 0
}

const resultMsgs = ['X выиграл', 'O выиграл', 'Ничья!!'];

const cells = document.getElementById('container').children;

for (let i=0; i<cells.length; i++)
	cells[i].addEventListener('click', move);
	
function move() {
	
	if (gameStatus.result) {
		reset();
		return;
	}

	let x = this.id[0];
	let y = this.id[1];

	if (board[x][y] !== params.empty)
		return;

	board[x][y] = gameStatus.xMove ? players[0] : players[1];

	gameStatus.numberOfMoves++;

	gameStatus.xMove = !gameStatus.xMove;

	const transposedBoard = board[0].map((_, colIndex) => board.map(row => row[colIndex]));

	for (const player of players) 
		gameStatus.result |= isDiagonalWinner(player, board) || isRowWinner(player, board) || isRowWinner(player, transposedBoard);
	
	if (gameStatus.numberOfMoves === params.boardSize*params.boardSize && !gameStatus.result )
		gameStatus.result = params.gameStatusResultDraw;

	displayBoard();

	if (gameStatus.result)
		displayBanner(resultMsgs[gameStatus.result-1], true);
}

function isDiagonalWinner (player, board) {
	let won = true;
	for (let i = 0; i<params.boardSize; i++){
		if (board[i][i] !== player)
			won = false;
	}
	if (won)
		return player;

	won = true;		
	for (let i = 0; i<params.boardSize; i++){
		if (board[params.boardSize-1-i][i] !== player)
			won = false;
	}
	if (won)
		return player;
	return params.gameStatusResultNoWinner;
};

function isRowWinner (player, board) {
	let won = false;
	board.forEach(r => {
		if (r.every (v => v === player))
			won = true;
		}
	);
	if (won)
		return player;
	return params.gameStatusResultNoWinner;
};

function displayBoard () {
	let vals = ['','X','O'];

	for (let i = 0; i<params.boardSize; i++){
		for (let j = 0; j<params.boardSize; j++)
			document.getElementById('' + i + j).innerHTML = vals[board[i][j]];
	};
}

function reset() {
	for (let i = 0; i<params.boardSize; i++)
		for (let j = 0; j<params.boardSize; j++)
			board[i][j] = params.gameStatusResultNoWinner;

	gameStatus.xMove = true;
	gameStatus.result = params.gameStatusResultNoWinner;
	gameStatus.numberOfMoves = 0;
	displayBanner('',  false);
	displayBoard();
};

function displayBanner(msg, show) {
	document.getElementById('banner').innerHTML = msg;
	document.getElementById('banner').style.display = show ? 'block' : 'none';
};



