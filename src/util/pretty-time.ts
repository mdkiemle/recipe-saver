export const pluralize = (word: string, amt: number): string => {
  if (amt > 1) return `${word}s`
  return word;
}


/**
 * @param rawTime - number. Time is stored as minutes in this application
 * @returns - string. Formatted something like "1 hour 35 minutes"
 */

export const prettyTime = (rawTime: number): string => {
  const hours = Math.floor(rawTime / 60);
  const minutes = rawTime % 60;

  if (hours > 0 && minutes > 0) return `${hours} ${pluralize("hour", hours)} and ${minutes} ${pluralize("minute", minutes)}`;
  else if (hours > 0 && minutes === 0) return `${hours} ${pluralize("hour", hours)}`;
  return `${minutes} minutes`;
}