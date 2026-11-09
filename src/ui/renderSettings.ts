import { countPossibleSecrets } from "../core/countPossibleSecrets.js";

type Settings = { length: number; base: number };

export const renderSettings = (container: HTMLElement, onStart: (settings: Settings) => void) => {
  container.replaceChildren();

  const title = document.createElement("h1");
  title.textContent = "Bulls and Cows";
  container.appendChild(title);

  // --- Выбор системы счисления ---
  const baseLabel = document.createElement("label");
  baseLabel.textContent = "Система счисления: ";
  const baseSelect = document.createElement("select");

  const bases = [
    { value: 2, label: "Bin (2)" },
    { value: 8, label: "Oct (8)" },
    { value: 10, label: "Dec (10)" },
    { value: 16, label: "Hex (16)" },
  ];

  bases.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value.toString();
    option.textContent = label;
    baseSelect.appendChild(option);
  });
  baseSelect.value = "10"; // По умолчанию Dec
  baseLabel.appendChild(baseSelect);
  container.appendChild(baseLabel);
  container.appendChild(document.createElement("br"));
  container.appendChild(document.createElement("br"));

  // --- Выбор длины ---
  const lengthLabel = document.createElement("label");
  lengthLabel.textContent = "Длина секретного числа: ";
  const lengthSelect = document.createElement("select");

  for (let len = 2; len <= 6; len++) {
    const option = document.createElement("option");
    option.value = len.toString();
    option.textContent = len.toString();
    lengthSelect.appendChild(option);
  }
  lengthSelect.value = "4"; // По умолчанию 4
  lengthLabel.appendChild(lengthSelect);
  container.appendChild(lengthLabel);

  const infoText = document.createElement("p");
  infoText.style.fontSize = "0.9em";
  infoText.style.color = "gray";
  container.appendChild(infoText);

  // --- Логика обновления доступных длин ---
  const updateLengths = () => {
    const base = Number(baseSelect.value);

    // Блокируем длины, которые больше основания системы счисления
    Array.from(lengthSelect.options).forEach((option) => {
      const len = Number(option.value);
      option.disabled = len > base;
    });

    // Если текущая выбранная длина стала недоступной, сбрасываем её
    if (Number(lengthSelect.value) > base) {
      lengthSelect.value = "2";
    }

    // Показываем количество возможных секретов
    const currentLen = Number(lengthSelect.value);
    const count = countPossibleSecrets(currentLen, base);
    infoText.textContent = `Возможных комбинаций: ${count}`;
  };

  baseSelect.addEventListener("change", updateLengths);
  lengthSelect.addEventListener("change", updateLengths);

  // Инициализация при открытии
  updateLengths();
  container.appendChild(document.createElement("br"));

  // --- Кнопка Старт ---
  const startBtn = document.createElement("button");
  startBtn.textContent = "Начать игру";
  startBtn.style.marginTop = "20px";

  startBtn.addEventListener("click", () => {
    onStart({
      length: Number(lengthSelect.value),
      base: Number(baseSelect.value),
    });
  });
  container.appendChild(startBtn);
};
