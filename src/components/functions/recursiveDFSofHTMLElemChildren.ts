// recursive dfs to parse through an HTMLCollection of varying dimentions per item to search for a particular element
export const recursiveDFSofHTMLElemChildren = (collection: HTMLCollection, el: Element, parent?: Element): boolean => {
    if (parent && parent === el) return true;
    for (let i = 0; i < collection.length; i++) {
        const element = collection[i];
        if (element === el) {
          return true;
        }
        if (element.children) {
          if (recursiveDFSofHTMLElemChildren(element.children, el)) {
            return true;
          }
        }
    }
    return false;
}