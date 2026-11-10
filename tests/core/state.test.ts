import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { createState, addAttempt, isWon } from "../../src/core/state.js";

describe("Game State", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("createState", () => {
    it("создает начальное состояние с пустой историей", () => {
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

      const state = createState("0123", 4, 10);

      expect(state).toEqual({
        secret: "0123",
        length: 4,
        base: 10,
        history: [],
        startedAt: new Date("2026-01-01T00:00:00Z").getTime(),
        finishedAt: null,
      });
    });
  });

  describe("addAttempt", () => {
    it("добавляет верную попытку и обновляет историю иммутабельно", () => {
      const initialState = createState("0123", 4, 10);
      const newState = addAttempt(initialState, "0213");

      expect(newState).not.toBe(initialState);

      expect(initialState.history).toHaveLength(0);

      expect(newState.history).toEqual([{ guess: "0213", bulls: 2, cows: 2 }]);
    });

    it("не добавляет попытку, если она невалидна (неверная длина)", () => {
      const state = createState("0123", 4, 10);
      const newState = addAttempt(state, "012");

      expect(newState).toBe(state);
      expect(newState.history).toHaveLength(0);
    });

    it("не добавляет попытку, если есть повторяющиеся цифры", () => {
      const state = createState("0123", 4, 10);
      const newState = addAttempt(state, "0012");

      expect(newState).toBe(state);
    });

    it("защищает от дубликатов попыток (чек-лист)", () => {
      const state = createState("0123", 4, 10);

      const state1 = addAttempt(state, "5678");

      const state2 = addAttempt(state1, "5678");

      expect(state2).toBe(state1);
      expect(state2.history).toHaveLength(1);
    });

    it("завершает игру при угадывании (all bulls)", () => {
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const state = createState("0123", 4, 10);

      vi.setSystemTime(new Date("2026-01-01T00:00:05Z"));
      const newState = addAttempt(state, "0123");

      expect(newState.finishedAt).not.toBeNull();
      expect(newState.finishedAt).toBe(new Date("2026-01-01T00:00:05Z").getTime());
    });

    it("не меняет finishedAt, если игра еще не выиграна", () => {
      const state = createState("0123", 4, 10);
      const newState = addAttempt(state, "5678");

      expect(newState.finishedAt).toBeNull();
    });
  });

  describe("isWon", () => {
    it("возвращает false для пустой истории", () => {
      const state = createState("0123", 4, 10);
      expect(isWon(state)).toBe(false);
    });

    it("возвращает false, если последняя попытка не угадана", () => {
      const state = addAttempt(createState("0123", 4, 10), "0213");
      expect(isWon(state)).toBe(false);
    });

    it("возвращает true, если последняя попытка полностью угадана", () => {
      const state = addAttempt(createState("0123", 4, 10), "0123");
      expect(isWon(state)).toBe(true);
    });
  });
});
