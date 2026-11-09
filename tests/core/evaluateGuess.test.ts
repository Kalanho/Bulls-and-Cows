import { describe, it, expect } from "vitest";
import { evaluateGuess } from "../../src/core/evaluateGuess.js";

describe("evaluateGuess", () => {
  it("полное совпадение", () => {
    expect(evaluateGuess("0123", "0123")).toEqual({ bulls: 4, cows: 0 });
  });
  it("ничего не угадано", () => {
    expect(evaluateGuess("0123", "4567")).toEqual({ bulls: 0, cows: 0 });
  });
  it("смешанный случай", () => {
    expect(evaluateGuess("0123", "0213")).toEqual({ bulls: 2, cows: 2 });
  });
  it("hex регистр", () => {
    expect(evaluateGuess("abcd", "ABCD")).toEqual({ bulls: 4, cows: 0 });
  });
});
