const cache = new Map();
export const countPossibleSecrets = (length, base) => {
    if (length < 0 || base < 0)
        return 0;
    if (length === 0)
        return 1;
    if (length > base)
        return 0;
    const key = `${length},${base}`;
    const cached = cache.get(key);
    if (cached !== undefined)
        return cached;
    const result = base * countPossibleSecrets(length - 1, base - 1);
    cache.set(key, result);
    return result;
};
