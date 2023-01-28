let element = document.querySelector("body");
let isOver = false;

element.addEventListener("dragover", function (event) {
  event.preventDefault();
  if (!isOver) {
    element.classList.add("dragOver");
    isOver = true;
  }
});

element.addEventListener("dragleave", function (event) {
  event.preventDefault();
  if (isOver) {
    element.classList.remove("dragOver");
    isOver = false;
  }
});
