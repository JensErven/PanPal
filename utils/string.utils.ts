/**
 * Converts a string to lowercase.
 *
 * @param str - The string to convert.
 * @returns The converted lowercase string.
 */
export const toLowerCase = (str: string) => str.toLowerCase();
/**
 * Converts a string to uppercase.
 *
 * @param str - The string to convert.
 * @returns The uppercase version of the input string.
 */
export const toUpperCase = (str: string) => str.toUpperCase();
/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The input string.
 * @returns The input string with the first letter capitalized.
 */
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const trim = (str: string) => str.trim();

// get rid of numbers at the beginning of a string (ex. 1. , 2. , 3. )
export const removeNumbers = (str: string) => str.replace(/^\d+\.\s/, "");
