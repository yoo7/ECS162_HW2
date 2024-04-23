const maxSelected = 4;
const maxCategories = 4;
let numCategoriesDone = 0;

const puzzle0 = {
                    "easy": ["K-POP GROUPS", new Set(["SEVENTEEN", "TWICE", "RED VELVET", "BTS"])],
                    "normal": ["SHADES OF RED", new Set(["RUBY", "ROSE", "BLOOD", "STRAWBERRY"])],
                    "hard": ["MAJOR ARCANA", new Set(["EMPRESS", "JUSTICE", "SUN", "MAGICIAN"])],
                    "adv": ["PRINCESS __________", new Set(["PEACH", "BUBBLEGUM", "AURORA", "JASMINE"])]
                };

const puzzle1 = {
                    "easy": ["easy", new Set(["easy1", "easy2", "easy3", "easy4"])],
                    "normal": ["normal", new Set(["normal1", "normal2", "normal3", "normal4"])],
                    "hard": ["hard", new Set(["hard1", "hard2", "hard3", "hard4"])],
                    "adv": ["adv", new Set(["adv1", "adv2", "adv3", "adv4"])]
                };

const puzzles = [puzzle0, puzzle1];

const puzzleIdx = getRandomInt(puzzles.length);

const easy = puzzles[puzzleIdx]["easy"][1];
const normal = puzzles[puzzleIdx]["normal"][1];
const hard = puzzles[puzzleIdx]["hard"][1];
const adv = puzzles[puzzleIdx]["adv"][1];

const categories = {"easy": [easy, false], 
                    "normal": [normal, false],
                    "hard": [hard, false], 
                    "adv": [adv, false],
                    };

const text = document.getElementsByClassName("word");

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
const guesses = [];

let shuffleBtn = document.getElementById("shuffle");
let deselectBtn = document.getElementById("deselect");
let submitBtn = document.getElementById("submit");

// TODO: Another function we can add is allowing user to restart the same puzzle or try a diff puzzle (tho might get unlikely and get the same one?)
shuffleBtn.addEventListener('click', shuffle);
deselectBtn.classList.add('unavailable');
submitBtn.classList.add('unavailable');

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

function deactivateSubmit() {
    submitBtn.removeEventListener('click', checkAnswer);
    submitBtn.classList.add('unavailable');
}

function getNumSelected() {
    return document.getElementsByClassName("selected").length;
}

function toggleSelection(event) {
    if (event.currentTarget.classList.contains('category')) {
        return;
    }

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
    deselectAll();
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
    
    revealCategory(cat);

    numCategoriesDone++;

    if (numCategoriesDone == maxCategories) {
        displayMsg("Congratulations!");
        cleanup();
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

    // Actually set up category
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

function initWords() {
    const unusedWords = shuffleUnused();

    for (let i = 0, j = numCategoriesDone * maxSelected; i < unusedWords.length; i++, j++) {
        text[j].textContent = unusedWords[i];  // Overwrite the default text for the word
        text[j].addEventListener('click', toggleSelection);
    }
}

initWords();