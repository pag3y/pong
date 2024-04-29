let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

const BALL_SIZE = 5;
let ballPosition = {x:20, y: 30};

let xSpeed = 4; //Controls the horizontal speed of the ball.
let ySpeed = 2; //Controls the vertical speed of the ball

const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 20;
const PADDLE_OFFSET = 10;

let leftPaddleTop = 10;
let rightPaddleTop = 30;

document.addEventListener("mousemove", e => {
    rightPaddleTop = e.y - canvas.offsetTop;
});

function draw () {

    // Fills the canvas with black.
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    
    // Fills everything else with white.
    ctx.fillStyle = "white";

    //Draws the ball on the canvas.
    ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);

    //Draws the paddles.
    ctx.fillRect(
        PADDLE_OFFSET,
        leftPaddleTop,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );
    
    ctx.fillRect(
        width - PADDLE_WIDTH - PADDLE_OFFSET,
        rightPaddleTop,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );
}

function update() {
    ballPosition.x += xSpeed
    ballPosition.y += ySpeed
}

function checkPaddleCollision(ball, paddle) {
    // Check if the paddle and ball overlap vertically and horizontally.
    return (
        ball.left < paddle.right &&
        ball.right > paddle.left &&
        ball.top < paddle.bottom &&
        ball.bottom > paddle.top
    );
}

function adjustAngle(distanceFromTop, distanceFromBottom) {
    if (distanceFromTop < 0) {
        //If the ball hits near the top of the paddle, reduce ySpeed.
        ySpeed -= 0.5;
    }
    else if (distanceFromBottom < 0) {
        //If the ball hits near the bottom of the paddle, increase ySpeed.
        ySpeed += 0.5;
    }
}
//This function checks if the ball has collided with one of the four edges of the canvas.
function checkCollision() {
    let ball = {
        left: ballPosition.x,
        right: ballPosition.x + BALL_SIZE,
        top: ballPosition.y,
        bottom: ballPosition.y + BALL_SIZE
    }

    if(ball.left < 0 || ball.right > width) {
        xSpeed = -xSpeed;
    }

    if(ball.top < 0 || ball.bottom > height) {
        ySpeed = -ySpeed;
    }

    let leftPaddle = {
        left: PADDLE_OFFSET,
        right: PADDLE_OFFSET + PADDLE_WIDTH,
        top: leftPaddleTop,
        bottom: leftPaddleTop + PADDLE_HEIGHT
    }

    let rightPaddle = {
        left: width - PADDLE_WIDTH - PADDLE_OFFSET,
        right: width - PADDLE_OFFSET,
        top: rightPaddleTop,
        bottom: rightPaddleTop + PADDLE_HEIGHT
    }

    if(checkPaddleCollision(ball, leftPaddle)) {
        //Left paddle collision happened.
        let distanceFromTop = ball.top - rightPaddle.top;
        let distanceFromBottom = leftPaddle.bottom - ball.bottom;
        adjustAngle(distanceFromTop, distanceFromBottom);
        xSpeed =  Math.abs(xSpeed);
    }

    if(checkPaddleCollision(ball, rightPaddle)) {
        //Right paddle collision happened.
        xSpeed = -Math.abs(xSpeed);
    }
}

function gameLoop(){

    draw();
    update();
    checkCollision();

    setTimeout(gameLoop, 30); //Calls the function after 30 seconds timeout.
}

gameLoop();