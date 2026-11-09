// src/ui/renderGame.ts
import { createDigitValidator } from "../core/createDigitValidator.js";
import { isValidGuess } from "../core/isValidGuess.js";
import type { GameState } from "../core/state.js";

export const renderGame = (
  container: HTMLElement,
  state: GameState,
  onAttempt: (guess: string) => void,
  onNewGame: () => void,
) => {
  container.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = `Угадайте ${state.length} цифр в ${state.base}-ичной системе`;
  container.appendChild(title);

  // История попыток
  const historyList = document.createElement("ul");
  state.history.forEach((attempt) => {
    const li = document.createElement("li");
    li.textContent = `${attempt.guess} → 🐂 ${attempt.bulls}, 🐄 ${attempt.cows}`;
    historyList.appendChild(li);
  });
  container.appendChild(historyList);

  // Если игра завершена
  if (state.finishedAt !== null) {
    const winMsg = document.createElement("h3");
    winMsg.textContent = "🎉 Вы угадали!";
    winMsg.style.color = "green";
    container.appendChild(winMsg);

    const timeSpent = ((state.finishedAt - state.startedAt) / 1000).toFixed(1);
    const stats = document.createElement("p");
    stats.textContent = `Попыток: ${state.history.length}. Время: ${timeSpent} сек.`;
    container.appendChild(stats);

    const newGameBtn = document.createElement("button");
    newGameBtn.textContent = "Новая игра";
    newGameBtn.addEventListener("click", onNewGame);
    container.appendChild(newGameBtn);

    return; // Не рисуем поле ввода, если игра кончилась
  }

  // Поле ввода
  const isDigit = createDigitValidator(state.base);
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Введите ${state.length} цифр`;
  input.maxLength = state.length;
  input.style.marginRight = "10px";

  // Фильтрация ввода в реальном времени
  input.addEventListener("input", () => {
    const validChars = [...input.value].filter(isDigit).join("");
    if (input.value !== validChars) {
      input.value = validChars;
    }
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Проверить";

  const errorMsg = document.createElement("p");
  errorMsg.style.color = "red";

  const handleSubmit = () => {
    const guess = input.value.toLowerCase();

    // Проверка: полная длина + валидность + нет дублей в истории
    const isDuplicate = state.history.some((a) => a.guess.toLowerCase() === guess);

    if (!isValidGuess(guess, state.length, state.base)) {
      errorMsg.textContent = `Введите корректное число из ${state.length} уникальных цифр!`;
      return;
    }
    if (isDuplicate) {
      errorMsg.textContent = "Вы уже вводили эту попытку!";
      return;
    }

    errorMsg.textContent = ""; // Сброс ошибки
    input.value = ""; // Очистка поля
    onAttempt(guess);
  };

  submitBtn.addEventListener("click", handleSubmit);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSubmit();
  });

  const inputContainer = document.createElement("div");
  inputContainer.appendChild(input);
  inputContainer.appendChild(submitBtn);

  container.appendChild(inputContainer);
  container.appendChild(errorMsg);
};
