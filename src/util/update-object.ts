export const updateObject = <T>(obj: T, value: Partial<T>): T => ({...obj, ...value});
