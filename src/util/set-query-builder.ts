export interface KeyValue {
  [key: string]: string;
}

export type KeysOfObj<T> = {
  [K in keyof T]: string
}

export const setQueryBuilder = <T extends {}>(stuff: KeysOfObj<T>): string => {
  const values = [];
  for (const key in stuff) {
    values.push([`${key} = "${stuff[key]}"`])
  }
  const joinedStatement = values.join(", ");
  return joinedStatement;
}