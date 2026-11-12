import { describe, it, expect } from "vitest";
import { countPossibleSecrets } from "../../src/core/countPossibleSecrets.js";

describe("countPossibleSecrets", () => {
  it("P(2,2) = 2", () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });
  it("P(4,10) = 5040", () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });
  it("P(2,16) = 240", () => {
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });
  it("length > base → 0", () => {
    expect(countPossibleSecrets(5, 2)).toBe(0);
  });
  it("мемоизация: повторный вызов", () => {
    const a = countPossibleSecrets(6, 16);
    const b = countPossibleSecrets(6, 16);
    expect(a).toBe(b);
  });
});
