// src/ui/renderRecords.ts
export type RecordEntry = {
  length: number;
  base: number;
  attempts: number;
  timeSec: number;
};

const STORAGE_KEY = "bulls-and-cows-records";

// Получить все рекорды
export const getRecords = (): RecordEntry[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

// Добавить новый рекорд
export const addRecord = (entry: RecordEntry) => {
  const records = getRecords();
  records.push(entry);

  // Сортировка: сначала по попыткам (меньше = лучше), потом по времени
  records.sort((a, b) => a.attempts - b.attempts || a.timeSec - b.timeSec);

  // Оставляем только Топ-10
  const top10 = records.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
};

// Отрисовка таблицы
export const renderRecords = (container: HTMLElement) => {
  const records = getRecords();
  if (records.length === 0) return; // Не рисуем, если пусто

  const title = document.createElement("h3");
  title.textContent = "🏆 Таблица рекордов";
  container.appendChild(title);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.textAlign = "center";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Место", "Режим", "Попытки", "Время"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.borderBottom = "1px solid #ccc";
    th.style.padding = "5px";
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  records.forEach((rec, idx) => {
    const tr = document.createElement("tr");

    // Форматируем режим (например, "4 цифры, Hex")
    const baseName =
      rec.base === 2 ? "Bin" : rec.base === 8 ? "Oct" : rec.base === 10 ? "Dec" : "Hex";
    const modeText = `${rec.length} цифры, ${baseName}`;

    const cells = [
      (idx + 1).toString(),
      modeText,
      rec.attempts.toString(),
      `${rec.timeSec.toFixed(1)} сек`,
    ];

    cells.forEach((text, i) => {
      const td = document.createElement("td");
      td.textContent = text;
      td.style.padding = "5px";
      if (i === 2 && idx === 0) td.style.color = "green"; // Выделяем лучший результат
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
};
