export const findRecursively = <T>(arr: Array<T>, recursiveAttribute: keyof T, condition: (el: T) => boolean): T | undefined => {
  for (const i of arr) {
    if (condition(i)) return i;
    else if (i[recursiveAttribute] && Array.isArray(i[recursiveAttribute])) {
      const item = findRecursively(i[recursiveAttribute] as Array<T>, recursiveAttribute, condition);
      if (item) return item;
    }
  }
  return undefined;
};

export const filterRecursively = <T>(arr: Array<T>, recursiveAttribute: keyof T, condition: (el: T) => boolean): Array<T> => {
  const result: Array<T> = [];
  for (const i of arr) {
    if (condition(i)) result.push(i);
    if (i[recursiveAttribute] && Array.isArray(i[recursiveAttribute]))
      result.push(...filterRecursively(i[recursiveAttribute] as Array<T>, recursiveAttribute, condition));
  }
  return result;
};
