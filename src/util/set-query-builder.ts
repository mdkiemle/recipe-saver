export interface KeyValue {
  [key: string]: string;
}

export const setQueryBuilder = (stuff: KeyValue): string => {
  const values = [];
  for (const key in stuff) {
    if (stuff[key]) {
      values.push([`${key} = "${stuff[key]}"`])
    }
  }
  const joinedStatement = values.join(", ");
  return joinedStatement;
}