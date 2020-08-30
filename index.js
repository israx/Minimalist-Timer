import {
  playHandler,
  pauseHandler,
  stopHandler,
} from "./components/handlers.js";
import { Start } from "./components/uti.js";

const timeOnScreen = document.querySelector(".time");
const defaulTime = document.querySelectorAll("[data-time]");
const input = document.querySelector('[type="number"]');
const comeBackTime = document.querySelector(".come-back");
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const stop = document.querySelector(".stop");

//Event Listeners

defaulTime.forEach((defTime) =>
  defTime.addEventListener("click", function () {
    const minutesDataset = parseInt(this.dataset.time);
    Start(minutesDataset);
  })
);

play.addEventListener("click", playHandler);
pause.addEventListener("click", pauseHandler);
stop.addEventListener("click", stopHandler);

export { timeOnScreen, comeBackTime, input };
