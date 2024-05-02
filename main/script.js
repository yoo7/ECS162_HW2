"use strict";

function setup() {
    const games = ["connections", "wordle", "etypemo", "memory"];

    for (const game of games) {
        setupListener(game);
    }
}

function setupListener(name) {
    const btn = document.getElementById(name);
    btn.addEventListener("click", () => document.location.href = "../" + name + "/" + name + ".html");
}

window.addEventListener("load", setup);