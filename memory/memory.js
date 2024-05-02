"use strict";

document.addEventListener("DOMContentLoaded", ()=>{
    const FADE_OUT = [{opacity: 1}, {opacity: 0.7, offset: 0.3}, {opacity: 0, offset: 1},];
    const OPTIONS = {
                        easing: "ease-in-out",
                        duration: 600,
                        delay: 0,
                        endDelay: 0,
                        fill: "forwards",
                    };
    const FADE_IN_OUT = [{opacity: 0}, {opacity: 1, offset: 0.05}, {opacity: 1, offset: 0.9}, {opacity: 0, offset: 1}];
    let chosenCards = [];
    let chosenCardsID = [];
    let wonCards = [];
    let numMistakes = 0;

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

    cards.sort(()=>0.5 - Math.random());

    const grid = document.querySelector(".grid");
    const result = document.querySelector("#result");

    function create_board() {
        for (let i = 0; i < cards.length; i++) {
            const card = document.createElement("img");
            card.setAttribute("src", "assets/tiles/blank.png");
            card.setAttribute("data-id", i);
            card.addEventListener("click", flipcard);
            grid.appendChild(card);
        }
    }

    function check_for_match() {
        let allCards = document.querySelectorAll("img");
        const card1 = chosenCardsID[0];
        const card2 = chosenCardsID[1];

        if (cards[card1].name === cards[card2].name) {
            displayMsg("That\'s a match!");
            
            // Fade out the two cards
            allCards[card1].animate(FADE_OUT, OPTIONS);
            allCards[card2].animate(FADE_OUT, OPTIONS);
            wonCards.push(chosenCards);
        } else {  // Set them back to blank because they don't match
            // If the current score is positive, then increment the number of mistakes (no negative scores)
            if (parseInt(result.textContent) > 0) {
                numMistakes++;
            }
            allCards[card1].setAttribute("src", "assets/tiles/blank.png");
            allCards[card2].setAttribute("src", "assets/tiles/blank.png");
        }

        chosenCards = [];
        chosenCardsID = [];
        result.textContent = wonCards.length - numMistakes;

        if (wonCards.length === cards.length / 2) {
            displayMsg("Congraulations!");
        }
    }

    function flipcard() {
        let cardID = this.getAttribute("data-id");

        // Can't select the same title twice
        if (!chosenCardsID.includes(cardID)) {
            chosenCards.push(cards[cardID].name);
            chosenCardsID.push(cardID);

            this.setAttribute("src", cards[cardID].image);

            if (chosenCards.length === 2) {
                setTimeout(check_for_match, 600);
            }
        } else {
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