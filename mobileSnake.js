let arrowUpBtn = document.querySelector("#arrow-up");
let arrowDownBtn = document.querySelector("#arrow-down");
let arrowLeftBtn = document.querySelector("#arrow-left");
let arrowRightBtn = document.querySelector("#arrow-right");
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

document.querySelector("#resetMobileBtn").addEventListener("click", () => {
  location.reload();
});
