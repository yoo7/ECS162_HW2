"use strict";

function setup() {
    const connections = document.getElementById("connections");
    const wordle = document.getElementById("wordle");

    connections.addEventListener("click", () => document.location.href = "./connections.html");
    wordle.addEventListener("click", () => document.location.href = "./wordle.html");
}

setup();