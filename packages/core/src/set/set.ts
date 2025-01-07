/**
 * Sets the value at path of object. If a portion of path doesn’t exist, it’s created.
 *
 * @example
 * const obj = { a: { b: 2 } };
 * set(obj, 'a.c', 1);
 * // => { a: { b: 2, c: 1 } }
 *
 * // `[number]` can be used to access array elements
 * set(obj, 'a.c[0]', 'hello');
 * // => { a: { b: 2, c: ['hello'] } }
 *
 * // numbers with dots are treated as keys
 * set(obj, 'a.c.0.d', 'world');
 * // => { a: { b: 2, c: { 0: { d: 'world' } } }
 *
 * // supports numbers in keys
 * set(obj, 'a.e0.a', 1);
 * // => { a: { e0: { a: 1 } } }
 *
 * @param obj The object to modify.
 * @param path The path of the property to set.
 * @param value The value to set.
 * @template TObj The type of the object.
 * @template TPath The type of the object path.
 * @template TVal The type of the value to set.
 * @returns The modified object.
 */

export function set<
  TObj extends Record<PropertyKey, any>,
  TPath extends string,
  TVal,
>(obj: TObj, path: TPath, value: TVal): any {
  const pathParts = (path as string).split(pathSplitRegex);
  let currentObj: Record<PropertyKey, unknown> = obj;

  for (let index = 0; index < pathParts.length; index++) {
    const key = pathParts[index].replace(matchBracketsRegex, "");

    if (index === pathParts.length - 1) {
      currentObj[key] = value;
      break;
    }

    const nextElementInArray = pathParts[index + 1].startsWith("[");
    const nextElementInObject = !nextElementInArray;

    if (nextElementInArray && !Array.isArray(currentObj[key])) {
      currentObj[key] = [];
    }

    if (nextElementInObject && !isPlainObject(currentObj[key])) {
      currentObj[key] = {};
    }

    currentObj = currentObj[key] as Record<PropertyKey, unknown>;
  }

  return obj;
}

const pathSplitRegex = /\.|(?=\[)/g;
const matchBracketsRegex = /[[\]]/g;

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  return value?.constructor === Object;
}
