"use strict";

const MAX_SELECTED = 4;
const MAX_CATEGORIES = 4;

const PUZZLES = [
                {   // Puzzle 0
                    "easy": ["K-POP GROUPS", new Set(["SEVENTEEN", "TWICE", "RED VELVET", "BTS"])],
                    "normal": ["SHADES OF RED", new Set(["RUBY", "ROSE", "BLOOD", "STRAWBERRY"])],
                    "hard": ["MAJOR ARCANA", new Set(["EMPRESS", "JUSTICE", "SUN", "MAGICIAN"])],
                    "adv": ["PRINCESS __________", new Set(["PEACH", "BUBBLEGUM", "POPPY", "JASMINE"])]
                },

                {   // Puzzle 1
                    "easy": ["SLANG", new Set(["DISS", "SLAY", "CAP", "DRIP"])],
                    "normal": ["CAMPING TRIP", new Set(["HIKE", "BONFIRE", "FLASHLIGHT", "ROAST"])],
                    "hard": ["STAR __________", new Set(["STRUCK", "TREK", "DUST", "CROSSED"])],
                    "adv": ["COMPUTER PROGRAM TERMS", new Set(["RUN", "COMMENT", "INTERRUPT", "TEST"])]
                },

                {   // Puzzle 2
                    "easy": ["DRIVING GEARS", new Set(["PARK", "REVERSE", "DRIVE", "NEUTRAL"])],
                    "normal": ["GONE WRONG", new Set(["SOUTH", "ASTRAY", "UGLY", "AWRY"])],
                    "hard": ["NOT STANDING OUT", new Set(["PASSIVE", "SAFE", "COMMON", "EVEN"])],
                    "adv": ["WILD __________", new Set(["WEST", "FLOWER", "FIRE", "CARD"])]
                },

                {   // Puzzle 3
                    "easy": ["AFFECTIONATE NICKNAMES", new Set(["BUTTERCUP", "PUMPKIN", "HONEY BUN", "MUFFIN"])],
                    "normal": ["GROW", new Set(["EXPAND", "SNOWBALL", "BLOSSOM", "BALLOON"])],
                    "hard": ["THINGS IN A SPA", new Set(["CUCUMBER", "STEAM", "MUD", "BUBBLES"])],
                    "adv": ["FOOD PUNS", new Set(["ORANGE", "LETTUCE", "JAM", "LATTE"])]
                },

                {   // Puzzle 4
                    "easy": ["CASH CROPS", new Set(["RUBBER", "COTTON", "TEA", "CACAO"])],
                    "normal": ["DATE IDEAS", new Set(["SUNSET", "BEACH", "DINNER", "MOVIE"])],
                    "hard": ["HISTORICAL ARTIFACTS", new Set(["VASE", "WEAPON", "DOCUMENT", "TABLET"])],
                    "adv": ["RHYMING WITH BIBLICAL NAMES", new Set(["MAUL", "FABLE", "CANE", "FAIRY"])]
                },
            ];

// These will get initialized in pickPuzzle()
let puzzleIdx = 0;

let easy = null;
let normal = null;
let hard = null;
let adv = null;

let categories = null;

// These get modified throughout the program
let guesses = [];  // Filled in as user makes incorrect guesses
let numCategoriesDone = 0;
let numTriesRemaining = 4;

// Animations
const FADE_IN = [{opacity: 0}, {opacity: 1, offset: 0.7}, {opacity: 1, offset: 1}];
const FADE_OUT = [{opacity: 1}, {opacity: 0.7, offset: 0.3}, {opacity: 0, offset: 1},]; 
const FADE_IN_OUT = [{opacity: 0}, {opacity: 1, offset: 0.05}, {opacity: 1, offset: 0.9}, {opacity: 0, offset: 1}];

const OPTIONS = {
    easing: "ease-in-out",
    duration: 1000,
    delay: 0,
    endDelay: 300,
    fill: "forwards",  // Animation should apply the final property values after it ends
};

// Options specifically for the words/categories
const WORD_CAT_OPTIONS = {
    easing: "ease-in-out",
    duration: 2000,
    delay: 0,
    endDelay: 0,
    fill: "forwards",
}

/** Deselect all words that are currently selected */
function deselectAll() {
    const selected = document.getElementsByClassName("selected");

    while (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
}

/** Disable the button */
function deactivateBtn(btn, func) {
    btn.removeEventListener("click", func);
    btn.classList.add("unavailable");
}

/** (Re)activate the button */
function activateBtn(btn, func) {
    btn.addEventListener("click", func);
    btn.classList.remove("unavailable");
}

/** Toggle the selection status of the word that was selected */
function toggleSelection(event) {
    // Only allow selection if it's a word (and not a category)
    if (!event.currentTarget.classList.contains("category")) {
        const selected = document.getElementsByClassName("selected");

        // The word is already selected, so unselect it
        if (event.currentTarget.classList.contains("selected")) {
            event.currentTarget.classList.remove("selected");

            // If nothing is selected, then don't allow user to interact with deselect button
            if (selected.length === 0) {
                deactivateBtn(document.getElementById("deselect"), deselectAll);
            }
        } else {
            // It's an unselected word and we haven't already selected MAX_SELECTED words (can select more)
            if (selected.length !== MAX_SELECTED) {
                 // Word was not already selected, so select it
                event.currentTarget.classList.add("selected");

                activateBtn(document.getElementById("deselect"), deselectAll);

                // Selected the correct amount to be able to submit the guess, so activate submit button
                if (selected.length === MAX_SELECTED) {
                    activateBtn(document.getElementById("submit"), checkAnswer);
                    return;
                }
            } 
        }

        // Haven't reached 4 selected words yet, so make sure the user can't interact with submit button
        deactivateBtn(document.getElementById("submit"), checkAnswer);
    }
}

/** Check if the given category contains the given word */
function catContainsWord(cat, word) {
    return categories[cat][0].has(word);
}

/** Count how many words from each category the user has selected */
function countWordsPerCat(selected) {
    const wordCount = {};
    let catKeys = Object.keys(categories);

    for (let i = 0; i < selected.length; i++) {
        // No break statements allowed, so we use a boolean
        let foundCat = false;

        for (const cat of catKeys) {
            // If the category contains the word, increment the associated count
            if (!foundCat && catContainsWord(cat, selected[i].textContent)) {
                if (!(cat in wordCount)) {
                    wordCount[cat] = 0;  // Initialize to 0
                }

                wordCount[cat]++;

                // Figured out which category this word belongs to, so move on to the next word
                foundCat = true;
            }
        }
    }

    return wordCount;
}

/** 
 * Get the user's current guess in text-form
 * @param {HTMLCollection} selected - all the DOM elements with the "selected" property
 * @return {set} guess - the user's guess
 */
function initGuess(selected) {
    let guess = new Set();

    for (let i = 0; i < selected.length; i++) {
        guess.add(selected[i].textContent);
    }

    return guess;
}

/** 
 * User guessed incorrectly, so display the correct function, 
 * modify numTriesRemaining, and end the game if needed 
 * @param {set} guess - contains the strings corresponding to the words the user guessed
 * @param {map} wordCount - map where keys are the categories the selected words are from, 
 *                          and values are the number of words in those categories
 * @param {array} keys - wordCount's keys
 */
function wrongGuess(guess, wordCount, keys) {
    guesses.push(guess);  // Add this new guess to the history

    // Got 3 words in one category and 1 word in a different category
    if (keys.length === 2 && wordCount[keys[0]] !== 2) {
        displayMsg("One away...");
    } else {
        displayMsg("Incorrect");
    }
   
    // Remove one of the circles to represent the user made a mistake
    document.getElementById("circle-" + numTriesRemaining).animate(FADE_OUT, OPTIONS);
    numTriesRemaining--;
    
    if (numTriesRemaining === 0) {
        displayMsg("No more tries...");
        revealAnswers();
        cleanup();
    }
}

/** 
 * User guessed correctly, so mark that category as complete, display message, 
 * reveal the category on the screen, and modify numCategoriesDone. Clean up if game is finished
 * @param {string} cat - the category that the user guessed correctly
 */
function correctGuess(cat) {
    categories[cat][1] = true;
    
    displayMsg("Nice!");
    revealCategory(cat);

    numCategoriesDone++;

    if (numCategoriesDone === MAX_CATEGORIES) {
        displayMsg("Congratulations!");
        cleanup();
    }
}

/** Check if the user's current guess is correct or not, performing the appropriate actions */
function checkAnswer() {
    const selected = document.getElementsByClassName("selected");
    const guess = initGuess(selected);

    if (!isDupGuess(guess)) {
        const wordCount = countWordsPerCat(selected);
        const keys = Object.keys(wordCount);

        if (keys.length > 1) {
            wrongGuess(guess, wordCount, keys);
        } else {
            correctGuess(keys[0]);
        }
    } else {
        displayMsg("Already guessed!");
    } 
}

/** 
 * Update the DOM when swapping the words in preparation for revealing the categories 
 * @param {HTMLElement} target - the selected word that is in the correctly guessed category 
 * @param {HTMLElement} dest - the word to swap the target word with
 * @param {number} targetIndex - Target's element ID
 * @param {number} destIndex - Destination's element ID
 */
function updateDOM(target, dest, targetIndex, destIndex) {
    const offset = numCategoriesDone * MAX_SELECTED;
    const text = document.getElementsByClassName("word");

    // Update the DOM (swap the content)
    [target.textContent, dest.textContent] = [dest.textContent, target.textContent];

    // Update text array (swap the content)
    [text[targetIndex - offset].textContent, text[destIndex - offset].textContent] = [target.textContent, dest.textContent];
}

/** 
 * Swap the words in preparation for revealing the categories 
 * @param {HTMLElement} target - the selected word that is in the correctly guessed category 
 * @param {HTMLElement} dest - the word to swap the target word with
 * @param {number} targetIndex - Target's element ID
 * @param {number} destIndex - Destination's element ID
 */
function swapWords(target, dest, targetIndex, destIndex) {
    // Make the involved words swap places
    target.animate(FADE_OUT, WORD_CAT_OPTIONS);
    dest.animate(FADE_OUT, WORD_CAT_OPTIONS);

    updateDOM(target, dest, targetIndex, destIndex);

    target.animate(FADE_IN, WORD_CAT_OPTIONS);
    dest.animate(FADE_IN, WORD_CAT_OPTIONS);
}

/**
 * Swap the words in the category to the first unused row in the grid to reveal the category
 * @param {string} cat - the name of the category to reveal
 */
function revealCategory(cat) {
    const selected = document.getElementsByClassName("selected");
    const destArr = [];

    // Swap the selected words with the words in the first unfinished row
    for (let i = 0; i < selected.length; i++) {
        // Selected word"s ID, something like "word-05"
        const targetID = selected[i].id;

        // Index in text array -- if "word-05", then index is 5
        const targetIndex = parseInt(targetID.slice(-2));  

        // Index in text array for dest word
        const destIndex = numCategoriesDone * 4 + i;  
        const destID = "word-" + ((destIndex < 10) ? "0" + destIndex : destIndex);

        let target = document.getElementById(targetID);
        let dest = document.getElementById(destID);

        destArr.push(dest);

        // Only swap words if the target is actually different from the destination
        if (targetID !== destID) {
            swapWords(target, dest, targetIndex, destIndex);
        }
    }

    // Actually set up and display category as a merged rectangle
    setupCategory(destArr, cat);
}

/** 
 * Turn the given words for some category into a string
 * @param {Set} words - contains the words in the category
 * @return {string} catWords - the elements of words in a string, separated by commas
 */
function printWords(words) {
    let count = 0;
    let catWords = "";

    for (const word of words) {
        if (0 < count && count < MAX_SELECTED) {
            catWords += ", ";
        }

        catWords += word;
        count++;
    }

    return catWords;
}

/**
 * Turn the four word elements into a single category element
 * @param {array} destArr - contains the word elements to transform
 * @param {string} cat - the name of the category to set up for
 */
function setupCategory(destArr, cat) {
    deselectAll();
    deactivateBtn(document.getElementById("deselect"), deselectAll);
    deactivateBtn(document.getElementById("submit"), checkAnswer);

    // Remove the other elements in this category from DOM
    for (let i = destArr.length - 1; i > 0; i--) {
        destArr[i].remove();
    }

    // One word left -- expand it out into one wide rectangle to turn it into a category block
    let block = destArr[0];
    block.classList.add("category");
    block.classList.remove("word");
    block.classList.add(cat);  // Show the category color

    let catName = PUZZLES[puzzleIdx][cat][0] + "\n\n";
    const words = PUZZLES[puzzleIdx][cat][1];  // A set

    block.textContent = catName + printWords(words);
    block.classList.add("invisible");
    block.animate(FADE_IN, WORD_CAT_OPTIONS);
}

/**
 * When the user has used all their guesses, find the words belonging to the given category
 * and add the selected property to those word elements
 * @param {Set} words - contains the words in the category
 * @param {string} cat - the name of the category to set up for
 */
function selectCorrectWords(words, cat) {
    let numSelected = 0;
        
    for (const word of words) {
        // Haven't found the four words we need yet and the current word is in the category
        if ((numSelected !== MAX_SELECTED) && (categories[cat][0].has(word.textContent))) {
            word.classList.add("selected");
            numSelected++;
        }   
    }
}

/**
 * Reveal the categories that the user hasn't found yet
 */
function revealAnswers() {
    // Clear whatever words are already selected by the user
    deselectAll();

    for (let cat in categories) {
        // Reveal answers for the categories not found (in order of increasing difficulty)
        if (!categories[cat][1]) {
            // Search for the words in this category
            let words = document.getElementsByClassName("word");

            selectCorrectWords(words, cat);

            // Reveal this category
            revealCategory(cat);
            categories[cat][1] = true;
            numCategoriesDone++;
        }     
    }
}

/**
 * Disable buttons as needed
 */
function cleanup() {
    let shuffleBtn = document.getElementById("shuffle");

    shuffleBtn.removeEventListener("click", initWords);
    shuffleBtn.classList.add("unavailable");
    // Disabling the other buttons and deselecting everything is implicitly done when revealAnswers() calls revealCategory()
}

/**
 * Check whether the guess the user submitted was already made before
 * @param {Set} guess the guess the user submitted
 * @returns {boolean} whether the given guess was a duplicate of a previously made guess or not
 */
function isDupGuess(guess) {
    // There is a previous guess to compare with
    if (guesses.length !== 0) {
        let numWordsMatched = 0;

        for (const prevGuess of guesses) {
            // Compare guess with the previous guess we're currently looking at
            for (const word of prevGuess) {
                if (!guess.has(word)) {
                    numWordsMatched = 0;  // Reset
                } else {
                    numWordsMatched++;
                }  
            }

            // User's guess matched the previous guess
            if (numWordsMatched === MAX_SELECTED) {
                return true;
            }
        }

        return false;
    }

    // No previous guess to compare with, so the given guess is not a duplicate
    return false;
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

/**
 * Pick a random number between 0 and the max number (exclusive)
 * @param {number} max 
 * @returns {number} the random value
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Pick random elements from the set and insert into unusedWords
 * @param {array} unusedWords 
 * @param {Set} set 
 */
function shuffleHelper(unusedWords, set) {
    if (set.size > 0) {
        const i = getRandomInt(set.size);
        const arr = Array.from(set);

        unusedWords.push(arr[i]);

        // Remove 1 item starting at the index (i.e., remove just that elem)
        set.delete(arr[i]);
    }
}

/**
 * Pick a random category and its words
 * @param {array} copies - copies of the categories and the words they include
 * @returns {string} random category
 */
function pickRandCategory(copies) {
    return copies[getRandomInt(copies.length)];
}

/**
 * Collect all the unused words (i.e., not in a completed category yet) in a random order
 * @returns {array} an array of all the unused words
 */
function getUnusedWords() {
    const unusedWords = [];

    // Only insert incomplete sets/categories -- those words are unused and should be shuffled
    for (let cat in categories) {
        // Category hasn"t been completed, so push a copy of the corresponding set
        if (!categories[cat][1]) {
            unusedWords.push(new Set(categories[cat][0]));
        }
    }

    return unusedWords;
}

/**
 * Get a shuffled version of the unused words (i.e., not in a completed category yet)
 * @returns {array} list of the unused words, shuffled
 */
function shuffleUnused() {
    const shuffledWords = [];
    const unusedWords = getUnusedWords();

    let count = 0;

    // While there are still unfinished categories
    while (count < MAX_CATEGORIES - numCategoriesDone) {
        const cat = pickRandCategory(unusedWords);

        if (cat.size > 0) {
            shuffleHelper(shuffledWords, cat);

            // Finished taking words from this unfinished category
            if (cat.size === 0) {
                count++;
            }
        }   
    }

    return shuffledWords;
}

/**
 * Write all the unused words into the grid
 */
function initWords() {
    deselectAll();
    const unusedWords = shuffleUnused();
    const text = document.getElementsByClassName("word");

    for (let i = 0; i < unusedWords.length; i++) {
        // Overwrite the default text for the word
        text[i].textContent = unusedWords[i];
        text[i].addEventListener("click", toggleSelection);
    }
}

/**
 * Restart the connections game, including deleting the HTML elements that were dynamically added
 */
function restartConnections() {
    const stage = document.getElementsByClassName("stage")[0];
    const box = document.getElementsByClassName("box")[0];
    const options = document.getElementsByClassName("options");

    stage.innerHTML = '';
    box.innerHTML = '';
    options[0].innerHTML = '';
    options[1].innerHTML = '';

    // Set all categories as unfinished again
    for (let cat in categories) {
        categories[cat][1] = false;
    }
}

/**
 * Dynamically add a button to the HTML
 * @param {string} id - id of the button to add
 * @param {string} content - text content of the button to add
 * @param {number} index - corresponds to which "options" element
 * @returns {HTMLButtonElement} the button that was added
 */
function addBtn(id, content, index) {
    const options = document.getElementsByClassName("options")[index];

    let btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("button");
    btn.id = id;
    btn.textContent = content;
    btn.tabIndex = 0;
    options.appendChild(btn);

    return btn;
}

/**
 * Dynamically add the button options to the HTML
 */
function setupBtns() {
    addBtn("shuffle", "Shuffle", 0).addEventListener("click", initWords);
    addBtn("deselect", "Deselect All", 0).classList.add("unavailable");
    addBtn("submit", "Submit", 0).classList.add("unavailable");

    addBtn("restart", "Restart", 1).addEventListener("click", () => {restartConnections(); basicSetup();});
    addBtn("newPuzzle", "New Puzzle", 1).addEventListener("click", () => {restartConnections(); startConnections();});
}

/**
 * Dynamically add the words and mistakes to the HTML
 */
function drawStage() {
    const stage = document.getElementsByClassName("stage")[0];
    const numWords = 16;
    const box = document.getElementsByClassName("box")[0];
    
    // Draw the squares for the words
    for (let i = 0; i < numWords; i++) {
        let word = document.createElement("button");
        word.type = "button";
        word.classList.add("word");
        word.id = "word-" + ((i < 10) ? "0" + i : i);
        word.tabIndex = 0;

        stage.appendChild(word);
    }

    // Add the text for number of mistakes remaining
    let numMistakes = document.createElement("div");
    numMistakes.classList.add("numMistakes");
    numMistakes.textContent = "Mistakes remaining:";
    box.appendChild(numMistakes);

    // Draw the circles
    for (let i = 1; i <= numTriesRemaining; i++) {
        let circle = document.createElement("span");
        circle.classList.add("circle");
        circle.id = "circle-" + i;

        box.appendChild(circle);
    }
}

/**
 * Pick which puzzle to play
 */
function pickPuzzle() {
    // Pick a random puzzle
    puzzleIdx = getRandomInt(PUZZLES.length);

    easy = PUZZLES[puzzleIdx]["easy"][1];
    normal = PUZZLES[puzzleIdx]["normal"][1];
    hard = PUZZLES[puzzleIdx]["hard"][1];
    adv = PUZZLES[puzzleIdx]["adv"][1];

    categories = {
                    "easy": [easy, false], 
                    "normal": [normal, false],
                    "hard": [hard, false], 
                    "adv": [adv, false],
                 };
}

/**
 * Do the general set up of the game
 */
function basicSetup() {
    // Add the buttons
    setupBtns();
    
    // Reset user's incorrect guesses
    guesses = [];
    numCategoriesDone = 0;
    numTriesRemaining = 4;
    
    drawStage();
    initWords();
}

/**
 * Call all necessary functions to actually play and set up Connections
 */
function startConnections() {
    pickPuzzle();

    basicSetup();
}

startConnections();