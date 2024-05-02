"use strict";

const containerEl = document.getElementById("container");
const bodyListener = document.querySelector("body");

const FADE_IN_OUT = [{opacity: 0}, {opacity: 1, offset: 0.05}, {opacity: 1, offset: 0.9}, {opacity: 0, offset: 1}];

let guessString = "";

let gameOver = false;
let gameWon = false;
let keyWord = "";
let currRow = 0;
let currCol = 0;
let boxDefClr = "#f5f5dc";

const blueGreen = "#85E0E4";
const yellow = "#FFDE59";
const gray = "#abb2b3";

const row1keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const row2keys = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const row3keys = ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Delete"];

const possibleWords = 
["blind", "sheet", "crush", "relax", "drain", "label", "expel", "thump",
"dream", "guard", "flood", "adult", "sight", "alarm", "force", "wound",
"brave", "cable", "panic", "study", "faith","equal", "grade", "award", 
"cheer", "pause", "legal", "plate", "bully", "voice", "drive", "title"];

bodyListener.addEventListener("keydown", function(event) {
    let boxToUpdate = document.getElementById("" + currRow + currCol);
    if(event.key === "Backspace")
    {
        if(currCol !== 0)
        {
            boxToUpdate = document.getElementById("" + currRow + (currCol-1));
            boxToUpdate.textContent = "";
            currCol--;
        } 
    }else if(event.key === "Enter" && currCol === 5)
    {
        for(let i = 0; i < 5; i++)
        {
            boxToUpdate = document.getElementById("" + currRow + i);
            guessString = guessString + boxToUpdate.textContent;
        }
        console.log(guessString)
        tryGuess(guessString);
        guessString = "";
        currCol = 0;
    }else if(event.code === `Key${event.key.toUpperCase()}`)
    {
        if(currCol < 5)
        {
            boxToUpdate.textContent = event.key.toUpperCase();
            currCol++;
        }
    }
})

function selectKey() {
    keyWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    keyWord = keyWord.toUpperCase();
}

function createGrid(row, col) {
    const gridContainer = document.getElementById("grid-container");

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

function createKeyboard() {
    const keyboardContainer = document.createElement("div");
    keyboardContainer.classList.add("keyboard");
  
    const row1 = document.createElement("div");
    const row2 = document.createElement("div");
    const row3 = document.createElement("div");

    row1.classList.add("row-one");

    for (let i = 0; i < 10; i++) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = row1keys[i];
        key.setAttribute("id", "" + key.textContent + "Key");
        key.addEventListener("click", function(event){
            let boxToUpdate = document.getElementById("" + currRow + currCol);
            if(currCol < 5)
                {
                    boxToUpdate.textContent = this.textContent.toUpperCase();
                    currCol++;
                }
        });
        row1.appendChild(key);
    }

    row2.classList.add("row-two");

    for (let i = 0; i < 9; i++) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = row2keys[i];
        key.setAttribute("id", "" + key.textContent + "Key");
        key.addEventListener("click", function(event){
            let boxToUpdate = document.getElementById("" + currRow + currCol);
            if(currCol < 5)
                {
                    boxToUpdate.textContent = this.textContent.toUpperCase();
                    currCol++;
                }
        });
        row2.appendChild(key);
    }
  
    row3.classList.add("row-three");

    for (let i = 0; i < 9; i++) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = row3keys[i];
        key.setAttribute("id", "" + key.textContent + "Key");
        key.addEventListener("click", function(event){
            let boxToUpdate = document.getElementById("" + currRow + currCol);
            if(this.textContent === "Delete")
            {
                if(currCol !== 0)
                {
                    boxToUpdate = document.getElementById("" + currRow + (currCol-1));
                    boxToUpdate.textContent = "";
                    currCol--;
                } 
            }else if(this.textContent === "Enter" && currCol === 5)
            {
                for(let i = 0; i < 5; i++)
                {
                    boxToUpdate = document.getElementById("" + currRow + i);
                    guessString = guessString + boxToUpdate.textContent;
                }
                console.log(guessString)
                tryGuess(guessString);
                guessString = "";
                currCol = 0;
            }else if(this.textContent !== "Enter")
            {
                if(currCol < 5)
                {
                    boxToUpdate.textContent = this.textContent.toUpperCase();
                    currCol++;
                }
            }
        });
        row3.appendChild(key);
    }

    keyboardContainer.append(row1);
    keyboardContainer.append(row2);
    keyboardContainer.append(row3);
    containerEl.append(keyboardContainer);
}

function tryGuess(input) {
    input = input.toUpperCase();

    for(let i = 0; i < 5; i++) {
        let boxToUpdate = document.getElementById("" + currRow + i);
        let keyToUpdate = document.getElementById("" + input[i] + "Key");

        boxToUpdate.textContent = input[i];
        if (input[i] == keyWord[i]) {
            boxToUpdate.style.backgroundColor = blueGreen;
            keyToUpdate.style.backgroundColor = blueGreen;
        } else if (keyWord.includes(input[i])) {
            if(keyToUpdate.style.backgroundColor != blueGreen)
            {
                boxToUpdate.style.backgroundColor = yellow;
                keyToUpdate.style.backgroundColor = yellow;
            }
        } else {
            boxToUpdate.style.backgroundColor = gray;
            keyToUpdate.style.backgroundColor = gray;
        }
    }

    currRow++;

    if (currRow > 5) {
        gameOver = true;
    }
    
    if (input == keyWord) {
        gameWon = true;
    }

    checkWinLoss();
}

function checkWinLoss() 
{
    if(gameWon == true)
    {
        displayMsg("You won! Would you like to play again?");
    }else if(gameOver == true)
    {
        displayMsg("Game Over. Press \"play again\" to retry.");
    }
    if(gameWon || gameOver)
    {
        let retryButton = document.getElementById("retry-button");
        retryButton.textContent = "Play again!"
        retryButton.style.opacity = 1;
    }
}

function displayMsg(str) {
    let msg = document.getElementById("msg");

    msg.textContent = str;
    msg.animate(FADE_IN_OUT,
                {
                    easing: "ease-in-out",
                    duration: 2500,
                });
}

function resetGame() {
    currRow = 0;
    currCol = 0;
    selectKey();
    gameOver = false;
    gameWon = false;
    let boxToUpdate;
    let keyToUpdate;
    let retryButton = document.getElementById("retry-button");

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            boxToUpdate = document.getElementById("" + i + j);
            boxToUpdate.style.backgroundColor = boxDefClr;
            boxToUpdate.textContent = "";
        }
    }

    for (let i = 0; i < 10; i++) {
        keyToUpdate = document.getElementById("" + row1keys[i] + "Key");
        keyToUpdate.style.backgroundColor = boxDefClr
    }

    for (let i = 0; i < 9; i++) {
        keyToUpdate = document.getElementById("" + row2keys[i] + "Key");
        keyToUpdate.style.backgroundColor = boxDefClr
    }

    for (let i = 0; i < 9; i++) {
        keyToUpdate = document.getElementById("" + row3keys[i] + "Key");
        keyToUpdate.style.backgroundColor = boxDefClr
    }

    retryButton.style.opacity = 0;
}

selectKey();
createGrid(6, 5);
createKeyboard();