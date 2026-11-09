// src/main.ts
import { generateSecret } from "./core/generateSecret.js";
import { createState, addAttempt, type GameState } from "./core/state.js";
import { renderSettings } from "./ui/renderSettings.js";
import { renderGame } from "./ui/renderGame.js";
import { renderRecords, addRecord } from "./ui/renderRecords.js";

const appContainer = document.body;
let currentState: GameState | null = null;

// Функция для перерисовки интерфейса на основе текущего стейта
const render = () => {
  appContainer.replaceChildren(); // Очищаем весь body

  if (!currentState) {
    // Экран настроек
    renderSettings(appContainer, (settings) => {
      const secret = generateSecret(settings.length, settings.base);
      currentState = createState(secret, settings.length, settings.base);
      render();
    });

    // Добавляем таблицу рекордов на экран настроек
    renderRecords(appContainer);
  } else {
    // Экран игры
    renderGame(
      appContainer,
      currentState,
      // При новой попытке:
      (guess) => {
        if (!currentState) return;

        const prevHistoryLength = currentState.history.length;
        currentState = addAttempt(currentState, guess);

        // Если игра только что закончилась (добавилась запись и есть время финиша)
        if (currentState.finishedAt !== null && prevHistoryLength !== currentState.history.length) {
          const timeSec = (currentState.finishedAt - currentState.startedAt) / 1000;
          addRecord({
            length: currentState.length,
            base: currentState.base,
            attempts: currentState.history.length,
            timeSec,
          });
        }
        render();
      },
      // При нажатии "Новая игра":
      () => {
        currentState = null;
        render();
      },
    );
  }
};

// Запуск приложения
render();
