"use strict";

const MAX_SELECTED = 4;
const MAX_CATEGORIES = 4;
const guesses = [];  // The contents of guesses will get modified though
let numCategoriesDone = 0;
let numTriesRemaining = 4;

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

// Pick a random puzzle
let puzzleIdx = getRandomInt(PUZZLES.length);

const easy = PUZZLES[puzzleIdx]["easy"][1];
const normal = PUZZLES[puzzleIdx]["normal"][1];
const hard = PUZZLES[puzzleIdx]["hard"][1];
const adv = PUZZLES[puzzleIdx]["adv"][1];

const categories = {"easy": [easy, false], 
                    "normal": [normal, false],
                    "hard": [hard, false], 
                    "adv": [adv, false],
                    };

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

function deselectAll() {
    const selected = document.getElementsByClassName("selected");

    while (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
}

function deactivateDeselect() {
    let deselectBtn = document.getElementById("deselect");

    deselectBtn.removeEventListener("click", deselectAll);
    deselectBtn.classList.add("unavailable");
}

function activateDeselect() {
    let deselectBtn = document.getElementById("deselect");

    deselectBtn.addEventListener("click", deselectAll);
    deselectBtn.classList.remove("unavailable");
}

function deactivateSubmit() {
    let submitBtn = document.getElementById("submit");

    submitBtn.removeEventListener("click", checkAnswer);
    submitBtn.classList.add("unavailable");
}

function activateSubmit() {
    let submitBtn = document.getElementById("submit");

    submitBtn.addEventListener("click", checkAnswer);
    submitBtn.classList.remove("unavailable");
}

function toggleSelection(event) {
    if (event.currentTarget.classList.contains("category")) {
        return;
    }

    const selected = document.getElementsByClassName("selected");

    // The word is already selected, so unselect it
    if (event.currentTarget.classList.contains("selected")) {
        event.currentTarget.classList.remove("selected");

        if (selected.length === 0) {
            deactivateDeselect();
        }
    } else {
        // Some unselected word, but we"ve already selected MAX_SELECTED number of words
        if (selected.length === MAX_SELECTED) {
            // Can"t select more, so immediately return
            return;
        }

        // Word was not already selected, so select it
        event.currentTarget.classList.add("selected");

        activateDeselect();

        // Selected the correct amount to be able to submit the guess, so active the Submit button
        if (selected.length === MAX_SELECTED) {
            activateSubmit();
            return;
        }
    }

    deactivateSubmit();
}

function catContainsWord(cat, word) {
    return categories[cat][0].has(word);
}

function countWordsPerCat(selected) {
    const wordCount = {};
    let catKeys = Object.keys(categories);

    for (let i = 0; i < selected.length; i++) {
        for (const cat of catKeys) {
            if (catContainsWord(cat, selected[i].textContent)) {
                if (!(cat in wordCount)) {
                    wordCount[cat] = 0;  // Initialize to 0
                }

                wordCount[cat]++;

                /* 
                 * Figured out which category this word belongs to
                 * so move on to the next word!
                 */
                break;
            }
        }
    }

    return wordCount;
}

function initGuess(selected) {
    let guess = new Set();

    for (let i = 0; i < selected.length; i++) {
        guess.add(selected[i].textContent);
    }

    return guess;
}

function wrongGuess(guess, wordCount, keys) {
    guesses.push(guess);  // Add this new guess to the history

    if (keys.length == 2 && wordCount[keys[0]] != 2) {
        displayMsg("One away...");
    } else {
        displayMsg("Incorrect");
    }
    
    document.getElementById("circle" + numTriesRemaining).animate(FADE_OUT, OPTIONS);
    numTriesRemaining--;
    
    if (numTriesRemaining == 0) {
        displayMsg("No more tries...");
        revealAnswers();
        cleanup();
    }

    return;
}

function correctGuess(keys) {
    const cat = keys[0];
    categories[cat][1] = true;
    
    displayMsg("Nice!");
    revealCategory(cat);

    numCategoriesDone++;

    if (numCategoriesDone == MAX_CATEGORIES) {
        displayMsg("Congratulations!");
        cleanup();
    }
}

function checkAnswer() {
    const selected = document.getElementsByClassName("selected");
    const guess = initGuess(selected);

    if (isDupGuess(guess)) {
        displayMsg("Already guessed!");
        return;
    }

    const wordCount = countWordsPerCat(selected);
    const keys = Object.keys(wordCount);

    if (keys.length > 1) {
        wrongGuess(guess, wordCount, keys);
    } else {
        correctGuess(keys);
    }
}

function updateDOM(target, dest, targetIndex, destIndex) {
    const offset = numCategoriesDone * MAX_SELECTED;
    const text = document.getElementsByClassName("word");

    // Update the DOM (swap the content)
    [target.textContent, dest.textContent] = [dest.textContent, target.textContent];

    // Update text array (swap the content)
    [text[targetIndex - offset].textContent, text[destIndex - offset].textContent] = [target.textContent, dest.textContent];
}

function revealCategory(cat) {
    const selected = document.getElementsByClassName("selected");
    const destArr = [];

    // Swap the selected words with the words in the first unfinished row
    for (let i = 0; i < selected.length; i++) {
        const targetID = selected[i].id;  // Selected word"s ID, something like "word-05"
        const targetIndex = parseInt(targetID.slice(-2));  // Index in text array -- if "word-05", then index is 5

        const destIndex = numCategoriesDone * 4 + i;  // Index in text array for dest word
        const destID = "word-" + ((destIndex < 10) ? "0" + destIndex : destIndex);  // Dest word"s ID

        let target = document.getElementById(targetID);
        let dest = document.getElementById(destID);

        destArr.push(dest);

        if (targetID == destID) {
            continue;
        }

        target.animate(FADE_OUT, WORD_CAT_OPTIONS);
        dest.animate(FADE_OUT, WORD_CAT_OPTIONS);

        updateDOM(target, dest, targetIndex, destIndex);

        target.animate(FADE_IN, WORD_CAT_OPTIONS);
        dest.animate(FADE_IN, WORD_CAT_OPTIONS);
    }

    // Actually set up and display category
    setupCategory(destArr, cat);
}

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

function setupCategory(destArr, cat) {
    deselectAll();
    deactivateDeselect();
    deactivateSubmit();

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
    block.style.visibility = "none";
    block.animate(FADE_IN, WORD_CAT_OPTIONS);
}

function selectCorrectWords(words, cat) {
    let numSelected = 0;
        
    for (const word of words) {
        // If the current word is in the category
        if (categories[cat][0].has(word.textContent)) {
            word.classList.add("selected");
            numSelected++;
        }

        // Stop early, found the four words we needed
        if (numSelected == MAX_SELECTED) {
            break;
        }
    }
}

function revealAnswers() {
    // Clear whatever words are already selected by the user
    deselectAll();

    for (let cat in categories) {
        // Reveal answers for the categories in order of increasing difficulty
        if (categories[cat][1]) {
            continue;
        }

        // Search for the words in this category
        let words = document.getElementsByClassName("word");

        selectCorrectWords(words, cat);

        // Reveal this category
        revealCategory(cat);
        categories[cat][1] = true;
        numCategoriesDone++;
    }
}

function cleanup() {
    let shuffleBtn = document.getElementById("shuffle");

    shuffleBtn.removeEventListener("click", () => {initWords(); deselectAll();});
    shuffleBtn.classList.add("unavailable");
    // Disabling the other buttons and deselecting everything is implicitly done when revealAnswers() calls revealCategory()
}

function isDupGuess(guess) {
    // Nothing to compare with
    if (guesses.length == 0) {
        return;
    }

    let numWordsMatched = 0;

    for (const prevGuess of guesses) {
        for (const word of prevGuess) {
            if (!guess.has(word)) {
                numWordsMatched = 0;  // Reset
                break;
            }

            numWordsMatched++;
        }

        if (numWordsMatched == MAX_SELECTED) {
            return true;
        }
    }

    return false;
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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function shuffleHelper(unusedWords, set) {
    if (set.size > 0) {
        const i = getRandomInt(set.size);
        const arr = Array.from(set);

        unusedWords.push(arr[i]);

        // Remove 1 item starting at the index (i.e., remove just that elem)
        set.delete(arr[i]);
    }
}

function pickRandCategory(copies) {
    return copies[getRandomInt(copies.length)];
}

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
            if (cat.size == 0) {
                count++;
            }
        }   
    }

    return shuffledWords;
}

function shuffle() {
    initWords();
}

function initWords() {
    deselectAll();
    const unusedWords = shuffleUnused();
    const text = document.getElementsByClassName("word");
    
    for (let i = 0; i < unusedWords.length; i++) {
        text[i].textContent = unusedWords[i];  // Overwrite the default text for the word
        text[i].addEventListener("click", toggleSelection);
    }
}

function setupBtns() {
    const shuffleBtn = document.getElementById("shuffle");
    const deselectBtn = document.getElementById("deselect");
    const submitBtn = document.getElementById("submit");

    shuffleBtn.addEventListener("click", shuffle);
    deselectBtn.classList.add("unavailable");
    submitBtn.classList.add("unavailable");
}

function startConnections() {
    // TODO probably can do the JS looping thing we recently learned to draw the circles and boxes and all that
    setupBtns();
    initWords();
}

startConnections();