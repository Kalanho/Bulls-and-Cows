export const createDigitValidator = (base) => (char) => {
    const alphabet = "0123456789abcdef".slice(0, base);
    return char.length === 1 && alphabet.includes(char.toLowerCase());
};
