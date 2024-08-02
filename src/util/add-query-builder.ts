/**
 * 
 * @returns [string, string], first value are the actual values, second are the keys
 */
export const addQueryBuilder = <T extends {}>(obj: T): [string, string] => {
  const keyValues = [];
  const values = [];
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      keyValues.push(`${key}`);
      values.push(typeof obj[key] === "string" ? `"${obj[key]}"` : obj[key]);
    }
  }
  const joinedKeys = keyValues.join(", ");
  const joinedValues = values.join(", ");
  return [joinedValues, joinedKeys];
};