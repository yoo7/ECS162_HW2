let mainNav = document.getElementsByTagName("h1")[0];
let navConnections = document.getElementById("navConnections");
let onMainPage = true;

mainNav.addEventListener("click", goToMain);
navConnections.addEventListener("click", displayGame);

function goToMain() {
    console.log("going to main page...");

    if (onMainPage) {
        // Nothing to do
        return;
    }

    hideCurrPage();
    onMainPage = true;
    document.getElementById("mainPage").classList.remove("hiddenPage");
}

function getGameElem(navElem) {
    // "navConnections" -> "Connections"
    let gameID = navElem.id.slice(3);

    // "Connections" -> "connections"
    gameID = String.fromCharCode(gameID[0].charCodeAt(0) - 'A'.charCodeAt(0) + 'a'.charCodeAt(0)) + gameID.substring(1);

    console.log("gameID is " + gameID);

    return document.getElementById(gameID);
}

function hideCurrPage() {
    // We're on the main page
    if (onMainPage) {
        let main = document.getElementById("mainPage");
        main.classList.add("hiddenPage");
        onMainPage = false;
        
        return;
    }

    // Get the currently active game and hide it/make it inactive
    let currNav = document.getElementsByClassName("activeNav")[0];
    currNav.classList.remove("activeNav");

    let currGame = getGameElem(currNav);
    currGame.classList.add("hiddenPage");
}

function displayGame(event) {
    let selectedNav = event.currentTarget;
    console.log("Displaying " + selectedNav.textContent);

    // Not already on the game we want to display,
    // So hide current page
    if (!selectedNav.classList.contains("activeNav")) {
        hideCurrPage();
    }

    console.log("selectedNav.id " + selectedNav.id);

    // Display the selected game
    switch (selectedNav.id) {
        case "navConnections":
            startConnections();
            break;
        default:
            console.log("uh oh");
    }

    // Show the selected game and make it the "active" one
    selectedNav.classList.add("activeNav");

    let selectedGame = getGameElem(selectedNav);
    console.log("hiiii");
    selectedGame.classList.remove("hiddenPage");    
}

