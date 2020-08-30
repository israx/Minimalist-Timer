import { timeOnScreen, comeBackTime } from "../index.js";
import { timeLeft } from "./handlers.js";
const audio = document.querySelector("audio");
let stopInterval;

//function that takes seconds

export const Timer = (seconds) => {
  const actualTime = Date.now();
  const then = actualTime + seconds * 1000;

  displayTime(seconds);
  comeBackAt(then);
  //Stop the Interval from running if it already was
  clearInterval(stopInterval);

  stopInterval = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    //stop Interval from running
    if (secondsLeft < 0) {
      clearInterval(stopInterval);
      return;
    }
    //play audio if seconds are less than 4
    if (secondsLeft < 4) {
      audio.play();
    }
    //display time left to the screen
    timeLeft(secondsLeft);
    displayTime(secondsLeft);
    return secondsLeft;
  }, 1000);
};

//function to display time

export const displayTime = (seconds) => {
  const minutesLeft = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  console.log(minutesLeft, secondsLeft);
  timeOnScreen.style.opacity = 1;
  timeOnScreen.textContent = `
    ${minutesLeft} : ${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
};

//function to display when to come back

export const comeBackAt = (time) => {
  const getBack = new Date(time);
  const hours = getBack.getHours();
  const minutes = getBack.getMinutes();
  comeBackTime.style.opacity = 1;
  comeBackTime.textContent = `Please come back at ${hours} : ${
    minutes < 10 ? "0" : ""
  }${minutes}`;
};

//function to start time

export function Start(time) {
  const minutesToSeconds = time * 60;
  Timer(minutesToSeconds);
}

export { stopInterval };
