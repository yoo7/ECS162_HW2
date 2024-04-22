function deactivateDeselect() {
    deselect.removeEventListener('click', deselectAll);
    deselect.classList.add('unavailable');
}

function deactivateSubmit() {
    submit.removeEventListener('click', checkAnswer);
    submit.classList.add('unavailable');
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
        deselect.addEventListener('click', deselectAll);
        deselect.classList.remove('unavailable');

        if (getNumSelected() == 4) {
            submit.addEventListener('click', checkAnswer);
            submit.classList.remove('unavailable');
            return;
        }
    }

    deactivateSubmit();
}

// TODO update with the actual words
const easy = new Set(["easy1", "easy2", "easy3", "easy4"]);
const normal = new Set(["normal1", "normal2", "normal3", "normal4"]);
const hard = new Set(["hard1", "hard2", "hard3", "hard4"]);
const adv = new Set(["adv1", "adv2", "adv3", "adv4"]);
const text = document.getElementsByClassName("word");

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
    return copies[getRandomInt(copies.length)];
}

function shuffleUnused() {
    const unusedWords = [];

    const copies = [];

    // Only insert incomplete sets/categories -- those words are unused and should be shuffled
    for (let cat in categories) {
        // Category hasn't been completed, so push a copy of the corresponding set
        if (!categories[cat][1]) {
            copies.push(new Set(categories[cat][0]));
        }
    }

    // TODO const copies = [new Set(easy), new Set(normal), new Set(hard), new Set(adv)];
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
    const selected = document.getElementsByClassName("selected");

    while (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
}

const fadeOut = [{opacity: 1}, {opacity: 0},]; 
    const fadeIn = [{opacity: 0}, {opacity: 1},];
    const options = {   // options 
        easing: "ease-in-out",
        duration: 1000,
        delay: 150,
        fill: "forwards",  // Animation should apply the final property values after it ends
    };

function swapWords(cat) {
    const selected = document.getElementsByClassName("selected");

    const destArr = [];
    
    console.log(numCategoriesDone);
    console.log(cat);

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

        // TODO transition to make each one actually move...
        // const targetRect = target.getBoundingClientRect();
        // const destRect = dest.getBoundingClientRect();

        // target.animate(
        //     [
        //         {  // from
        //             left: targetRect.left + "px",
        //             top: targetRect.top + "px",
        //         },
        //         {  // to
        //             left: destRect.left + "px",
        //             top: destRect.top + "px",
        //         },
        //     ],
        //     options,
        // );

        // dest.animate(
        //     [
        //         {  // from
        //             left: destRect.left + "px",
        //             top: destRect.top + "px",
        //         },
        //         {  // to
        //             left: targetRect.left + "px",
        //             top: targetRect.top + "px",
        //         },
        //     ],
        //     options,
        // );

        target.animate(fadeOut, options);
        dest.animate(fadeOut, options);
        
        const offset = numCategoriesDone * 4;

        // Update the DOM
        [target.textContent, dest.textContent] = [dest.textContent, target.textContent];

        // Update text array
        [text[targetIndex - offset].textContent, text[destIndex - offset].textContent] = [target.textContent, dest.textContent];

        target.animate(fadeIn, options);
        dest.animate(fadeIn, options);
    }

    console.log("selected.length " + selected.length);
    // Deselect everything
    while (selected.length > 0) {
        selected[0].classList.remove("selected");
    }

    deactivateDeselect();
    deactivateSubmit();

    // Remove from DOM
    for (let i = destArr.length - 1; i > 0; i--) {
        destArr[i].remove();
    }

    // One word left -- expand it out
    let block = destArr[0];
    block.classList.add("category");
    block.classList.remove("word");

    block.classList.add(cat);

    // TODO modify the text for block
}


function checkAnswer() {
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

    // TODO, properly show the message
    console.log("correct!")
    categories[cat][1] = true;
    
    swapWords(cat);
    // TODO remove three of the selected
    // TODO grab the remaining one, access its attributes like stretch or whatever
    
    // TODO let stage = document.getElementsByClassName("stage");

    

    

    numCategoriesDone++;

    // TODO call a function to swap the selected items with the first incomplete row
    // then merge (delete all 4 and replace with a new box? css style class) into a big box, then reformat its text?
}

// TODO gray out and deactivate when game is over or won
// TODO display how many tries you have left...also like "one away" (need to adjust check function)
shuffle.addEventListener('click', () => {initWords(); deselectAll();});
deselect.classList.add('unavailable');
submit.classList.add('unavailable');