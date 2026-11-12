export const evaluateGuess = (secret, guess) => {
    const s = [...secret.toLowerCase()];
    const g = [...guess.toLowerCase()];
    const bulls = g.reduce((acc, ch, i) => acc + (ch === s[i] ? 1 : 0), 0);
    const secretSet = new Set(s);
    const guessSet = new Set(g);
    const common = [...guessSet].filter((ch) => secretSet.has(ch)).length;
    return { bulls, cows: common - bulls };
};
