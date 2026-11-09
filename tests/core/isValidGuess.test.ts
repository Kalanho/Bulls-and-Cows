import { describe, it, expect } from "vitest";
import { isValidGuess } from "../../src/core/isValidGuess.js";

describe("isValidGuess", () => {
  it("верная длина и допустимые цифры", () => {
    expect(isValidGuess("0123", 4, 10)).toBe(true);
  });
  it("неверная длина", () => {
    expect(isValidGuess("012", 4, 10)).toBe(false);
  });
  it("недопустимый символ", () => {
    expect(isValidGuess("0199", 4, 2)).toBe(false);
  });
  it("повтор", () => {
    expect(isValidGuess("0012", 4, 10)).toBe(false);
  });
  it("hex в верхнем регистре", () => {
    expect(isValidGuess("ABCD", 4, 16)).toBe(true);
  });
});
