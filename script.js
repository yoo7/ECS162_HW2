"use strict";

function setup() {
    let mainNav = document.getElementsByTagName("h1")[0];
    mainNav.addEventListener("click", goToMain);

    let navConnections = document.getElementById("navConnections");
    navConnections.addEventListener("click", displayGame);
}

function getGameElem(navElem) {
    // "navConnections" -> "Connections"
    let gameID = navElem.id.slice(3);

    // "Connections" -> "connections"
    gameID = String.fromCharCode(gameID[0].charCodeAt(0) - 'A'.charCodeAt(0) + 'a'.charCodeAt(0)) + gameID.substring(1);

    return document.getElementById(gameID);
}