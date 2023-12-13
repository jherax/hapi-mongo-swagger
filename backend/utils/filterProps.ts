/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Projects an object with only the specified properties from the input object
 * @param keys Array of properties to retrieve from the input object
 * @returns a function that projects the object
 */
export default function filterProps<T = any>(keys: string[]) {
  return (obj: T): T => {
    const mapped = Object.create(null);
    keys.forEach(prop => {
      mapped[prop] = obj[prop];
    });
    return mapped;
  };
}
