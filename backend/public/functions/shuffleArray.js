export const shuffleArray = (arr) => {
    return arr
        .map(el => ({ el, index: Math.random() }))
        .sort((x, y) => x.index - y.index)
        .map(({ el }) => el);
};
