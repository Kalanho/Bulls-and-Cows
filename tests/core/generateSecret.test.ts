import { describe, it, expect } from "vitest";
import { generateSecret } from "../../src/core/generateSecret.js";

describe("generateSecret", () => {
  it("детерминированный random даёт предсказуемый результат", () => {
    const random = () => 0;
    const secret = generateSecret(4, 10, random);
    expect(secret).toBe("0123");
  });

  it("длина и уникальность", () => {
    const secret = generateSecret(4, 10);
    expect(secret).toHaveLength(4);
    expect(new Set(secret).size).toBe(4);
  });

  it("все символы допустимы для base", () => {
    const secret = generateSecret(2, 2);
    expect([...secret].every((c) => "01".includes(c))).toBe(true);
  });
});
