let arrowUpBtn = document.querySelector("#arrowUp");
let arrowDownBtn = document.querySelector("#arrowDown");
let arrowLeftBtn = document.querySelector("#arrowLeft");
let arrowRightBtn = document.querySelector("#arrowRight");
const moveUp = () => {
  if (direction.y !== 1) direction = { x: 0, y: -1 };
};
const moveDown = () => {
  if (direction.y !== -1) direction = { x: 0, y: 1 };
};
const moveLeft = () => {
  if (direction.x !== 1) direction = { x: -1, y: 0 };
};
const moveRight = () => {
  if (direction.x !== -1) direction = { x: 1, y: 0 };
};
arrowUpBtn.addEventListener("click", moveUp);
arrowDownBtn.addEventListener("click", moveDown);
arrowLeftBtn.addEventListener("click", moveLeft);
arrowRightBtn.addEventListener("click", moveRight);
