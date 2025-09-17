const canvas = document.getElementById('pingPongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game variables
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;

let playerPaddle = {
    x: 0,
    y: (canvas.height - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0 // movement speed
};

let aiPaddle = {
    x: canvas.width - PADDLE_WIDTH,
    y: (canvas.height - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0 // movement speed
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: 5, // ball speed in x direction
    dy: 5  // ball speed in y direction
};

let playerScore = 0;
let aiScore = 0;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "75px Arial";
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "WHITE");
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx; // Serve in the opposite direction
    ball.dy = 5; // Reset vertical speed
}

function collision(b, p) {
    b.top = b.y - b.size / 2;
    b.bottom = b.y + b.size / 2;
    b.left = b.x - b.size / 2;
    b.right = b.x + b.size / 2;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.left < p.right && b.top < p.bottom && b.right > p.left && b.bottom > p.top;
}

function update() {
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y + ball.size / 2 > canvas.height || ball.y - ball.size / 2 < 0) {
        ball.dy = -ball.dy;
    }

    // Player paddle collision
    if (collision(ball, playerPaddle)) {
        let collidePoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
        collidePoint = collidePoint / (playerPaddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        ball.dx = Math.abs(ball.dx); // Ensure ball goes right
        ball.dx = ball.dx * Math.cos(angleRad);
        ball.dy = ball.dx * Math.sin(angleRad);
    }

    // AI paddle collision
    if (collision(ball, aiPaddle)) {
        let collidePoint = ball.y - (aiPaddle.y + aiPaddle.height / 2);
        collidePoint = collidePoint / (aiPaddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        ball.dx = -Math.abs(ball.dx); // Ensure ball goes left
        ball.dx = ball.dx * Math.cos(angleRad);
        ball.dy = ball.dx * Math.sin(angleRad);
    }

    // Score handling
    if (ball.x - ball.size / 2 < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.size / 2 > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Player paddle movement boundaries
    playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.y + playerPaddle.dy));

    // AI paddle simple AI
    let aiLevel = 0.1; // How fast AI reacts to the ball
    aiPaddle.y += (ball.y - (aiPaddle.y + aiPaddle.height / 2)) * aiLevel;
    aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));
}

// Event Listeners for Player Paddle Movement
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            playerPaddle.dy = -6;
            break;
        case 'ArrowDown':
            playerPaddle.dy = 6;
            break;
    }
});

document.addEventListener('keyup', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            playerPaddle.dy = 0;
            break;
    }
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, "WHITE");
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, "WHITE");

    // Draw ball
    drawCircle(ball.x, ball.y, ball.size / 2, "WHITE");

    // Draw scores
    drawText(playerScore, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(aiScore, 3 * canvas.width / 4, canvas.height / 5, "WHITE");
}
