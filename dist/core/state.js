import { evaluateGuess } from "./evaluateGuess.js";
import { isValidGuess } from "./isValidGuess.js";
export const createState = (secret, length, base) => ({
    secret,
    length,
    base,
    history: [],
    startedAt: Date.now(),
    finishedAt: null,
});
export const addAttempt = (state, guess) => {
    if (!isValidGuess(guess, state.length, state.base))
        return state;
    if (state.history.some((a) => a.guess.toLowerCase() === guess.toLowerCase()))
        return state;
    const { bulls, cows } = evaluateGuess(state.secret, guess);
    const entry = { guess, bulls, cows };
    const won = bulls === state.length;
    return {
        ...state,
        history: [...state.history, entry],
        finishedAt: won ? Date.now() : state.finishedAt,
    };
};
export const isWon = (state) => state.history.length > 0 && state.history[state.history.length - 1].bulls === state.length;
