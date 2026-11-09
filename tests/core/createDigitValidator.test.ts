import { describe, it, expect } from "vitest";
import { createDigitValidator } from "../../src/core/createDigitValidator.js";

describe("createDigitValidator", () => {
  it("bin: только 0 и 1", () => {
    const isDigit = createDigitValidator(2);
    expect(isDigit("0")).toBe(true);
    expect(isDigit("1")).toBe(true);
    expect(isDigit("2")).toBe(false);
  });

  it("hex: регистр не важен", () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit("a")).toBe(true);
    expect(isDigit("A")).toBe(true);
    expect(isDigit("F")).toBe(true);
    expect(isDigit("g")).toBe(false);
  });
});
