'use strict'

let snakeContainer = document.getElementById('snake-container');
let snakeCanvas = document.getElementById('snake-canvas');


let scoreDisplay = document.getElementById('score');
let lengthDisplay = document.getElementById('length');

snakeCanvas.width = snakeContainer.offsetWidth - 60;
snakeCanvas.height = snakeCanvas.width / 2.5;

const blocksX = 40;
const blocksY = 16; 
const pixelsPerBlock = snakeCanvas.height / blocksY;

let centerX = (Math.ceil(blocksX / 2) - 1) * pixelsPerBlock;
let centerY = (Math.ceil(blocksY / 2) - 1) * pixelsPerBlock;

const interval = 80;

const eventKeysToDirection = {
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
    ArrowRight: 'right',
    ArrowLeft: 'left',
    ArrowUp: 'up',
    ArrowDown: 'down',
};

const oppositeDirections = {
    right: 'left',
    left: 'right',
    up: 'down',
    down: 'up',
};

let score = 0;
let length = 1;

let snakeCoords = {
  H: { x: centerX, y: centerY },
  B: [],
  F: {},
};

do {
  snakeCoords.F = {
    x: Math.floor(Math.random() * blocksX) * pixelsPerBlock,
    y: Math.floor(Math.random() * blocksY) * pixelsPerBlock,
  };
} while (snakeCoords.F.x === centerX && snakeCoords.F.y === centerY);

let gameOver = false;
let oppositeDirection = null;
let moveDirection = null;

let repeat = window.setInterval(main, interval);

document.addEventListener('keydown', event => {

    event.preventDefault();
    let direction = eventKeysToDirection[event.key] || moveDirection;
    moveDirection = direction === oppositeDirection ? moveDirection : direction;
});

function main() {
    moveSnake();
    checkBounds();
    gameOver = checkPassThrough(snakeCoords.H);
    checkFood();
    render();
    if (gameOver) {
        clearInterval(repeat);
    }
}
function moveSnake() {
    if (moveDirection === null) {
        return;
    } 
    snakeCoords.B.unshift({ x: snakeCoords.H.x, y: snakeCoords.H.y });
    if (moveDirection === 'up') {
        snakeCoords.H.y -= pixelsPerBlock; 
    } else if (moveDirection === 'down') {
        snakeCoords.H.y += pixelsPerBlock;
    } else if (moveDirection === 'right') {
        snakeCoords.H.x += pixelsPerBlock;
    } else {
        snakeCoords.H.x -= pixelsPerBlock;
    }
    snakeCoords.B.pop();

    if (snakeCoords.B.length > 0) {
        oppositeDirection = oppositeDirections[moveDirection];
    }
}

function checkBounds() {
  if (
      snakeCoords.H.x < 0 ||
      snakeCoords.H.x > snakeCanvas.width - pixelsPerBlock ||
      snakeCoords.H.y < 0 ||
      snakeCoords.H.y > snakeCanvas.height - pixelsPerBlock
  ) {
      gameOver = true;
  }
}
function checkPassThrough(obj) {
    if (!gameOver) {
        return(
            snakeCoords.B.findIndex(item => {
                return obj.x === item.x && obj.y === item.y;
            }) !== -1
        );
    } else {
        return gameOver;


    }
}

function checkFood() {
    if (
        snakeCoords.H.x === snakeCoords.F.x &&
        snakeCoords.H.y === snakeCoords.F.y &&
        !gameOver
    ) {
        do {
            snakeCoords.F = {
                x: Math.floor(Math.random() * blocksX) * pixelsPerBlock,
                y: Math.floor(Math.random() * blocksY) * pixelsPerBlock,
            };
        } while (
            (snakeCoords.F.x === snakeCoords.H.x &&
                snakeCoords.F.y === snakeCoords.H.y) ||
            checkPassThrough(snakeCoords.F)
        );
      for (let i = 0; i < 3; i++) {
          snakeCoords.B.push(0);
      }
      score++;
      length += 3;
    }
}

function render() {
    if (!gameOver) {
        let canvas = snakeCanvas;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.srokeStyle = 'black';
        ctx.fillStyle = 'brown';

        ctx.fillRect(
            snakeCoords.F.x,
            snakeCoords.F.y,
            pixelsPerBlock,
            pixelsPerBlock,
        );
        ctx.fillStyle = 'black';
        for (let obj of snakeCoords.B) {
            ctx.fillRect(obj.x, obj.y, pixelsPerBlock, pixelsPerBlock);
        }
        ctx.fillStyle = 'green';
        ctx.fillRect (
            snakeCoords.F.x,
                snakeCoords.F.y,
                pixelsPerBlock,
                pixelsPerBlock,
        );

        scoreDisplay.innerHTML = `Score: ${score}`;
        lengthDisplay.innerHTML = `Length: ${length}`;
    }
}