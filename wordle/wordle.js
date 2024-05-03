"use strict";

const FADE_IN_OUT = [{opacity: 0}, {opacity: 1, offset: 0.05}, {opacity: 1, offset: 0.9}, {opacity: 0, offset: 1}];

const ROW_1_KEYS = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ROW_2_KEYS = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3_KEYS = ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Del"];

const BLUEGREEN = "#85E0E4";
const YELLOW = "#FFDE59";
const GRAY = "#abb2b3";
const BOX_DEFAULT_COLOR = "#f5f5dc";

const POSSIBLE_WORDS = 
["blind", "sheet", "crush", "relax", "drain", "label", "expel", "thump",
"dream", "guard", "flood", "adult", "sight", "alarm", "force", "wound",
"brave", "cable", "panic", "study", "faith","equal", "grade", "award", 
"cheer", "pause", "legal", "plate", "bully", "voice", "drive", "title"];

/** This will be used to store the player's guess. */
let guessString = "";

/** These will determine the state of the game. */
let gameOver = false;
let gameWon = false;
let keyWord = "";
let currRow = 0;
let currCol = 0;

/** Adds an event listener for typing on the body of the page. */
function addTypingListener() {
    const bodyListener = document.querySelector("body");
    bodyListener.addEventListener("keydown", function(event) {
        let boxToUpdate = document.getElementById("" + currRow + currCol);
        
        // Pressing backspace deletes the most recently typed letter
        if (event.key === "Backspace") {
            if (currCol !== 0)
            {
                boxToUpdate = document.getElementById("" + currRow + (currCol-1));
                boxToUpdate.textContent = "";
                currCol--;
            } 
        // Pressing enter will only check the guess when the word is 5 letters long.
        } else if (event.key === "Enter" && currCol === 5) {
            for (let i = 0; i < 5; i++) {
                boxToUpdate = document.getElementById("" + currRow + i);
                guessString = guessString + boxToUpdate.textContent;
            }
            tryGuess(guessString);
            guessString = "";
            currCol = 0;
        // Otherwise, only alphabetic keys will be added to the guess string.
        } else if (event.code === `Key${event.key.toUpperCase()}`) {
            if (currCol < 5) {
                boxToUpdate.textContent = event.key.toUpperCase();
                currCol++;
            }
        }
    })
}

/** Randomly selects a word from the bank to be the answer. */
function selectKey() {
    keyWord = POSSIBLE_WORDS[Math.floor(Math.random() * POSSIBLE_WORDS.length)];
    keyWord = keyWord.toUpperCase();
}

/** Creates the grid of boxes to hold letters from player guesses. 
 * @param {int} row - Number of rows in the wordle grid.
 * @param {int} col - Number of columns in the wordle grid.
*/
function createGrid(row, col) {
    const containerEl = document.getElementById("container");
    const gridContainer = document.getElementById("grid-container");

    // Creates a box with an appropriate id to the grid representing the rows of guesses.
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.setAttribute("id", "" + i + j);
            gridContainer.appendChild(box);
        }
    }

    containerEl.appendChild(gridContainer);
}

/** Creates the virtual keyboard. */
function createKeyboard() {
    const containerEl = document.getElementById("container");
    const keyboardContainer = document.createElement("div");
    keyboardContainer.setAttribute("id", "keyboard");

    // Calls helper functions to create each row of letters.
    createRowOne(keyboardContainer);
    createRowTwo(keyboardContainer);
    createRowThree(keyboardContainer);

    containerEl.append(keyboardContainer);
}

/** Creates the first row of the keyboard
 * @param {HTMLDivElement} keyboard - The keyboard element to add the row to.
 */
function createRowOne(keyboard){
    const row1 = document.createElement("div");
    row1.classList.add("row-one");

    // Sets key elements to appropriate letters and added event listeners for clicking replicate key presses.
    for (let i = 0; i < 10; i++) {
        const key = document.createElement("button");
        key.classList.add("key");
        key.classList.add("button");
        key.type = "button";
        key.tabIndex = 0;
        key.textContent = ROW_1_KEYS[i];
        key.setAttribute("id", "" + key.textContent + "Key");
        key.addEventListener("click", function(event) {
            let boxToUpdate = document.getElementById("" + currRow + currCol);

            if (currCol < 5) {
                boxToUpdate.textContent = this.textContent.toUpperCase();
                currCol++;
            }
        });

        row1.appendChild(key);
    }
    keyboard.append(row1);
}

/** Creates the second row of the keyboard
 * @param {HTMLDivElement} keyboard - The keyboard element to add the row to.
 */
function createRowTwo(keyboard){
    const row2 = document.createElement("div");
    row2.classList.add("row-two");

    // Sets key elements to appropriate letters and added event listeners for clicking replicate key presses.
    for (let i = 0; i < 9; i++) {
        const key = document.createElement("button");
        key.classList.add("key");
        key.type = "button";
        key.tabIndex = 0;
        key.textContent = ROW_2_KEYS[i];
        key.setAttribute("id", "" + key.textContent + "Key");
        key.addEventListener("click", function(event) {
            let boxToUpdate = document.getElementById("" + currRow + currCol);

            if (currCol < 5)
                {
                    boxToUpdate.textContent = this.textContent.toUpperCase();
                    currCol++;
                }
        });

        row2.appendChild(key);
    }
    keyboard.append(row2);
}

/** Creates the third row of the keyboard
 * @param {HTMLDivElement} keyboard - The keyboard element to add the row to.
 */
function createRowThree(keyboard){
    const row3 = document.createElement("div");
    row3.classList.add("row-three");
    
    // Sets key elements to appropriate letters and added event listeners for clicking replicate key presses.
    for (let i = 0; i < 9; i++) {
        const key = document.createElement("button");
        key.classList.add("key");
        key.classList.add("button");
        key.type = "button";
        key.tabIndex = 0;
        key.textContent = ROW_3_KEYS[i];
        key.setAttribute("id", "" + key.textContent + "Key");
        // Additional functionality for Enter and Delete buttons to replicate "Enter" and "Backspace".
        key.addEventListener("click", function(event){
            let boxToUpdate = document.getElementById("" + currRow + currCol);
            if (this.textContent === "Del") {
                if (currCol !== 0) {
                    boxToUpdate = document.getElementById("" + currRow + (currCol-1));
                    boxToUpdate.textContent = "";
                    currCol--;
                } 
            } else if (this.textContent === "Enter" && currCol === 5) {
                for (let i = 0; i < 5; i++) {
                    boxToUpdate = document.getElementById("" + currRow + i);
                    guessString = guessString + boxToUpdate.textContent;
                }
                tryGuess(guessString);
                guessString = "";
                currCol = 0;
            } else if (this.textContent !== "Enter") {
                if (currCol < 5) {
                    boxToUpdate.textContent = this.textContent.toUpperCase();
                    currCol++;
                }
            }
        });
        row3.appendChild(key);
    }
    keyboard.append(row3);
}

/** Checks the 5-letter string against the randomly chosen answer 
 * and updates grid boxes and virtual keys according to correctness
 * @param {string} input - The guess string to check against the answer.
 */
function tryGuess(input) {
    let boxToUpdate;
    let keyToUpdate;
    input = input.toUpperCase();


    // Checks each letter to see if they are included in the answer string and if the are in the correct position.
    for(let i = 0; i < 5; i++) {
        boxToUpdate = document.getElementById("" + currRow + i);
        keyToUpdate = document.getElementById("" + input[i] + "Key");

        boxToUpdate.textContent = input[i];
        if (input[i] === keyWord[i]) {
            boxToUpdate.style.backgroundColor = BLUEGREEN;
            keyToUpdate.style.backgroundColor = BLUEGREEN;
        } else if (keyWord.includes(input[i])) {
            if(keyToUpdate.style.backgroundColor != BLUEGREEN)
            {
                boxToUpdate.style.backgroundColor = YELLOW;
                keyToUpdate.style.backgroundColor = YELLOW;
            }
        } else {
            boxToUpdate.style.backgroundColor = GRAY;
            keyToUpdate.style.backgroundColor = GRAY;
        }
    }

    // Move onto the next row each time a guess is attempted.
    currRow++;

    // Checks whether the max number of guesses was made.
    if (currRow > 5) {
        gameOver = true;
    }
    // Checks whether the correct word was guessed.
    if (input === keyWord) {
        gameWon = true;
    }
    checkWinLoss();
}

/** Checks whether the game is over and whether the user won or lost */
function checkWinLoss() 
{
    if(gameWon)
    {
        displayMsg("You won! Would you like to play again?");
    }else if(gameOver)
    {
        displayMsg("Game Over. Press \"play again\" to retry.");
    }
    // A retry button will appear when the game is over.
    if(gameWon || gameOver)
    {
        let retryButton = document.getElementById("retry-button");
        retryButton.textContent = "Play again!"
        retryButton.style.opacity = 1;
        retryButton.disabled = false;
    }
}

/**
 * Print a message to the user above the grid
 * @param {string} str - the string to display
 */
function displayMsg(str) {
    let msg = document.getElementById("msg");

    msg.textContent = str;
    msg.animate(FADE_IN_OUT,
                {
                    easing: "ease-in-out",
                    duration: 2500,
                });
}

/** Starts the game over by emptying box texts and reseting color to default */
function resetGame() {
    // Setting all game-state variables to new game values.
    currRow = 0;
    currCol = 0;
    selectKey();
    gameOver = false;
    gameWon = false;
    let boxToUpdate;
    let keyToUpdate;
    let retryButton = document.getElementById("retry-button");

    // Empties all textContent values and sets all colors back to default.
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            boxToUpdate = document.getElementById("" + i + j);
            boxToUpdate.style.backgroundColor = BOX_DEFAULT_COLOR;
            boxToUpdate.textContent = "";
        }
    }
    for (let i = 0; i < 10; i++) {
        keyToUpdate = document.getElementById("" + ROW_1_KEYS[i] + "Key");
        keyToUpdate.style.backgroundColor = BOX_DEFAULT_COLOR
    }
    for (let i = 0; i < 9; i++) {
        keyToUpdate = document.getElementById("" + ROW_2_KEYS[i] + "Key");
        keyToUpdate.style.backgroundColor = BOX_DEFAULT_COLOR
    }
    for (let i = 0; i < 9; i++) {
        keyToUpdate = document.getElementById("" + ROW_3_KEYS[i] + "Key");
        keyToUpdate.style.backgroundColor = BOX_DEFAULT_COLOR
    }

    // Button disappears onces pressed.
    retryButton.style.opacity = 0;
    retryButton.disabled = true;
}

selectKey();
createGrid(6, 5);
createKeyboard();
addTypingListener();