import { generateSecret } from "./core/generateSecret.js";
import { createState, addAttempt, type GameState } from "./core/state.js";
import { renderSettings } from "./ui/renderSettings.js";
import { renderGame } from "./ui/renderGame.js";
import { addRecord } from "./ui/renderRecords.js"; // getRecords убрали

const app = document.getElementById("app");

if (!app) throw new Error("App container not found");

let currentState: GameState | null = null;
let startTime = 0;
let timerInterval: number;

// --- ГЛАВНЫЙ ЭКРАН (Заголовок) ---
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

// --- ФУНКЦИЯ ОБНОВЛЕНИЯ ТАЙМЕРА ---
const updateTimer = () => {
  if (!currentState || currentState.finishedAt) return;
  const timerEl = document.querySelector(".stats-row span:last-child");
  if (timerEl) {
    const elapsed = Math.floor((Date.now() - startTime) / 100) / 10;
    timerEl.textContent = `Время: ${elapsed.toFixed(1)}с`;
  }
};

// --- ФУНКЦИЯ ЗАПУСКА ИГРЫ ---
const startGame = (settings: { length: number; base: number }) => {
  const secret = generateSecret(settings.length, settings.base);
  currentState = createState(secret, settings.length, settings.base);
  startTime = Date.now();

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = window.setInterval(updateTimer, 100);

  drawGameScreen();
};

// --- ФУНКЦИЯ ОБРАБОТКИ ПОПЫТКИ ---
const handleGuess = (guess: string) => {
  if (!currentState) return;

  const errorEl = document.getElementById("error-msg");
  if (errorEl) errorEl.textContent = "";

  // Добавляем попытку
  currentState = addAttempt(currentState, guess);

  // Если игра окончена — сохраняем рекорд
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

// --- ОТРИСОВКА ЭКРАНА НАСТРОЕК ---
const drawSettingsScreen = () => {
  if (timerInterval) clearInterval(timerInterval);
  app.innerHTML = "";
  app.append(renderHeader());
  renderSettings(app, startGame);
};

// --- ОТРИСОВКА ИГРОВОГО ЭКРАНА ---
const drawGameScreen = () => {
  if (!currentState) return;

  app.innerHTML = "";
  app.append(renderHeader());
  renderGame(app, currentState, handleGuess, drawSettingsScreen);

  // Восстанавливаем таймер
  const timerEl = document.querySelector(".stats-row span:last-child");
  if (timerEl && currentState.startedAt) {
    const elapsed = (Date.now() - currentState.startedAt) / 1000;
    timerEl.textContent = `Время: ${elapsed.toFixed(1)}с`;
  }
};

// --- СТАРТ ПРИЛОЖЕНИЯ ---
drawSettingsScreen();
