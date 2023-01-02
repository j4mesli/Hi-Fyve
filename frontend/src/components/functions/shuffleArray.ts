export const shuffleArray = (arr: Array<unknown>) => {
    return arr
    .map(el => ({ el, index: Math.random() }))
    .sort((x, y) => x.index - y.index)
    .map(el => el)
}