const area = document.querySelector(".send");
const body = document.querySelector("body");
const buttonSend = document.querySelector(".send input");
const down = document.querySelector("#donw_file");

area.addEventListener("dragover", (e) => {
  e.preventDefault();
  body.classList.add("dragover");
});

area.addEventListener("drop", (e) => {
  e.preventDefault();
  body.classList.remove("dragover");
});

buttonSend.addEventListener("change", () => {
  let file = buttonSend.files[0];

  if (file) {
    down.removeAttribute("disabled");
    down.classList.add("habilitado");
  }
});
