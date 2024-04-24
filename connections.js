const maxSelected = 4;
const maxCategories = 4;
let numCategoriesDone = 0;

const puzzles = [
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
                    "easy": ["DATE IDEAS", new Set(["SUNSET", "BEACH", "DINNER", "MOVIE"])],
                    "normal": ["HISTORICAL ARTIFACTS", new Set(["VASE", "WEAPON", "DOCUMENT", "TABLET"])],
                    "hard": ["CASH CROPS", new Set(["RUBBER", "COTTON", "TEA", "CACAO"])],
                    "adv": ["RHYMING WITH BIBLICAL NAMES", new Set(["MAUL", "FABLE", "CANE", "FAIRY"])]
                },
            ];

let puzzleIdx = 0;

let easy = [];
let normal = [];
let hard = [];
let adv = [];

let categories = {};

let text = document.getElementsByClassName("word");

const fadeIn = [{opacity: 0}, {opacity: 1, offset: 0.7}, {opacity: 1, offset: 1}];
const fadeOut = [{opacity: 1}, {opacity: 0.7, offset: 0.3}, {opacity: 0, offset: 1},]; 
const fadeInAndOut = [{opacity: 0}, {opacity: 1, offset: 0.05}, {opacity: 1, offset: 0.9}, {opacity: 0, offset: 1}];

const options = {
    easing: "ease-in-out",
    duration: 1000,
    delay: 0,
    endDelay: 300,
    fill: "forwards",  // Animation should apply the final property values after it ends
};

// Options specifically for the words/categories
const wordCatOptions = {
    easing: "ease-in-out",
    duration: 2000,
    delay: 0,
    endDelay: 0,
    fill: "forwards",
}

let numTriesRemaining = 4;
let guesses = [];

let shuffleBtn = document.getElementById("shuffle");
let deselectBtn = document.getElementById("deselect");
let submitBtn = document.getElementById("submit");

function deselectAll() {
    const selected = document.getElementsByClassName("selected");

    while (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
}

function deactivateDeselect() {
    deselectBtn.removeEventListener('click', deselectAll);
    deselectBtn.classList.add('unavailable');
}

function activateDeselect() {
    deselectBtn.addEventListener('click', deselectAll);
    deselectBtn.classList.remove('unavailable');
}

function deactivateSubmit() {
    submitBtn.removeEventListener('click', checkAnswer);
    submitBtn.classList.add('unavailable');
}

function activateSubmit() {
    submitBtn.addEventListener('click', checkAnswer);
    submitBtn.classList.remove('unavailable');
}

function toggleSelection(event) {
    if (event.currentTarget.classList.contains('category')) {
        return;
    }

    const selected = document.getElementsByClassName("selected");

    // The word is already selected, so unselect it
    if (event.currentTarget.classList.contains('selected')) {
        event.currentTarget.classList.remove('selected');

        if (selected.length === 0) {
            deactivateDeselect();
        }
    } else {
        // Some unselected word, but we've already selected maxSelected number of words
        if (selected.length === maxSelected) {
            // Can't select more, so immediately return
            return;
        }

        // Word was not already selected, so select it
        event.currentTarget.classList.add('selected');

        activateDeselect();

        // Selected the correct amount to be able to submit the guess, so active the Submit button
        if (selected.length === maxSelected) {
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
    
    document.getElementById("circle" + numTriesRemaining).animate(fadeOut, options);
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

    if (numCategoriesDone == maxCategories) {
        displayMsg("Congratulations!");
        cleanup();
    }
}

function checkAnswer() {
    const selected = document.getElementsByClassName("selected");
    
    const guess = initGuess(selected);

    if (isDupGuess(guess)) {
        displayMsg("Already guessed that!");
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
    const offset = numCategoriesDone * maxSelected;

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
        const targetID = selected[i].id;  // Selected word's ID, something like "word-05"
        const targetIndex = parseInt(targetID.slice(-2));  // Index in text array -- if "word-05", then index is 5

        const destIndex = numCategoriesDone * 4 + i;  // Index in text array for dest word
        const destID = "word-" + ((destIndex < 10) ? "0" + destIndex : destIndex);  // Dest word's ID

        let target = document.getElementById(targetID);
        let dest = document.getElementById(destID);

        destArr.push(dest);

        if (targetID == destID) {
            continue;
        }

        target.animate(fadeOut, wordCatOptions);
        dest.animate(fadeOut, wordCatOptions);

        updateDOM(target, dest, targetIndex, destIndex);

        target.animate(fadeIn, wordCatOptions);
        dest.animate(fadeIn, wordCatOptions);
    }

    // Actually set up and display category
    setupCategory(destArr, cat);
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

    let catText = puzzles[puzzleIdx][cat][0] + "\n\n";
    const words = puzzles[puzzleIdx][cat][1];  // A set

    let count = 0;

    for (const word of words) {
        if (0 < count && count < maxSelected) {
            catText += ", ";
        }

        catText += word;
        count++;
    }

    block.textContent = catText;
    block.style.visibility = "none";
    block.animate(fadeIn, wordCatOptions);
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
        if (numSelected == maxSelected) {
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
    shuffleBtn.removeEventListener('click', () => {initWords(); deselectAll();});
    shuffleBtn.classList.add("unavailable");
    // Disabling the other buttons and deselecting everything is implicitly done when revealAnswers() calls revealCategory()
}

function isDupGuess(guess) {
    let numWordsMatched = 0;

    for (prevGuess of guesses) {
        for (const word of prevGuess) {
            if (!guess.has(word)) {
                numWordsMatched = 0;  // Reset
                break;
            }

            numWordsMatched++;
        }

        if (numWordsMatched == maxSelected) {
            return true;
        }
    }

    return false;
}

function displayMsg(str) {
    let msg = document.getElementById("msg");

    msg.textContent = str;
    msg.animate(fadeInAndOut,
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
        // Category hasn't been completed, so push a copy of the corresponding set
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
    while (count < maxCategories - numCategoriesDone) {
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

    for (let i = 0, j = numCategoriesDone * maxSelected; i < unusedWords.length; i++, j++) {
        text[j].textContent = unusedWords[i];  // Overwrite the default text for the word
        text[j].addEventListener('click', toggleSelection);
    }
}

function redrawCircles() {
    const quickAppear = [{opacity: 0}, {opacity: 1, offset: 0.00001}, {opacity: 1, offset: 1}];
    const quickOptions = {duration: 0.01, fill: "forwards"};

    while (numTriesRemaining < 4) {
        document.getElementById("circle" + (numTriesRemaining + 1)).animate(quickAppear, quickOptions);
        numTriesRemaining++;
    }
}

function setup() {
    // Pick a random puzzle
    puzzleIdx = getRandomInt(puzzles.length);

    easy = puzzles[puzzleIdx]["easy"][1];
    normal = puzzles[puzzleIdx]["normal"][1];
    hard = puzzles[puzzleIdx]["hard"][1];
    adv = puzzles[puzzleIdx]["adv"][1];

    categories = {"easy": [easy, false], 
                    "normal": [normal, false],
                    "hard": [hard, false], 
                    "adv": [adv, false],
                };

    text = document.getElementsByClassName("word");

    // Redraw the circles representing the # of tries if needed
    redrawCircles();

    guesses = [];
    numCategoriesDone = 0;

    shuffleBtn = document.getElementById("shuffle");
    deselectBtn = document.getElementById("deselect");
    submitBtn = document.getElementById("submit");

    shuffleBtn.addEventListener('click', shuffle);
    deselectBtn.classList.add('unavailable');
    submitBtn.classList.add('unavailable');
}

function startConnections() {
    setup();
    initWords();
}