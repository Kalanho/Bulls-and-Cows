import { GameState } from "../core/state.js";
import { createDigitValidator } from "../core/createDigitValidator.js";

export const renderGame = (
  container: HTMLElement,
  state: GameState,
  onGuess: (guess: string) => void,
  onNewGame: () => void,
) => {
  container.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "layout";

  // --- ЛЕВАЯ ЧАСТЬ (Игра) ---
  const leftCol = document.createElement("div");
  leftCol.className = "card";

  const header = document.createElement("div");
  header.className = "card-header";
  header.textContent = "02 / ТВОЯ ПОПЫТКА";

  const title = document.createElement("h2");
  title.textContent = "Собери подсказки";

  // Статистика (попытки и время)
  const stats = document.createElement("div");
  stats.className = "stats-row";

  const attemptsCount = document.createElement("span");
  attemptsCount.textContent = `Попытки: ${state.history.length}`;

  const timer = document.createElement("span");
  timer.textContent = "Время: 00:00.0";
  // Таймер будет обновляться в main.ts

  stats.append(attemptsCount, timer);

  // Форма ввода
  const form = document.createElement("div");
  form.className = "form-row";

  const inputGroup = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = "Введи свой вариант";

  const input = document.createElement("input");
  input.placeholder = "····";
  input.maxLength = state.length;

  // Валидация ввода в реальном времени
  const isValidChar = createDigitValidator(state.base);
  input.addEventListener("input", () => {
    const chars = [...input.value].filter(isValidChar);
    // Удаляем дубликаты
    const unique = [...new Set(chars)];
    input.value = unique.join("").toLowerCase();
  });

  inputGroup.append(label, input);

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Проверить";
  submitBtn.disabled = true;
  submitBtn.addEventListener("click", () => {
    if (input.value.length === state.length) {
      onGuess(input.value);
      input.value = "";
      submitBtn.disabled = true;
    }
  });

  input.addEventListener("input", () => {
    submitBtn.disabled = input.value.length !== state.length;
  });

  form.append(inputGroup, submitBtn);

  // Подсказка по вводу
  const infoBox = document.createElement("div");
  infoBox.className = "info-box";
  infoBox.textContent = `Длина: ${state.length}. Допустимые символы: ${
    state.base === 16 ? "0-9, A-F" : `0-${state.base - 1}`
  }. Без повторений.`;

  // Ошибка
  const errorMsg = document.createElement("div");
  errorMsg.className = "error-msg";
  errorMsg.id = "error-msg";

  // История попыток
  const historyTitle = document.createElement("h2");
  historyTitle.textContent = "История попыток";
  historyTitle.style.marginTop = "24px";

  const historyList = document.createElement("ul");
  historyList.className = "history-list";
  historyList.id = "history-list";

  // Заполняем историю
  state.history.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "history-item";

    if (entry.bulls === state.length) {
      li.classList.add("won");
    }

    const guessSpan = document.createElement("span");
    guessSpan.className = "attempt-guess";
    guessSpan.textContent = entry.guess;

    const scoreSpan = document.createElement("span");
    scoreSpan.className = "attempt-score";

    const bullsSpan = document.createElement("span");
    bullsSpan.className = "score-bulls";
    bullsSpan.textContent = `B: ${entry.bulls}`;

    const cowsSpan = document.createElement("span");
    cowsSpan.className = "score-cows";
    cowsSpan.textContent = `C: ${entry.cows}`;

    scoreSpan.append(bullsSpan, cowsSpan);
    li.append(guessSpan, scoreSpan);
    historyList.append(li);
  });

  leftCol.append(header, title, stats, form, infoBox, errorMsg, historyTitle, historyList);

  // --- ПРАВАЯ ЧАСТЬ (Рекорды или Завершение) ---
  const rightCol = document.createElement("div");
  rightCol.className = "card";

  const rightHeader = document.createElement("div");
  rightHeader.className = "card-header";
  rightHeader.textContent = state.finishedAt ? "ИГРА ОКОНЧЕНА" : "ЛИЧНЫЙ ТОП-10";

  const rightTitle = document.createElement("h2");
  rightTitle.textContent = state.finishedAt ? "Победа!" : "Лучшие разгадки";

  rightCol.append(rightHeader, rightTitle);

  if (state.finishedAt) {
    const winText = document.createElement("p");
    winText.textContent = "Ты угадал секретный код!";
    winText.style.marginBottom = "20px";

    const newGameBtn = document.createElement("button");
    newGameBtn.textContent = "Новая игра";
    newGameBtn.addEventListener("click", onNewGame);

    rightCol.append(winText, newGameBtn);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "info-box";
    placeholder.textContent = "Здесь будет твой первый рекорд. Разгадай код, чтобы начать список.";
    rightCol.append(placeholder);
  }

  layout.append(leftCol, rightCol);
  container.append(layout);
};
