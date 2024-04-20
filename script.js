"use strict";

// class Word {
//     constructor() {
//         this.selected = false;  // User selected this word
//         this.done = false;      // Word has been put into a group
//         // TODO tbh might not end up using done?
//     }

//     // TODO could just toggle based on if it elem.classList.contains("selected")...
//     toggleSelection(elem) {
//         console.log("hi")

//         if (this.done) {
//             return;
//         }

//         // The word has already been selected, so unselect it
//         if (this.selected) {
//             elem.classList.remove('selected');
//         } else if (selectedWords.length < 4) {
//             // Word was not already selected, so select it
//             selectedWords.push(this);
//             elem.classList.add('selected');
//         } else {
//             // Already have 4 selected, so can't select this word
//             return;
//         }
        
//         // Update selection state
//         this.selected = !this.selected;   
//     }

//     /**
//      * Make connection between @elem and this Word object
//      * @param {Element} elem - HTML element to be associated with this Word object
//      * @return nothing
//      */
//     attach(elem) {
//         /*
//          * Use anonymous function that takes no arguments and calls toggleSelection() 
//          * on this instance of Word when @elem is clicked on
//          */
//         elem.addEventListener('click', () => this.toggleSelection(elem));
//     }
// }

function getNumSelected() {
    return document.getElementsByClassName("selected").length;
}
function toggleSelection(event) {
    // The word has already been selected, so unselect it
    if (event.currentTarget.classList.contains('selected')) {
        event.currentTarget.classList.remove('selected');

        if (getNumSelected() == 0) {
            deselect.removeEventListener('click', deselectAll);
            deselect.classList.add('unavailable');
        }
    } else {
        if (getNumSelected() == 4) {
            return;
        }

        // Word was not already selected, so select it
        event.currentTarget.classList.add('selected');

        // TODO repeated code...maybe condense later
        deselect.addEventListener('click', deselectAll);
        deselect.classList.remove('unavailable');

        if (getNumSelected() == 4) {
            submit.addEventListener('click', checkAnswer);
            submit.classList.remove('unavailable');
            return;
        }
    }

    submit.removeEventListener('click', checkAnswer);
}

// TODO update with the actual words
const easy = new Set(["easy1", "easy2", "easy3", "easy4"]);
const normal = new Set(["normal1", "normal2", "normal3", "normal4"]);
const hard = new Set(["hard1", "hard2", "hard3", "hard4"]);
const adv = new Set(["advanced1", "advanced2", "advanced3", "advanced4"]);

const words = [];
let text = document.getElementsByClassName("word");

let numCategoriesDone = 0;
const categories = {"easy": [easy, false], 
                        "normal": [normal, false],
                        "hard": [hard, false], 
                        "adv": [adv, false]
                    };

initWords();

let shuffle = document.getElementById("shuffle");
let deselect = document.getElementById("deselect");
let submit = document.getElementById("submit");

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
    return copies[getRandomInt(4)];
}

function shuffleUnused() {
    const unusedWords = [];
    const copies = [new Set(easy), new Set(normal), new Set(hard), new Set(adv)];
    let count = 0;

    // While there are still unfinished categories
    while (count < 4 - numCategoriesDone) {
        const cat = pickRandCategory(copies);

        if (cat.size > 0) {
            shuffleHelper(unusedWords, cat);

            // Finished taking words from this unfinished category
            if (cat.size == 0) {
                count++;
            }
        }   
    }

    return unusedWords;
}


function initWords() {
    const unusedWords = shuffleUnused();

    for (let i = 0, j = numCategoriesDone * 4; i < unusedWords.length; i++, j++) {
        //let word = new Word();
        text[j].textContent = unusedWords[i];  // Overwrite the default text for the word
        text[j].addEventListener('click', toggleSelection);
        //word.attach(text[i]);
        //words.push(word);
     }
}

function deselectAll(event) {
    console.log("deselecting...")
    const selected = document.getElementsByClassName("selected");

    while (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
}

function checkAnswer() {
    console.log("check!")
    // TODO check if this combination has already been tried
    const selected = document.getElementsByClassName("selected");

    let cat = "easy";

    if (categories["normal"][0].has(selected[0].textContent)) {
        cat = "normal";
    } else if (categories["hard"][0].has(selected[0].textContent)) {
        cat = "hard";
    } else if (categories["adv"][0].has(selected[0].textContent)) {
        cat = "adv";
    }

    console.log(cat);

    for (let i = 1; i < selected.length; i++) {
        // TODO write a function to make this if statement clearer
        if (!categories[cat][0].has(selected[i].textContent)) {
            // TODO properly display message on screen that it's wrong, probably animation frame for fade in and out
            console.log("wrong...")
            return;
        }
    }

    console.log("correct!")
    categories[cat][1] = true;
    numCategoriesDone++;

    // TODO call a function to swap the selected items with the first incomplete row
    // then merge (delete all 4 and replace with a new box? css style class) into a big box, then reformat its text?
}

// TODO gray out and deactivate when game is over or won
// TODO display how many tries you have left...also like "one away" (need to adjust check function)
shuffle.addEventListener('click', () => {initWords(); deselectAll();});
deselect.classList.add('unavailable');
submit.classList.add('unavailable');