export const IAMove = (board, CPU) => {
    const players = {
        CPU: 0,
        HUM: 0
    }

    if (CPU === 0) {
        players.CPU = "x";
        players.HUM = "o";
    } else {
        players.CPU = "o";
        players.HUM = "x";
    }

    const boardFlat = matrixToArray(board);

    const IABestMove = minimax(boardFlat, players.CPU, players.HUM, players.CPU);
    let count = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (IABestMove.index === count) {
                return {
                    row: i,
                    col: j
                };
            }

            count = count + 1;
        }
    }
}

const minimax = (board, CPU, human, player) => {
    const avaibleSpots = emptyIndexies(board);

    if (winning(board, human)) {
        return { score: -10 }
    } else if (winning(board, CPU)) {
        return { score: 10 }
    } else if (avaibleSpots.length === 0) {
        return { score: 0 }
    }

    const moves = [];

    for (let i = 0; i < avaibleSpots.length; i++) {
        const move = {
            index: board[avaibleSpots[i]]
        };

        board[avaibleSpots[i]] = player;

        if (player === CPU) {
            const result = minimax(board, CPU, human, human);
            
            move.score = result.score;
        } else {
            const result = minimax(board, CPU, human, CPU);
            
            move.score = result.score;
        }

        board[avaibleSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove = 0;

    if (player === CPU) {
        let bestScore = -10000;
        
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;

        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

const emptyIndexies = (board) => {
    return board.filter(o => o !== "o" && o !== "x");
}

const matrixToArray = (matrix) => {
    const array = [];

    let contador = 0;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === false) {
                array.push(contador);
            } else if (matrix[i][j] === 0) {
                array.push("x");
            } else if (matrix[i][j] === 1) {
                array.push("o");
            }

            contador = contador + 1;
        }
    }

    return array;
}

const winning = (board, player) => {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
}