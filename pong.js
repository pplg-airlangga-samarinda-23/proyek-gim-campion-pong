let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// players
let playerWidth = 10;
let playerHeight = 80;
let playerHeight = 100;
let playerVelocityY = 0;

let player1 = {
    x: 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

let player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

// ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: 1,
    velocityY: 2
};

let player1Score = 0;
let player2Score = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
    document.getElementById("resettombol").addEventListener("click", resetGameScores);
};

function update() {
    if (gameOver) return;

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // player1
    context.fillStyle = "white";
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    // player2
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

    if (ball.y <= 0 || (ball.y + ballHeight >= boardHeight)) {
        ball.velocityY *= -1;
    }

    // collision detection
    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.velocityX *= -1;
            increaseBallSpeed();
        }
    } else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) {
            ball.velocityX *= -1;
            increaseBallSpeed();
        }
    }

    // game over logic
    if (ball.x < 0) {
        player2Score++;
        checkGameOver();
        resetGame(1);
    } else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        checkGameOver();
        resetGame(-1);
    }

    // score display
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth / 5, 45);
    context.fillText(player2Score, boardWidth * 4 / 5 - 45, 45);

    // draw middle line
    for (let i = 10; i < board.height; i += 25) {
        context.fillRect(board.width / 2 - 10, i, 5, 5);
    }
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function movePlayer(e) {
    HEAD
    if (e.code === "KeyW") {
        player1.velocityY = -4;
    } else if (e.code === "KeyS") {
        player1.velocityY = 4;
    }

    if (e.code === "ArrowUp") {
        player2.velocityY = -4;
    } else if (e.code === "ArrowDown") {
        player2.velocityY = 4;
    //player1
    if (e.code == "KeyW") {
        player1.velocityY = -4;
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 3;
    }

    //player2
    if (e.code == "ArrowUp") {
        player2.velocityY = -4;
    }
}

function stopPlayer(e) {
    if (e.code === "KeyW" || e.code === "KeyS") {
        player1.velocityY = 0;
    }
    if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        player2.velocityY = 0;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame(direction) {
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: direction,
        velocityY: 2 // or 4 based on your preference
    };
}

function increaseBallSpeed() {
    ball.velocityX *= 1.4; // Adjust speed increase as needed
    ball.velocityY *= 1.4;

}

function checkGameOver() {
    if (player1Score >= 5 || player2Score >= 5) {
        let winner = player1Score >= 5 ? "Player 1 Wins!" : "Player 2 Wins!";
        context.font = "30px sans-serif";
        context.fillText(winner, boardWidth / 2 - context.measureText(winner).width / 2, boardHeight / 2);
        gameOver = true; 
    }
}

function resetGameScores() {
    player1Score = 0;
    player2Score = 0;
    gameOver = false; // Reset game over flag
    resetGame(1); // Reset the ball
    requestAnimationFrame(update); // Restart the game loop
}
