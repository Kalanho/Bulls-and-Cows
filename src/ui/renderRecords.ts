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
