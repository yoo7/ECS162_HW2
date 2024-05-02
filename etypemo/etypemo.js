/*
    MIT License

    Copyright (c) 2024 Yoobin Jin and Sam Xie

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    This project contains MIT licensed code from Memory and eTypeMo. 
    To see the details of the licensing, view the `LICENSE` files in `./memory` and `./etypemo`.

    The code in this file is a modified version from the eTypeMo project.
*/

"use strict";

const words = {
  Easy: [
    "apple",
    "banana",
    "cat",
    "dog",
    "fish",
    "house",
    "tree",
    "water",
    "world",
    "happy",
    "milk",
    "sun",
    "car",
    "bird",
    "color",
    "food",
    "friend",
    "music",  // NEW: Added more easy words
    "nature",
    "science",
    "quaint",
    "greet",
    "book",
    "cook",
    "flower",
    "box",
  ],
  Moderate: [
    "beautiful",
    "comfortable",
    "enormous",
    "fantastic",
    "government",
    "important",
    "intelligent",
    "interesting",
    "language",
    "adventure",
    "celebrate",
    "different",
    "friendship",
    "knowledge",
    "elaborate",  // NEW: Added more moderate words
    "viceroy",
    "president",
    "retelling",
    "jeopardize",
    "metaphor",
    "elephant",
    "professor",
    "voracious",
    "typewriter",
    "incoherent",
  ],
  Hard: [
    "bureaucracy",
    "juxtaposition",
    "labyrinth",
    "meticulous",
    "photosynthesis",
    "archaeology",
    "equilibrium",
    "philosophy",
    "typography",
    "ambiguity",
    "constellation",
    "stewardess",  // NEW Added more hard words
    "acquiesce",
    "pepperoni",
    "ecstatic",
    "hypothesis",
    "satellite",
    "perpendicular",
    "international",
    "terrarium",
    "planetarium",
    "apprehension",
    "territorial",
    "government",
    "phenomenon",
    "pseudonym",
    "radioactive",
  ],
  Insane: [  // NEW Added a difficulty
    "extraterritoriality",
    "conscientious",
    "extracurricular",
    "heterogeneous",
    "infinitesimal",
    "surreptitious",
    "xylophone",
    "trepidation",
    "onomatopoeia",
    "blasphemous",
    "incomprehensible",
    "revolutionary",
    "interdisciplinary",
    "inconsequential",
    "magnanimous",
  ],
}

window.addEventListener("load", init);

function init() {
  const startModal = document.querySelector("#start-game-prompt");
  startModal.style.display = "block";

  const startButton = document.querySelector("button#start-game");

  function continueGame() {
    startModal.style.display = "none";
    startGame();
  }

  startButton.addEventListener("click", () => {
    continueGame();

    if (startButton.innerText !== "Play Again") {
      startButton.innerText = "Play Again";
    }
  });

  window.addEventListener("keypress", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    if (startModal.style.display === "block") {
      continueGame();
    }
  });

  // The following used to be from game.js
  function _getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // get DOM elements
  const wordEl = document.querySelector("#word-guess");
  const inputEl = document.querySelector("#word-input");
  const timeEl = document.querySelector("#time");
  const difficultyEl = document.querySelector("#difficulty");
  const bestScoreEl = document.querySelector("#best-score");
  const wordCountEl = document.querySelector("#word-count");
  const modal = document.querySelector("#start-game-prompt");
  const modalP = document.querySelector("#start-game-prompt p");
  
  const scores = JSON.parse(localStorage.getItem("scores")) || [0];
  const difficulties = ["Easy", "Moderate", "Hard", "Insane"];
  
  let interval = null;
  let timeSeconds = 10;
  let difficulty = _getRandomFromArray(difficulties);
  let wordCount = 0;
  let wordToGuess;
  
  function updateTime() {
    timeEl.innerText = timeSeconds;
  }
  
  function updateWord() {
    wordEl.innerText = wordToGuess;
  }
  
  function updateDifficulty() {
    difficultyEl.innerText = "Difficulty: " + difficulty;
  }
  
  function updateWordCount() {
    wordCountEl.innerText = "Word count: " + wordCount;
  }
  
  function resetInterval() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
  
  function reset() {
    wordCount = 0;
    timeSeconds = 11;
    difficulty = "Easy";
    updateWordCount();
  }
  
  function lose() {
    resetInterval();
  
    modal.style.display = "block";
    modalP.innerText = "Your score is " + wordCount;
  
    inputEl.value = "";
  
    if (!scores.includes(wordCount)) {
      scores.push(wordCount);
    }
  
    reset();
  
    localStorage.setItem(
      "scores",
      JSON.stringify(scores)
    );
  
  }
  
  function startTime() {
    function countdown() {
      timeSeconds--;
      updateTime();
  
      if (timeSeconds <= 0) {
        lose();
      }
    }
  
    interval = setInterval(countdown, 1000);
  }
  
  function nextWord() {
    wordCount++;
    updateWordCount();
    resetInterval();
  
    inputEl.value = "";
  
    difficulty = _getRandomFromArray(difficulties);
  
    timeSeconds =
      difficulty === "Easy"
        ? timeSeconds + 4
        : difficulty === "Moderate"
        ? timeSeconds + 3
        : difficulty === "Hard"
        ? timeSeconds + 2
        : timeSeconds + 1;
  
    wordToGuess = _getRandomFromArray(words[difficulty]);
  
    updateDifficulty();
    updateWord();
    startTime();
    updateTime();
  }
  
  updateTime();
  
  function startGame() {
    wordToGuess = _getRandomFromArray(words[difficulty]);
  
    bestScoreEl.innerText = "Best: " + Math.max(...scores);
  
    inputEl.value = "";
    inputEl.focus();
  
    resetInterval();
    updateWord();
    startTime();
    updateDifficulty();
  }
  
  inputEl.addEventListener("input", (event) => {
    if (event.target.value.toLowerCase().trim() === wordToGuess.toLowerCase()) {
      nextWord()
    }
  });
}
