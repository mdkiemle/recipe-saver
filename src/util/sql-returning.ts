export const returnValues = <T extends {}>(obj: T): string => {
  const keys = Object.keys(obj);
  return keys.join(", ");
}