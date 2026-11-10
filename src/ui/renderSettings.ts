import { countPossibleSecrets } from "../core/countPossibleSecrets.js";

type Settings = { length: number; base: number };

export const renderSettings = (container: HTMLElement, onStart: (settings: Settings) => void) => {
  // Очищаем контейнер
  container.replaceChildren();

  // Создаем общую сетку (2 колонки на больших экранах)
  const layout = document.createElement("div");
  layout.className = "layout";

  // ==========================================
  // ЛЕВАЯ КОЛОНКА (Настройки)
  // ==========================================
  const leftCol = document.createElement("div");
  leftCol.className = "card";

  const header = document.createElement("div");
  header.className = "card-header";
  header.textContent = "01 / НАСТРОЙКА";

  const title = document.createElement("h2");
  title.textContent = "Выбери свой код";

  // Сетка для селектов
  const formRow = document.createElement("div");
  formRow.className = "form-row";

  // --- Выбор системы счисления ---
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
  baseSelect.value = "10"; // По умолчанию Dec

  baseGroup.append(baseLabel, baseSelect);

  // --- Выбор длины ---
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
  lengthSelect.value = "4"; // По умолчанию 4

  lengthGroup.append(lengthLabel, lengthSelect);

  formRow.append(baseGroup, lengthGroup);

  // Информация о комбинациях
  const infoBox = document.createElement("div");
  infoBox.className = "info-box";

  // --- Логика обновления доступных длин ---
  const updateLengths = () => {
    const base = Number(baseSelect.value);

    // Блокируем длины, которые больше основания
    Array.from(lengthSelect.options).forEach((option) => {
      const len = Number(option.value);
      option.disabled = len > base;
    });

    // Если текущая длина стала недоступной, сбрасываем
    if (Number(lengthSelect.value) > base) {
      lengthSelect.value = "2";
    }

    // Показываем количество возможных секретов
    const currentLen = Number(lengthSelect.value);
    const count = countPossibleSecrets(currentLen, base);

    // Форматируем число с пробелами (например, 5 040)
    infoBox.textContent = `${count.toLocaleString("ru-RU")} возможных комбинаций`;
  };

  baseSelect.addEventListener("change", updateLengths);
  lengthSelect.addEventListener("change", updateLengths);
  updateLengths(); // Инициализация

  // Кнопка старта
  const startBtn = document.createElement("button");
  startBtn.textContent = "Начать игру →";
  startBtn.addEventListener("click", () => {
    onStart({
      length: Number(lengthSelect.value),
      base: Number(baseSelect.value),
    });
  });

  leftCol.append(header, title, formRow, infoBox, startBtn);

  // ==========================================
  // ПРАВАЯ КОЛОНКА (Правила)
  // ==========================================
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
  ruleBulls.style.display = "flex";
  ruleBulls.style.alignItems = "center";
  ruleBulls.style.gap = "10px";

  const bBadge = document.createElement("span");
  bBadge.className = "score-bulls";
  bBadge.textContent = "B";
  bBadge.style.fontSize = "1.2rem";

  const bText = document.createElement("span");
  bText.textContent = "Бык — цифра угадана и стоит на своём месте.";
  bText.style.fontFamily = "var(--font-main)";
  bText.style.fontSize = "0.9rem";
  bText.style.color = "var(--text-muted)";

  ruleBulls.append(bBadge, bText);

  const ruleCows = document.createElement("div");
  ruleCows.className = "history-item";
  ruleCows.style.display = "flex";
  ruleCows.style.alignItems = "center";
  ruleCows.style.gap = "10px";

  const cBadge = document.createElement("span");
  cBadge.className = "score-cows";
  cBadge.textContent = "C";
  cBadge.style.fontSize = "1.2rem";

  const cText = document.createElement("span");
  cText.textContent = "Корова — цифра есть в коде, но стоит в другом месте.";
  cText.style.fontFamily = "var(--font-main)";
  cText.style.fontSize = "0.9rem";
  cText.style.color = "var(--text-muted)";

  ruleCows.append(cBadge, cText);

  rulesList.append(ruleBulls, ruleCows);

  const footerInfo = document.createElement("div");
  footerInfo.className = "info-box";
  footerInfo.textContent = "Цифры не повторяются. Код может начинаться с 0. Попытки не ограничены.";

  rightCol.append(rightHeader, rightTitle, rulesList, footerInfo);

  // Добавляем колонки в общий макет
  layout.append(leftCol, rightCol);

  // Добавляем макет в контейнер (в body)
  container.appendChild(layout);
};
