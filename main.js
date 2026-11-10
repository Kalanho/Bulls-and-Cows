import { generateSecret } from "./core/generateSecret.js";
import { createState, addAttempt } from "./core/state.js";
import { renderSettings } from "./ui/renderSettings.js";
import { renderGame } from "./ui/renderGame.js";
import { addRecord } from "./ui/renderRecords.js";
const app = document.getElementById("app");
if (!app)
    throw new Error("App container not found");
let currentState = null;
let startTime = 0;
let timerInterval;
const renderHeader = () => {
    const header = document.createElement("header");
    header.className = "header";
    const h1 = document.createElement("h1");
    h1.textContent = "Раскрой секретный код.";
    const p = document.createElement("p");
    p.className = "subtitle";
    p.textContent = "Уникальные цифры. Точные подсказки. Сколько попыток понадобится тебе?";
    header.append(h1, p);
    return header;
};
const updateTimer = () => {
    if (!currentState || currentState.finishedAt)
        return;
    const timerEl = document.querySelector(".stats-row span:last-child");
    if (timerEl) {
        const elapsed = Math.floor((Date.now() - startTime) / 100) / 10;
        timerEl.textContent = `Время: ${elapsed.toFixed(1)}с`;
    }
};
const startGame = (settings) => {
    const secret = generateSecret(settings.length, settings.base);
    currentState = createState(secret, settings.length, settings.base);
    startTime = Date.now();
    if (timerInterval)
        clearInterval(timerInterval);
    timerInterval = window.setInterval(updateTimer, 100);
    drawGameScreen();
};
const handleGuess = (guess) => {
    if (!currentState)
        return;
    const errorEl = document.getElementById("error-msg");
    if (errorEl)
        errorEl.textContent = "";
    currentState = addAttempt(currentState, guess);
    if (currentState.finishedAt) {
        clearInterval(timerInterval);
        const timeInSeconds = (currentState.finishedAt - startTime) / 1000;
        addRecord({
            attempts: currentState.history.length,
            time: Math.round(timeInSeconds * 10) / 10,
            length: currentState.length,
            base: currentState.base,
            date: new Date().toISOString(),
        });
    }
    drawGameScreen();
};
const drawSettingsScreen = () => {
    if (timerInterval)
        clearInterval(timerInterval);
    app.innerHTML = "";
    app.append(renderHeader());
    renderSettings(app, startGame);
};
const drawGameScreen = () => {
    if (!currentState)
        return;
    app.innerHTML = "";
    app.append(renderHeader());
    renderGame(app, currentState, handleGuess, drawSettingsScreen);
    const timerEl = document.querySelector(".stats-row span:last-child");
    if (timerEl && currentState.startedAt) {
        const elapsed = (Date.now() - currentState.startedAt) / 1000;
        timerEl.textContent = `Время: ${elapsed.toFixed(1)}с`;
    }
};
drawSettingsScreen();
