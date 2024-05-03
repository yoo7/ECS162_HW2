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
  // Define some variables that the various functions can access
  const startModal = document.querySelector("#start-game-prompt");
  startModal.style.display = "block";

  const startButton = document.querySelector("button#start-game");

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

  window.addEventListener("keypress", (event) => {
    // Ignore keypresses that aren't the Enter button
    if (event.key !== "Enter") {
      return;
    }

    // If the pop-up screen is visible, then pressing Enter will start the game
    if (startModal.style.display === "block") {
      continueGame();
    }
  });

  /*
   * If the user presses the start button (rather than pressing enter -- see window listener),
   * Then start the game. If the user is starting the game for the first time,
   * then change button content to say "Play Again" 
   * (updating in advance to be used when the game is finished) 
   */
  startButton.addEventListener("click", () => {
    continueGame();

    if (startButton.innerText !== "Play Again") {
      startButton.innerText = "Play Again";
    }
  });

  /**
   * To start the game, remove the pop-up screen and start the game
   */
  function continueGame() {
    startModal.style.display = "none";
    startGame();
  }

  // NEW: The following code used to be from the original game.js, but we moved all the js files into one
  /**
   * Select a random number, then index into the array (of words from the same category)
   * to get a random word from that category
   */
  function _getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  /** Update the time based on what current timeSeconds value is */
  function updateTime() {
    timeEl.innerText = timeSeconds;
  }
  
  /** Update the word to type based on what the current wordToGuess is */
  function updateWord() {
    wordEl.innerText = wordToGuess;
  }
  
  /** Display the new difficulty */
  function updateDifficulty() {
    difficultyEl.innerText = "Difficulty: " + difficulty;
  }
  
  /** Update the total # of words successfully typed */
  function updateWordCount() {
    wordCountEl.innerText = "Word count: " + wordCount;
  }
  
  /** Turn off/disable timer */
  function resetInterval() {
    // If timer is valid/enabled
    if (interval) {
      /*
       * Stop the timer (which updated the time every second), and disable it
       * since we'll check the value of interval in other places
       */
      clearInterval(interval);
      interval = null;
    }
  }
  
  function reset() {
    // Setup game state for another round
    wordCount = 0;
    timeSeconds = 11;
    difficulty = "Easy";
    updateWordCount();
  }
  
  function lose() {
    // Turn off/disable timer
    resetInterval();
  
    // Reveal pop-up screen
    modal.style.display = "block";
    modalP.innerText = "Your score is " + wordCount;
  
    // Nothing in the input box (where user types)
    inputEl.value = "";
  
    // If this score isn't in the list yet, then add it
    if (!scores.includes(wordCount)) {
      scores.push(wordCount);
    }
  
    // Set up for next game
    reset();
  
    localStorage.setItem(
      "scores",
      JSON.stringify(scores)
    );
  }
  
  /** Start the timer */
  function startTime() {
    function countdown() {
      // Decrease num seconds by 1 and update on the DOM/screen
      timeSeconds--;
      updateTime();
  
      // Ran out of time
      if (timeSeconds <= 0) {
        lose();
      }
    }
  
    // Call the countdown() function every second and return interval ID unique to this timer
    interval = setInterval(countdown, 1000);
  }
  
  /** Reveal the next word */
  function nextWord() {
    // Update word count
    wordCount++;
    updateWordCount();

    // Disable timer for now
    resetInterval();
  
    // Nothing in user input box
    inputEl.value = "";
  
    // Pick random difficulty and add seconds to <current amount of seconds left>
    difficulty = _getRandomFromArray(difficulties);
  
    timeSeconds =
      difficulty === "Easy"
        ? timeSeconds + 4
        : difficulty === "Moderate"
        ? timeSeconds + 3
        : difficulty === "Hard"
        ? timeSeconds + 2
        : timeSeconds + 1;
  
    // Pick random word from that category to use
    wordToGuess = _getRandomFromArray(words[difficulty]);
  
    // Update DOM/screen and restart the timer
    updateDifficulty();
    updateWord();
    startTime();
    updateTime();
  }
  
  updateTime();
  
  /** Pick word and do general setup */
  function startGame() {
    // Pick a random word from the category that was randomly chosen in the declaration of difficulty
    wordToGuess = _getRandomFromArray(words[difficulty]);
  
    bestScoreEl.innerText = "Best: " + Math.max(...scores);
  
    // User focus is already on the input box
    inputEl.value = "";
    inputEl.focus();
  
    resetInterval();
    updateWord();
    startTime();
    updateDifficulty();
  }
  
  // Check if the user's input matches the word to type
  inputEl.addEventListener("input", (event) => {
    if (event.target.value.toLowerCase().trim() === wordToGuess.toLowerCase()) {
      nextWord()
    }
  });
}
