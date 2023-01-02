// recursive dfs to parse through an HTMLCollection of varying dimentions per item to search for a particular element
export const recursiveDFSofHTMLElemChildren = (collection: HTMLCollection, el: HTMLElement): boolean => {
    for (let i = 0; i < collection.length; i++) {
        if (collection[i] === el) return true;
        if (collection[i].children.length > 0) {
            return recursiveDFSofHTMLElemChildren(collection[i].children, el);
        }
    }
    return false;
}