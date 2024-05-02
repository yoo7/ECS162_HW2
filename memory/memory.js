"use strict";

document.addEventListener("DOMContentLoaded", ()=>{
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
            card.tabIndex = 0;  // Keyboard accessibility
            card.addEventListener("click", flipcard);

            // Button appears as an image (blank tile)
            const img = document.createElement("img");
            img.setAttribute("src", "assets/tiles/blank.png");
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

        // Two cards actually match, so display message, make them disappear, and add to wonCards
        if (cards[card1].name === cards[card2].name) {
            displayMsg("That\'s a match!");
            
            // Fade out the two cards
            allCards[card1].animate(FADE_OUT, OPTIONS);
            allCards[card2].animate(FADE_OUT, OPTIONS);
            wonCards.push(chosenCards);
        } else {  // Set the two cards back to blank because they don't match
            displayMsg("Not a match");

            // If the current score is positive, then increment the number of mistakes (no negative scores)
            if (parseInt(result.textContent) > 0) {
                numMistakes++;
            }

            // Make them blank cards/tiles again
            allCards[card1].children.item(0).setAttribute("src", "assets/tiles/blank.png");
            allCards[card2].children.item(0).setAttribute("src", "assets/tiles/blank.png");
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