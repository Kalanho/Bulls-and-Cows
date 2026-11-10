import { countPossibleSecrets } from "../core/countPossibleSecrets.js";

type Settings = { length: number; base: number };

export const renderSettings = (container: HTMLElement, onStart: (settings: Settings) => void) => {
  container.replaceChildren();

  const layout = document.createElement("div");
  layout.className = "layout";

  // ЛЕВАЯ КОЛОНКА
  const leftCol = document.createElement("div");
  leftCol.className = "card";

  const header = document.createElement("div");
  header.className = "card-header";
  header.textContent = "01 / НАСТРОЙКА";

  const title = document.createElement("h2");
  title.textContent = "Выбери свой код";

  const formRow = document.createElement("div");
  formRow.className = "form-row";

  // Селект системы
  const baseGroup = document.createElement("div");
  const baseLabel = document.createElement("label");
  baseLabel.textContent = "Система счисления";
  const baseSelect = document.createElement("select");

  const bases = [
    { value: 2, label: "BIN · основание 2" },
    { value: 8, label: "OCT · основание 8" },
    { value: 10, label: "DEC · основание 10" },
    { value: 16, label: "HEX · основание 16" },
  ];

  bases.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value.toString();
    option.textContent = label;
    baseSelect.appendChild(option);
  });
  baseSelect.value = "10";
  baseGroup.append(baseLabel, baseSelect);

  // Селект длины
  const lengthGroup = document.createElement("div");
  const lengthLabel = document.createElement("label");
  lengthLabel.textContent = "Длина кода";
  const lengthSelect = document.createElement("select");

  for (let len = 2; len <= 6; len++) {
    const option = document.createElement("option");
    option.value = len.toString();
    option.textContent = len.toString();
    lengthSelect.appendChild(option);
  }
  lengthSelect.value = "4";
  lengthGroup.append(lengthLabel, lengthSelect);

  formRow.append(baseGroup, lengthGroup);

  // Инфо-блок
  const infoBox = document.createElement("div");
  infoBox.className = "info-box";

  const updateLengths = () => {
    const base = Number(baseSelect.value);
    Array.from(lengthSelect.options).forEach((option) => {
      option.disabled = Number(option.value) > base;
    });

    if (Number(lengthSelect.value) > base) {
      lengthSelect.value = "2";
    }

    const currentLen = Number(lengthSelect.value);
    const count = countPossibleSecrets(currentLen, base);
    infoBox.textContent = `${count.toLocaleString("ru-RU")} возможных комбинаций`;
  };

  baseSelect.addEventListener("change", updateLengths);
  lengthSelect.addEventListener("change", updateLengths);
  updateLengths();

  const startBtn = document.createElement("button");
  startBtn.textContent = "Начать игру →";
  startBtn.addEventListener("click", () => {
    onStart({
      length: Number(lengthSelect.value),
      base: Number(baseSelect.value),
    });
  });

  leftCol.append(header, title, formRow, infoBox, startBtn);

  // ПРАВАЯ КОЛОНКА (Правила)
  const rightCol = document.createElement("div");
  rightCol.className = "card";

  const rightHeader = document.createElement("div");
  rightHeader.className = "card-header";
  rightHeader.textContent = "КАК ЭТО РАБОТАЕТ";

  const rightTitle = document.createElement("h2");
  rightTitle.textContent = "Две подсказки";

  const rulesList = document.createElement("div");
  rulesList.className = "history-list";

  const ruleBulls = document.createElement("div");
  ruleBulls.className = "history-item";
  ruleBulls.innerHTML =
    "<span class='score-bulls'>B</span> <span>Бык — цифра угадана и стоит на своём месте.</span>";

  const ruleCows = document.createElement("div");
  ruleCows.className = "history-item";
  ruleCows.innerHTML =
    "<span class='score-cows'>C</span> <span>Корова — цифра есть в коде, но стоит в другом месте.</span>";

  rulesList.append(ruleBulls, ruleCows);

  const footerInfo = document.createElement("div");
  footerInfo.className = "info-box";
  footerInfo.textContent = "Цифры не повторяются. Код может начинаться с 0. Попытки не ограничены.";

  rightCol.append(rightHeader, rightTitle, rulesList, footerInfo);
  layout.append(leftCol, rightCol);
  container.appendChild(layout);
};
