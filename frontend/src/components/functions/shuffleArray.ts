// TypeScript generic type utilized
export const shuffleArray = <T>(arr: Array<T>, allowDuplicates: boolean) => {
    if (allowDuplicates) 
        return arr.map(el => ({ el, index: Math.random() })).sort((x, y) => x.index - y.index).map(({ el }) => el) as Array<T>;
    let output = arr;
    // needs to use JSON.stringify(output) and JSON.stringify(arr) because Object.is() doesn't account for .map() proxy returns 
    while (JSON.stringify(output) === JSON.stringify(arr)) {
        output = output.map(el => ({ el, index: Math.random() })).sort((x, y) => x.index - y.index).map(({ el }) => el) as Array<T>;
    }
    return output;
}