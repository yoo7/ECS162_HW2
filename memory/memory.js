/*
    MIT License

    Copyright (c) 2024 Yoobin Jin and Sam Xie

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    This project contains MIT licensed code from Memory and eTypeMo. 
    To see the details of the licensing, view the `LICENSE` files in `./memory` and `./etypemo`.

    The code in this file is a modified version from the Memory project.
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // NEW: Aniation constants for convenience
    const FADE_OUT = [{opacity: 1}, {opacity: 0.7, offset: 0.3}, {opacity: 0, offset: 1},];
    const OPTIONS = {
                        easing: "ease-in-out",
                        duration: 600,
                        delay: 0,
                        endDelay: 0,
                        fill: "forwards",
                    };
    const FADE_IN_OUT = [{opacity: 0}, {opacity: 1, offset: 0.05}, {opacity: 1, offset: 0.9}, {opacity: 0, offset: 1}];

    // Keep track of the two cards user selected + IDs of those cards
    let chosenCards = [];
    let chosenCardsID = [];

    // Keep track of cards that were successfully matched
    let wonCards = [];

    // NEW: mechanic to raise the stakes -- try to get the highest score (mistakes will decrease score)
    let numMistakes = 0;

    // Keep track of all the possible cards (2 per type of tile because you match PAIRS of tiles)
    const cards  = [
        {
            name: "card01",
            image: "assets/tiles/001.png"
        },
        {
            name: "card01",
            image: "assets/tiles/001.png"
        },
        {
            name: "card02",
            image: "assets/tiles/002.png"
        },
        {
            name: "card02",
            image: "assets/tiles/002.png"
        },
        {
            name: "card03",
            image: "assets/tiles/003.png"
        },
        {
            name: "card03",
            image: "assets/tiles/003.png"
        },
        {
            name: "card04",
            image: "assets/tiles/004.png"
        },
        {
            name: "card04",
            image: "assets/tiles/004.png"
        },
        {
            name: "card05",
            image: "assets/tiles/005.png"
        },
        {
            name: "card05",
            image: "assets/tiles/005.png"
        },
        {
            name: "card06",
            image: "assets/tiles/006.png"
        },
        {
            name: "card06",
            image: "assets/tiles/006.png"
        }
    ];

    // Randomly place the cards
    cards.sort(()=>0.5 - Math.random());

    const grid = document.querySelector(".grid");
    const result = document.querySelector("#result");

    /**
     * Add the cards/tiles to the DOM
     */
    function create_board() {
        for (let i = 0; i < cards.length; i++) {
            // NEW: Create card as a BUTTON to allow for easy keyboard accessibility
            const card = document.createElement("button");
            card.type = "button";
            card.classList.add("button");
            card.setAttribute("data-id", i);
            card.tabIndex = 0;
            card.addEventListener("click", flipcard);

            // Button appears as an image (blank tile)
            const img = document.createElement("img");
            img.setAttribute("src", "assets/tiles/blank.png");
            img.setAttribute("title", "memory tile");
            img.setAttribute("alt", "unmatched tile");
            card.appendChild(img);
            
            // Actually add the card/tile to the DOM
            grid.appendChild(card);
        }
    }

    /**
     * Check if the two cards the user selected actually match
     */
    function check_for_match() {
        // Get all elements that are buttons
        let allCards = document.querySelectorAll("button");

        const card1 = chosenCardsID[0];
        const card2 = chosenCardsID[1];
        const img1 = allCards[card1].children.item(0);
        const img2 = allCards[card2].children.item(0);

        // Two cards actually match, so display message, make them disappear, and add to wonCards
        if (cards[card1].name === cards[card2].name) {
            displayMsg("That\'s a match!");
            
            // Fade out the two cards
            removeCard(allCards[card1], img1);
            removeCard(allCards[card2], img2);

            wonCards.push(chosenCards);
        } else {  // Set the two cards back to blank because they don't match
            displayMsg("Not a match");

            // If the current score is positive, then increment the number of mistakes (no negative scores)
            if (parseInt(result.textContent) > 0) {
                numMistakes++;
            }

            // Make them blank cards/tiles again
            img1.setAttribute("src", "assets/tiles/blank.png");
            img2.setAttribute("src", "assets/tiles/blank.png");
        }

        // Deselect the cards/tiles chosen
        chosenCards = [];
        chosenCardsID = [];

        // Update score
        result.textContent = wonCards.length - numMistakes;

        // User matched all the cards/tiles
        if (wonCards.length === cards.length / 2) {
            displayMsg("Congraulations!");
        }
    }

    /**
     * NEW added function
     * Make the card/button disappear from the screen
     * @param {HTMLButtonElement} card 
     * @param {HTMLImageElement} img 
     */
    function removeCard(card, img) {
        card.animate(FADE_OUT, OPTIONS);
        img.setAttribute("title", "");
        img.setAttribute("alt", "");
    }

    /**
     * Reveal what type of card the clicked card is
     */
    function flipcard() {
        let cardID = this.getAttribute("data-id");

        // Card selected was not already selected
        if (!chosenCardsID.includes(cardID)) {
            // Add the selected card to chosenCards, and keep track of its ID too
            chosenCards.push(cards[cardID].name);
            chosenCardsID.push(cardID);

            // Change the card's source image to reveal the actual card
            this.children.item(0).setAttribute("src", cards[cardID].image);

            // 2 cards have been picked, so check if they match after a short delay
            if (chosenCards.length === 2) {
                setTimeout(check_for_match, 600);
            }
        } else {  // Can't select the same card twice
            displayMsg("Already selected!");
        }
    }

    /**
     * Print a message to the user above the grid
     * @param {string} str - the string to display
     */
    function displayMsg(str) {
        let msg = document.getElementById("msg");

        msg.textContent = str;
        msg.animate(FADE_IN_OUT, {easing: "ease-in-out", duration: 2500,});
    }

    create_board();
})