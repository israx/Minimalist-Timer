import { input, comeBackTime, timeOnScreen } from "../index";
import { stopInterval, Timer } from "./uti";
let timeInPause;

export function timeLeft(time) {
  timeInPause = time;
}
//Handlers

export function playHandler() {
  const timeFromInput = parseInt(input.value) * 60;
  //if timeInPause has already a value on it
  //we can resume the time in pause
  if (timeInPause) {
    Timer(timeInPause - 1);
  }
  //if timeInPause has not a value on it
  //Instead we are gonna take the value from the input
  if (timeFromInput > 0 && !timeInPause) {
    Timer(timeFromInput);
  }
}

export function pauseHandler() {
  clearInterval(stopInterval);
  comeBackTime.textContent = "Thanks";
  comeBackTime.style.opacity = 0;
}

export function stopHandler() {
  clearInterval(stopInterval);
  timeOnScreen.textContent = "00:00";
  comeBackTime.textContent = "Thanks";
  comeBackTime.style.opacity = 0;
  timeInPause = "";
}
