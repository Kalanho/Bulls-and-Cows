import { createDigitValidator } from "./createDigitValidator.js";
export const isValidGuess = (guess, length, base) => {
    if (guess.length !== length)
        return false;
    const isDigit = createDigitValidator(base);
    const chars = [...guess.toLowerCase()];
    if (!chars.every(isDigit))
        return false;
    return new Set(chars).size === chars.length;
};
