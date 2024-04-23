function deactivateDeselect() {
    deselectBtn.removeEventListener('click', deselectAll);
    deselectBtn.classList.add('unavailable');
}

function deactivateSubmit() {
    submitBtn.removeEventListener('click', checkAnswer);
    submitBtn.classList.add('unavailable');
}

function getNumSelected() {
    return document.getElementsByClassName("selected").length;
}

function toggleSelection(event) {
    // The word has already been selected, so unselect it
    if (event.currentTarget.classList.contains('selected')) {
        event.currentTarget.classList.remove('selected');

        if (getNumSelected() == 0) {
            deactivateDeselect();
        }
    } else {
        if (getNumSelected() == 4) {
            return;
        }

        // Word was not already selected, so select it
        event.currentTarget.classList.add('selected');

        // TODO repeated code...maybe condense later
        deselectBtn.addEventListener('click', deselectAll);
        deselectBtn.classList.remove('unavailable');

        if (getNumSelected() == 4) {
            submitBtn.addEventListener('click', checkAnswer);
            submitBtn.classList.remove('unavailable');
            return;
        }
    }

    deactivateSubmit();
}

const puzzle0 = {
                    "easy": ["MOSHI", new Set(["easy1", "easy2", "easy3", "easy4"])],
                    "normal": ["MOSHI!!!", new Set(["normal1", "normal2", "normal3", "normal4"])],
                    "hard": ["JESUS", new Set(["hard1", "hard2", "hard3", "hard4"])],
                    "adv": ["DESU", new Set(["adv1", "adv2", "adv3", "adv4"])]
                };

const puzzles = [puzzle0];

// TODO update with the actual words
const easy = puzzles[0]["easy"][1];
const normal = puzzles[0]["normal"][1];
const hard = puzzles[0]["hard"][1];
const adv = puzzles[0]["adv"][1];

const categories = {"easy": [easy, false], 
                    "normal": [normal, false],
                    "hard": [hard, false], 
                    "adv": [adv, false],
                    };

const text = document.getElementsByClassName("word");

let numCategoriesDone = 0;

initWords();

let shuffleBtn = document.getElementById("shuffle");
let deselectBtn = document.getElementById("deselect");
let submitBtn = document.getElementById("submit");

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

    // TODO const copies = [new Set(easy), new Set(normal), new Set(hard), new Set(adv)];
    let count = 0;

    // While there are still unfinished categories
    while (count < 4 - numCategoriesDone) {
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
    deselectAll();
}

function initWords() {
    const unusedWords = shuffleUnused();

    for (let i = 0, j = numCategoriesDone * 4; i < unusedWords.length; i++, j++) {
        text[j].textContent = unusedWords[i];  // Overwrite the default text for the word
        text[j].addEventListener('click', toggleSelection);
    }
}

function deselectAll() {
    const selected = document.getElementsByClassName("selected");

    while (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
}

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

function displayMsg(str) {
    let msg = document.getElementById("msg");

    msg.textContent = str;
    msg.animate(fadeInAndOut,
                {
                    easing: "ease-in-out",
                    duration: 2500,
                });
}


function swapWords(cat) {
    const selected = document.getElementsByClassName("selected");

    const destArr = [];

    let temp = document.getElementsByClassName("word");


    // Swap the selected words with the words in the first unfinished row
    for (let i = 0; i < selected.length; i++) {
        const offset = numCategoriesDone * 4;

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

        // Update the DOM (swap the content)
        [target.textContent, dest.textContent] = [dest.textContent, target.textContent];

        // Update text array (swap the content)
        [text[targetIndex - offset].textContent, text[destIndex - offset].textContent] = [target.textContent, dest.textContent];

        target.animate(fadeIn, wordCatOptions);
        dest.animate(fadeIn, wordCatOptions);
    }

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

    // TODO change to currPuzzle or whatever
    let catText = puzzles[0][cat][0] + "\r\n";

    for (const word of puzzles[0][cat][1]) {
        catText += word;
    }

    block.textContent = catText;
    
    block.style.visibility = "none";
    block.animate(fadeIn, wordCatOptions);
}

function cleanup() {
    shuffleBtn.removeEventListener('click', () => {initWords(); deselectAll();});
    shuffleBtn.classList.add("unavailable");
    // Disabling the other buttons and deselecting everything is implicitly done when revealAnswers calls swapWords
}


function revealAnswers() {
    // Clear whatever words are already selected by the user
    deselectAll();

    let numSelected = 0;

    for (let cat in categories) {
        // Reveal answers for the categories in order of increasing difficulty
        if (categories[cat][1]) {
            continue;
        }

        // Search for the words in this category
        let words = document.getElementsByClassName("word");

        for (const word of words) {
            // If the current word is in the category
            if (categories[cat][0].has(word.textContent)) {
                word.classList.add("selected");
                numSelected++;
            }

            // Stop early, found the four words we needed
            if (numSelected == 4) {
                break;
            }
        }

        // Reveal this category
        swapWords(cat);
        categories[cat][1] = true;
        numCategoriesDone++;
        numSelected = 0;  // Reset
    }
}

let numTriesRemaining = 4;
const guesses = [];

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

        if (numWordsMatched == 4) {
            return true;
        }
    }

    return false;
}

function catContainsWord(cat, word) {
    return categories[cat][0].has(word);
}

function countWordsPerCat(selected) {
    const wordCount = {};

    for (let i = 0; i < selected.length; i++) {
        for (const cat of Object.keys(categories)) {
            if (catContainsWord(cat, selected[i].textContent)) {
                if (!(cat in Object.keys(wordCount))) {
                    wordCount[cat] = 0;
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

function checkAnswer() {
    const selected = document.getElementsByClassName("selected");
    
    const guess = initGuess(selected);

    if (isDupGuess(guess)) {
        displayMsg("Already guessed that!");
        return;
    }

    const wordCount = countWordsPerCat(selected);

    // TODO can make this a function
    // Guess is wrong
    const keys = Object.keys(wordCount);

    if (keys.length != 1) {
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

    // TODO can make this a function
    const cat = keys[0];
    displayMsg("Nice!");
    categories[cat][1] = true;
    
    swapWords(cat);

    numCategoriesDone++;

    if (numCategoriesDone == 4) {
        displayMsg("Congratulations!");
        cleanup();
    }
}

// TODO: Another function we can add is allowing user to restart the same puzzle or try a diff puzzle (tho might get unlikely and get the same one?)

shuffleBtn.addEventListener('click', shuffle);
deselectBtn.classList.add('unavailable');
submitBtn.classList.add('unavailable');