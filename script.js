"use strict";

function setup() {
    const connections = document.getElementById("connections");
    const wordle = document.getElementById("wordle");
    const eTypeMo = document.getElementById("eTypeMo");

    connections.addEventListener("click", () => document.location.href = "./connections.html");
    wordle.addEventListener("click", () => document.location.href = "./wordle.html");
    eTypeMo.addEventListener("click", () => document.location.href = "./etypemo/etypemo.html");
}

setup();