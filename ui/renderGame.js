import { createDigitValidator } from "../core/createDigitValidator.js";
import { getRecords } from "./renderRecords.js";
export const renderGame = (container, state, onGuess, onNewGame) => {
    container.replaceChildren();
    const layout = document.createElement("div");
    layout.className = "layout";
    // ЛЕВАЯ КОЛОНКА
    const leftCol = document.createElement("div");
    leftCol.className = "card";
    const header = document.createElement("div");
    header.className = "card-header";
    header.textContent = "02 / ТВОЯ ПОПЫТКА";
    const title = document.createElement("h2");
    title.textContent = "Собери подсказки";
    const stats = document.createElement("div");
    stats.className = "stats-row";
    const attemptsCount = document.createElement("span");
    attemptsCount.textContent = `Попытки: ${state.history.length}`;
    const timer = document.createElement("span");
    timer.textContent = "Время: 00:00.0";
    stats.append(attemptsCount, timer);
    const form = document.createElement("div");
    form.className = "form-row";
    const inputGroup = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = "Введи свой вариант";
    const input = document.createElement("input");
    input.placeholder = "····";
    input.maxLength = state.length;
    const isValidChar = createDigitValidator(state.base);
    input.addEventListener("input", () => {
        const chars = [...input.value].filter(isValidChar);
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
        }
    });
    input.addEventListener("input", () => {
        submitBtn.disabled = input.value.length !== state.length;
    });
    form.append(inputGroup, submitBtn);
    const infoBox = document.createElement("div");
    infoBox.className = "info-box";
    infoBox.textContent = `Длина: ${state.length}. Допустимые символы: ${state.base === 16 ? "0-9, A-F" : `0-${state.base - 1}`}. Без повторений.`;
    const errorMsg = document.createElement("div");
    errorMsg.className = "error-msg";
    errorMsg.id = "error-msg";
    const historyTitle = document.createElement("h2");
    historyTitle.textContent = "История попыток";
    historyTitle.style.marginTop = "24px";
    const historyList = document.createElement("ul");
    historyList.className = "history-list";
    historyList.id = "history-list";
    state.history.forEach((entry) => {
        const li = document.createElement("li");
        li.className = "history-item";
        if (entry.bulls === state.length)
            li.classList.add("won");
        const guessSpan = document.createElement("span");
        guessSpan.className = "attempt-guess";
        guessSpan.textContent = entry.guess;
        const scoreSpan = document.createElement("span");
        scoreSpan.className = "attempt-score";
        scoreSpan.innerHTML = `<span class="score-bulls">B: ${entry.bulls}</span> <span class="score-cows">C: ${entry.cows}</span>`;
        li.append(guessSpan, scoreSpan);
        historyList.append(li);
    });
    leftCol.append(header, title, stats, form, infoBox, errorMsg, historyTitle, historyList);
    // ПРАВАЯ КОЛОНКА
    const rightCol = document.createElement("div");
    rightCol.className = "card";
    const rightHeader = document.createElement("div");
    rightHeader.className = "card-header";
    rightHeader.textContent = state.finishedAt ? "ИГРА ОКОНЧЕНА" : "ЛИЧНЫЙ ТОП-10";
    const rightTitle = document.createElement("h2");
    rightTitle.textContent = state.finishedAt ? "Победа!" : "Лучшие разгадки";
    rightCol.append(rightHeader, rightTitle);
    if (state.finishedAt) {
        // ... (код победы, кнопка "Новая игра") ...
    }
    else {
        // --- ДОБАВЛЯЕМ ОТРИСОВКУ РЕКОРДОВ ЗДЕСЬ ---
        const recordsList = document.createElement("ul");
        recordsList.className = "records-list";
        const records = getRecords();
        if (records.length === 0) {
            const placeholder = document.createElement("div");
            placeholder.className = "info-box";
            placeholder.textContent = "Здесь будет твой первый рекорд. Разгадай код, чтобы начать список.";
            rightCol.append(placeholder);
        }
        else {
            records.forEach((r, i) => {
                const li = document.createElement("li");
                li.className = "record-item";
                const rank = document.createElement("span");
                rank.textContent = `#${i + 1}`;
                const info = document.createElement("span");
                info.textContent = `${r.attempts} попыток · ${r.time}с`;
                li.append(rank, info);
                recordsList.append(li);
            });
            rightCol.append(recordsList);
        }
    }
    layout.append(leftCol, rightCol);
    container.appendChild(layout);
};
