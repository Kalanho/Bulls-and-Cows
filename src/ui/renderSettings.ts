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

  // --- БЫКИ (без innerHTML) ---
  const ruleBulls = document.createElement("div");
  ruleBulls.className = "history-item";
  ruleBulls.style.display = "flex";
  ruleBulls.style.alignItems = "center";
  ruleBulls.style.gap = "12px";

  const bBadge = document.createElement("span");
  bBadge.className = "score-bulls";
  bBadge.textContent = "B";
  bBadge.style.fontFamily = "var(--font-main)";
  bBadge.style.fontSize = "1rem";
  bBadge.style.fontWeight = "bold";

  const bText = document.createElement("span");
  bText.textContent = "Бык — цифра угадана и стоит на своём месте.";
  bText.style.color = "var(--text-muted)";
  bText.style.fontSize = "0.9rem";
  bText.style.lineHeight = "1.4";

  ruleBulls.append(bBadge, bText);

  // --- КОРОВЫ (без innerHTML) ---
  const ruleCows = document.createElement("div");
  ruleCows.className = "history-item";
  ruleCows.style.display = "flex";
  ruleCows.style.alignItems = "center";
  ruleCows.style.gap = "12px";

  const cBadge = document.createElement("span");
  cBadge.className = "score-cows";
  cBadge.textContent = "C";
  cBadge.style.fontFamily = "var(--font-main)";
  cBadge.style.fontSize = "1rem";
  cBadge.style.fontWeight = "bold";

  const cText = document.createElement("span");
  cText.textContent = "Корова — цифра есть в коде, но стоит в другом месте.";
  cText.style.color = "var(--text-muted)";
  cText.style.fontSize = "0.9rem";
  cText.style.lineHeight = "1.4";

  ruleCows.append(cBadge, cText);

  rulesList.append(ruleBulls, ruleCows);

  const footerInfo = document.createElement("div");
  footerInfo.className = "info-box";
  footerInfo.textContent = "Цифры не повторяются. Код может начинаться с 0. Попытки не ограничены.";

  rightCol.append(rightHeader, rightTitle, rulesList, footerInfo);
  layout.append(leftCol, rightCol);
  container.appendChild(layout);
};
