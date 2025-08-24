// script.js

const board = document.getElementById("game-board");
const resetBtn = document.querySelector("#reset-btn");
const gameOverModal = document.querySelector("#gameOverModal");

const boardSize = 20;
let snake, food, direction, score, gameInterval;
const eatSound = new Audio("sounds/eatSound.wav");
const gameOverSound = new Audio("sounds/gameOver.wav");
const moveSound = new Audio("sounds/move.mp3"); // optional

let highScore = localStorage.getItem("highScore") || 0;
document.querySelector("#high-score").textContent = `High Score: ${highScore}`;
// Create 400 divs (20x20)
for (let i = 0; i < boardSize * boardSize; i++) {
  const cell = document.createElement("div");
  cell.classList.add("w-[20px]", "h-[20px]", "bg-gray-800");
  board.appendChild(cell);
}

const getIndex = (x, y) => y * boardSize + x;

const draw = () => {
  Array.from(board.children).forEach((cell) => {
    cell.className = "w-[20px] h-[20px] bg-gray-800";
  });

  // Draw food
  const foodIndex = getIndex(food.x, food.y);
  board.children[foodIndex].classList.add("bg-red-500");

  // Draw snake
  snake.forEach((segment) => {
    const snakeIndex = getIndex(segment.x, segment.y);
    board.children[snakeIndex].classList.add("bg-green-500");
  });

  document.querySelector("#score").textContent = `Score: ${score}`;
};

const placefood = () => {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );
  food = newFood;
};

const checkCollision = (head) => {
  return (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  );
};

const update = () => {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.querySelector(
        "#high-score"
      ).textContent = `High Score: ${highScore}`;
    }
    eatSound.play();
    placefood();
  } else {
    snake.pop();
  }

  if (checkCollision(head)) {
    gameOverSound.play();
    gameOverModal.classList.remove("hidden");

    clearInterval(gameInterval);
    return;
  }

  draw();
};

const startGame = () => {
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  direction = { x: 0, y: 0 };
  score = 0;

  clearInterval(gameInterval);
  gameInterval = setInterval(update, 150);
  draw();
};

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 1) break;
      direction = { x: 0, y: -1 };
      moveSound.play();
      break;
    case "ArrowDown":
      if (direction.y === -1) break;
      direction = { x: 0, y: 1 };
      moveSound.play();
      break;
    case "ArrowLeft":
      if (direction.x === 1) break;
      direction = { x: -1, y: 0 };
      moveSound.play();
      break;
    case "ArrowRight":
      if (direction.x === -1) break;
      direction = { x: 1, y: 0 };
      moveSound.play();
      break;
  }
});
resetBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && gameOverModal.classList.contains("flex")) {
    location.reload();
  }
});

// Start the game initially
startGame();
