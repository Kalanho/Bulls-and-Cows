export const generateSecret = (length, base, random = Math.random) => {
    const alphabet = [..."0123456789abcdef".slice(0, base)];
    const pick = (pool) => {
        if (pool.length === 0)
            return [];
        const idx = Math.floor(random() * pool.length);
        const [chosen] = pool.splice(idx, 1);
        return [chosen, ...pick(pool)];
    };
    return pick([...alphabet])
        .slice(0, length)
        .join("");
};
