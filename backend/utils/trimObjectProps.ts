/**
 * Trims the value of all properties in an object.
 * @param obj The object to iterave over its properties
 * @returns Mutated object
 */
export default function trimObjectProps<T = Record<string, unknown>>(
  obj: T,
): T {
  if (typeof obj !== 'object') {
    throw TypeError('Input value is not an object');
  }

  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'string') {
      obj[prop] = obj[prop].trim();
    }
  });

  return obj;
}
