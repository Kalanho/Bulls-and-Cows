import { evaluateGuess } from "./evaluateGuess.js";
import { isValidGuess } from "./isValidGuess.js";

export type Attempt = { guess: string; bulls: number; cows: number };

export type GameState = {
  secret: string;
  length: number;
  base: number;
  history: Attempt[];
  startedAt: number;
  finishedAt: number | null;
};

export const createState = (secret: string, length: number, base: number): GameState => ({
  secret,
  length,
  base,
  history: [],
  startedAt: Date.now(),
  finishedAt: null,
});

export const addAttempt = (state: GameState, guess: string): GameState => {
  if (!isValidGuess(guess, state.length, state.base)) return state;
  if (state.history.some((a) => a.guess.toLowerCase() === guess.toLowerCase())) return state;

  const { bulls, cows } = evaluateGuess(state.secret, guess);
  const entry: Attempt = { guess, bulls, cows };
  const won = bulls === state.length;

  return {
    ...state,
    history: [...state.history, entry],
    finishedAt: won ? Date.now() : state.finishedAt,
  };
};

export const isWon = (state: GameState): boolean =>
  state.history.length > 0 && state.history[state.history.length - 1].bulls === state.length;
