export type RecordEntry = {
  attempts: number;
  time: number;
  length: number;
  base: number;
  date: string;
};

const STORAGE_KEY = "bulls-and-cows-records";

export const getRecords = (): RecordEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addRecord = (record: RecordEntry) => {
  const records = getRecords();
  records.push(record);
  records.sort((a, b) => {
    if (a.attempts !== b.attempts) return a.attempts - b.attempts;
    return a.time - b.time;
  });

  const top10 = records.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
};

export const renderRecords = (container: HTMLElement) => {
  const records = getRecords();

  const list = document.createElement("ul");
  list.className = "records-list";

  if (records.length === 0) {
    const empty = document.createElement("div");
    empty.className = "info-box";
    empty.textContent = "Пока нет рекордов.";
    list.append(empty);
  } else {
    records.forEach((r, i) => {
      const li = document.createElement("li");
      li.className = "record-item";

      const rank = document.createElement("span");
      rank.textContent = `#${i + 1}`;

      const info = document.createElement("span");
      info.textContent = `${r.attempts} попыток · ${r.time}с`;

      li.append(rank, info);
      list.append(li);
    });
  }

  container.append(list);
};
