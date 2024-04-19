"use strict";

let numSelected = 0;

class Word {
    constructor() {
        this.selected = false;  // User selected this word
        this.done = false;      // Word has been put into a group
    }

    toggleSelection(elem) {
        console.log("hi")

        // The word has already been selected, so unselect it
        if (this.selected) {
            numSelected--;
            elem.classList.remove('selected');
        } else if (numSelected < 4) {
            // Word was not already selected, so select it
            numSelected++;
            elem.classList.add('selected');
        } else {
            // Already have 4 selected, so can't select this word
            return;
        }
        
        // Update selection state
        this.selected = !this.selected;   
    }

    /**
     * Make connection between @elem and this Word object
     * @param {Element} elem - HTML element to be associated with this Word object
     * @return nothing
     */
    attach(elem) {
        /*
         * Use anonymous function that takes no arguments and calls toggleSelection() 
         * on this instance of Word when @elem is clicked on
         */
        elem.addEventListener('click', () => this.toggleSelection(elem));
    }
}


// TODO want to shuffle this, but there's no ready default function?
// TODO update with the actual words
const text = ["easy1", "easy2", "easy3", "easy4",
            "normal1", "normal2", "normal3", "normal4",
            "hard1", "hard2", "hard3", "hard4",
            "advanced1", "advanced2", "advanced3", "advanced4"];


const words = [];
let matches = document.getElementsByClassName("word");

for(let i = 0; i < matches.length; i++) {
   let word = new Word();
   matches[i].textContent = text[i];  // Overwrite the default text for the word
   word.attach(matches[i]);
   words.push(word);
}

// TODO add buttons for deselecting all, possibly shuffling, also submitting
// TODO if correct, swap each element with the correct row (need to keep track, do row calculation)
// Upon correct match, delete the 3 boxes (after moving them), then expand the big box, then reformat its text?
