const containerEl = document.getElementById("container");

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
const row3keys = ["Z", "X", "C", "V", "B", "N", "M"];

const possibleWords = 
["blind", "sheet", "crush", "relax", "drain", "label", "expel", "thump",
"dream", "guard", "flood", "adult", "sight", "alarm", "force", "wound",
"brave", "cable", "panic", "study", "faith","equal", "grade", "award", 
"cheer", "pause", "legal", "plate", "bully", "voice", "drive", "title"];

function selectKey()
{
    keyWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    keyWord = keyWord.toUpperCase();
    console.log(keyWord);
}

function createGrid(row, col) 
{
  const gridContainer = document.getElementById("grid-container");

    for (let i = 0; i < row; i++) 
    {
        for (let j = 0; j < col; j++) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.setAttribute("id", "" + i + j)
            gridContainer.appendChild(box);
        }
    }

    containerEl.appendChild(gridContainer);
}

function createGuessBar() 
{
    const guessContainer = document.createElement("div");
    guessContainer.classList.add("guess-bar");

    const guessInput = document.createElement("input");
    guessInput.setAttribute("id", "input");
    guessInput.setAttribute("type", "text");
    guessInput.setAttribute("placeholder", "Enter a word");
    guessInput.setAttribute("maxlength", "5");
    guessInput.setAttribute("onkeydown", "return /[a-zA-Z]/i.test(event.key)");
    guessInput.style.textTransform = "uppercase";

    const guessButton = document.createElement("button");
    guessButton.addEventListener("click", function(){
        if(guessInput.value.length != 5)
        {
            alert("Please enter a 5-letter word");
        }else{
            tryGuess(guessInput.value)
        }
    });
    guessButton.textContent = "Guess";

    guessContainer.append(guessInput, guessButton);
    containerEl.append(guessContainer);
}

function createKeyboard() 
{
    const keyboardContainer = document.createElement("div");
    keyboardContainer.classList.add("keyboard");
  
    const row1 = document.createElement("div");
    const row2 = document.createElement("div");
    const row3 = document.createElement("div");

    row1.classList.add("row-one");
    for (let i = 0; i < 10; i++) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.setAttribute("id", "" + row1keys[i])
        key.textContent = row1keys[i];
        row1.appendChild(key);
    }

    row2.classList.add("row-two");
    for (let i = 0; i < 9; i++) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.setAttribute("id", "" + row2keys[i])
        key.textContent = row2keys[i];
        row2.appendChild(key);
    }
  
    row3.classList.add("row-three");
    for (let i = 0; i < 7; i++) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.setAttribute("id", row3keys[i]);
        key.textContent = row3keys[i];
        row3.appendChild(key);
    }

    keyboardContainer.append(row1);
    keyboardContainer.append(row2);
    keyboardContainer.append(row3);
    containerEl.append(keyboardContainer);
}

function tryGuess(input) 
{
    input = input.toUpperCase();
    let boxToUpdate;
    for(let i = 0; i < 5; i++)
    {
        boxToUpdate = document.getElementById("" + currRow + i);
        keyToUpdate = document.getElementById("" + input[i]);

        boxToUpdate.textContent = input[i];
        if(input[i] == keyWord[i])
        {
            boxToUpdate.style.backgroundColor = blueGreen;
            keyToUpdate.style.backgroundColor = blueGreen;
        }else if(keyWord.includes(input[i]))
        {
            if(keyToUpdate.style.backgroundColor != blueGreen)
            {
                boxToUpdate.style.backgroundColor = yellow;
                keyToUpdate.style.backgroundColor = yellow;
            }
        }else
        {
            boxToUpdate.style.backgroundColor = gray;
            keyToUpdate.style.backgroundColor = gray;
        }
    }

    

    currRow++;

    if(currRow > 5)
    {
        gameOver = true;
    }
    if(input == keyWord)
    {
        gameWon = true;
    }

    checkWinLoss();
}

function checkWinLoss() 
{
    if(gameWon == true)
    {
        setTimeout(
            function() { 
                if(confirm("You won! Would you like to play again?"))
                {
                    resetGame();
                }
        }, 500)
    }else if(gameOver == true)
    {
        setTimeout(
            function() { 
                if(confirm("The game is over. Would you like to try again?"))
                {
                    resetGame();
                }
        }, 500)
    }
}

function resetGame()
{
    currRow = 0;
    currCol = 0;
    selectKey();
    gameOver = false;
    gameWon = false;
    let boxToUpdate;
    for (let i = 0; i < 6; i++) 
    {
        for (let j = 0; j < 5; j++) {
            boxToUpdate = document.getElementById("" + i + j);
            boxToUpdate.style.backgroundColor = boxDefClr;
            boxToUpdate.textContent = "";
        }
    }

    for (let i = 0; i < 10; i++) {
        keyToUpdate = document.getElementById(row1keys[i]);
        keyToUpdate.style.backgroundColor = boxDefClr
    }

    for (let i = 0; i < 9; i++) {
        keyToUpdate = document.getElementById(row2keys[i]);
        keyToUpdate.style.backgroundColor = boxDefClr
    }

    for (let i = 0; i < 7; i++) {
        keyToUpdate = document.getElementById(row3keys[i]);
        keyToUpdate.style.backgroundColor = boxDefClr
    }

    let inputText = document.getElementById("input");
    inputText.textContent = "aaa";
}

selectKey();
createGrid(6, 5);
createGuessBar();
createKeyboard();