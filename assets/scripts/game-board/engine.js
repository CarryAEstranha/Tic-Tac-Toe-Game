import { IAMove } from "./minimax.js";

const searchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(searchParams);

const board = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
];

const gameStatus = {
    playerOne: -10,
    playerOneWins: 0,
    playerTwo: -10,
    playerTwoWins: 0,
    playingNow: 0,
    round: 0,
    ties: 0,
    winner: -10,
}

document.addEventListener("DOMContentLoaded", () => {
    newGame();

    modalButtons();
});

export const checkWinner = (board) => {
    let count = 0;

    for (let row = 0; row < 3; row++) {
        if (board[row][0] !== false && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            return board[row][0];
        }
    }

    for (let col = 0; col < 3; col++) {
        if (board[0][col] !== false && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            return board[0][col];
        }
    }

    if (board[0][0] !== false && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }

    if (board[0][2] !== false && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] !== false) {
                count = count + 1;
            }
        }
    }

    if (count === 10 - 1) {
        return -200;
    } else {
        return -100;
    }
}

const createBoard = (boardMatrix) => {
    const board = document.getElementById("board");

    while (board.firstChild) {
        board.firstChild.remove();
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const div = document.createElement("div");
            const img = document.createElement("img");

            if (boardMatrix[i][j] === 0) {
                div.className = "board-block-selected";
                div.style.pointerEvents = "none";

                img.className = "board-block-image-solid";
                img.src = "./assets/images/icons/icon-x.svg";

                div.appendChild(img);
                board.appendChild(div);
            } else if (boardMatrix[i][j] === 1) {
                div.className = "board-block-selected";
                div.style.pointerEvents = "none";

                img.className = "board-block-image-solid";
                img.src = "./assets/images/icons/icon-o.svg";

                div.appendChild(img);
                board.appendChild(div);
            } else {
                div.className = "board-block";

                img.className = "board-block-image-outline"

                if (gameStatus.playingNow === 0) {
                    img.src = "./assets/images/icons/icon-x-outline.svg";
                } else {
                    img.src = "./assets/images/icons/icon-o-outline.svg";
                }

                div.appendChild(img);
                board.appendChild(div);

                div.addEventListener("click", () => {
                    play(`${i}-${j}`);
                });
            }
        }
    }
}

const modalButtons = () => {
    const restartButton = document.getElementById("restart-button");

    const endGameModalButtonQuit = document.getElementById("end-game-modal-button-quit");
    const endGameModalButtonNextRound = document.getElementById("end-game-modal-button-next-round");

    const restartGameModalButtonCancel = document.getElementById("restart-game-modal-button-cancel");
    const restartGameModalButtonRestart = document.getElementById("restart-game-modal-button-restart");

    restartButton.addEventListener("click", () => {
        const restartGameModalContainer = document.getElementById("restart-game-modal-container");

        restartGameModalContainer.style.display = "flex";
    });

    endGameModalButtonQuit.addEventListener("click", () => {
        window.location.href = "/Tic-Tac-Toe-Game/";
    });

    endGameModalButtonNextRound.addEventListener("click", () => {
        const endGameModalContainer = document.getElementById("end-game-modal-container");

        endGameModalContainer.style.display = "none";

        newGame(true);
    });

    restartGameModalButtonCancel.addEventListener("click", () => {
        const restartGameModalContainer = document.getElementById("restart-game-modal-container");

        restartGameModalContainer.style.display = "none";
    });

    restartGameModalButtonRestart.addEventListener("click", () => {
        const restartGameModalContainer = document.getElementById("restart-game-modal-container");

        restartGameModalContainer.style.display = "none";

        newGame(false, true);
    });
}

const newGame = (nextRound, restart) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = false;
        }
    }

    validatePlayers(nextRound, restart);

    if (params.mode === "CPU") {
        if (gameStatus.playingNow === gameStatus.playerTwo) {
            board[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 3)] = gameStatus.playingNow;

            updatePlayingNow(true);
        }
    }

    createBoard(board);

    updateFooter();
    updatePlayingNow(false);
}

const play = (id) => {
    const index = id.split("-");

    if (params.mode === "CPU") {
        playCPU(index[0], index[1]);
    } else {
        playPVP(index[0], index[1]);
    }
}

const playCPU = (row, col) => {
    board[row][col] = gameStatus.playingNow;

    gameStatus.winner = checkWinner(board);

    if (gameStatus.winner !== -100) {
        updateWinner(gameStatus.winner);

        showWinner(gameStatus.winner);
    } else {
        updatePlayingNow(true);

        const move = IAMove(board, gameStatus.playerTwo);

        board[move.row][move.col] = gameStatus.playingNow;

        gameStatus.winner = checkWinner(board);

        if (gameStatus.winner !== -100) {
            updateWinner(gameStatus.winner);

            showWinner(gameStatus.winner);
        } else {
            updatePlayingNow(true);
        }
    }

    createBoard(board);
}

const playPVP = (row, col) => {
    board[row][col] = gameStatus.playingNow;

    gameStatus.winner = checkWinner(board);

    if (gameStatus.winner !== -100) {
        updateWinner(gameStatus.winner);

        showWinner(gameStatus.winner);
    } else {
        updatePlayingNow(true);
    }

    createBoard(board);
}

const showWinner = (result) => {
    const endGameModalContainer = document.getElementById("end-game-modal-container");
    const endGameModalTextContainer = document.getElementById("end-game-modal-text-container");
    const endGameModalTitle = document.getElementById("end-game-modal-title");
    const endGameModalTextImg = document.getElementById("end-game-modal-text-img");
    const endGameModalText = document.getElementById("end-game-modal-text");

    endGameModalTextContainer.style.opacity = "unset";

    if (gameStatus.playerOne === 0) {
        if (gameStatus.playerOne === result) {
            endGameModalTitle.innerHTML = "YOU WON!";

            endGameModalTextImg.src = "./assets/images/icons/icon-x.svg";
            endGameModalText.style.color = "#31C3BD";
        } else if (gameStatus.playerTwo === result) {
            endGameModalTitle.innerHTML = "OH NO, YOU LOST...";

            endGameModalTextImg.src = "./assets/images/icons/icon-o.svg";
            endGameModalText.style.color = "#F2B137";
        } else {
            endGameModalTitle.innerHTML = "ROUND TIED";

            endGameModalTextContainer.style.opacity = "0";
        }
    } else {
        if (gameStatus.playerTwo === result) {
            endGameModalTitle.innerHTML = "YOU WON!";

            endGameModalTextImg.src = "./assets/images/icons/icon-x.svg";
            endGameModalText.style.color = "#31C3BD";
        } else if (gameStatus.playerOne === result) {
            endGameModalTitle.innerHTML = "OH NO, YOU LOST...";

            endGameModalTextImg.src = "./assets/images/icons/icon-o.svg";
            endGameModalText.style.color = "#F2B137";
        } else {
            endGameModalTitle.innerHTML = "ROUND TIED";

            endGameModalTextContainer.style.opacity = "0";
        }
    }

    endGameModalContainer.style.display = "flex";
}

const updateFooter = () => {
    const footerElements = {
        playerOneContainer: document.getElementById("player-one-wins"),
        playerTwoContainer: document.getElementById("player-two-wins"),
        playerOneTitle: document.getElementById("player-one-wins-title"),
        playerTwoTitle: document.getElementById("player-two-wins-title"),
        playerOneValue: document.getElementById("player-one-wins-value"),
        playerTwoValue: document.getElementById("player-two-wins-value"),
        tiesValue: document.getElementById("ties-value")
    }

    if (gameStatus.playerOne === 0) {
        footerElements.playerOneContainer.style.background = "#31C3BD";
        footerElements.playerOneValue.innerHTML = gameStatus.playerOneWins;

        footerElements.playerTwoContainer.style.background = "#F2B137";
        footerElements.playerTwoValue.innerHTML = gameStatus.playerTwoWins;

        footerElements.tiesValue.innerHTML = gameStatus.ties;

        if (params.mode === "CPU") {
            footerElements.playerOneTitle.innerHTML = "X (YOU)";
            footerElements.playerTwoTitle.innerHTML = "O (CPU)";
        } else {
            footerElements.playerOneTitle.innerHTML = "X (PLAYER 1)";
            footerElements.playerTwoTitle.innerHTML = "O (PLAYER 2)";
        }
    } else {
        footerElements.playerOneContainer.style.background = "#F2B137";
        footerElements.playerOneValue.innerHTML = gameStatus.playerOneWins;

        footerElements.playerTwoContainer.style.background = "#31C3BD";
        footerElements.playerTwoValue.innerHTML = gameStatus.playerTwoWins;

        footerElements.tiesValue.innerHTML = gameStatus.ties;

        if (params.mode === "CPU") {
            footerElements.playerOneTitle.innerHTML = "O (YOU)";
            footerElements.playerTwoTitle.innerHTML = "X (CPU)";
        } else {
            footerElements.playerOneTitle.innerHTML = "O (PLAYER 1)";
            footerElements.playerTwoTitle.innerHTML = "X (PLAYER 2)";
        }
    }
}

const updatePlayingNow = (updateVariable) => {
    const turnImage = document.getElementById("turn-image");

    if (updateVariable === false) {
        if (gameStatus.playingNow === 0) {
            turnImage.src = "./assets/images/icons/icon-x-grey.svg";
        } else {
            turnImage.src = "./assets/images/icons/icon-o-grey.svg";
        }
    } else {
        if (gameStatus.playingNow === 0) {
            turnImage.src = "./assets/images/icons/icon-o-grey.svg";

            gameStatus.playingNow = 1;
        } else {
            turnImage.src = "./assets/images/icons/icon-x-grey.svg";

            gameStatus.playingNow = 0;
        }
    }
}

const updateWinner = (result) => {
    if (gameStatus.round === 0) {
        gameStatus.round = 1;
    } else {
        gameStatus.round = 0;
    }

    if (gameStatus.playerOne === 0) {
        if (result === 0) {
            gameStatus.playerOneWins = gameStatus.playerOneWins + 1;
        } else if (result === 1) {
            gameStatus.playerTwoWins = gameStatus.playerTwoWins + 1;
        } else {
            gameStatus.ties = gameStatus.ties + 1;
        }
    } else {
        if (result === 1) {
            gameStatus.playerOneWins = gameStatus.playerOneWins + 1;
        } else if (result === 0) {
            gameStatus.playerTwoWins = gameStatus.playerTwoWins + 1;
        } else {
            gameStatus.ties = gameStatus.ties + 1;
        }
    }
}

const validatePlayers = (nextRound, restart) => {
    params.player = parseFloat(params.player);

    if (restart === true) {
        gameStatus.playingNow = gameStatus.round;
    } else {
        if (nextRound === true) {
            gameStatus.playingNow = gameStatus.round;
        } else {
            if (params.player === 0) {
                gameStatus.playerOne = 0;
                gameStatus.playerTwo = 1;
            } else {
                gameStatus.playerOne = 1;
                gameStatus.playerTwo = 0;
            }
        }
    }
}
