const stdToColor: { [key: string]: string } = {
    '3': 'rgb(252,144,56)',
    '2': 'rgb(250, 234, 110)',
    '1': 'rgb(185,232,246)',
    '0': 'rgb(203,176,235)',
    '-1': 'rgb(252,132,141)',
    '-2': 'rgb(102,192,217)',
    '-3': 'rgb(121,201,247)',
};

export const attributeToColor = (attrs: Record<string, unknown>) => {
    const output: Array<[string, string]> = [];
    for (const attribute in attrs) {
        const name: string = (attrs[attribute] as Array<unknown>)[0] as string;
        const stdDev: string = (attrs[attribute] as Array<unknown>)[1] as string;
        output.push([name, stdToColor[stdDev]])
    }
    return output;
}