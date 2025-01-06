import type { AllPaths, BaseDeepMap, FromPath } from "./types.js";

export function getPath<T extends BaseDeepMap, K extends AllPaths<T>>(
  obj: T,
  path: K,
): FromPath<T, K> {
  const allKeys = getAllKeysFromPath(path);
  let res = obj;
  for (const key of allKeys) {
    if (res === undefined) {
      break;
    }
    res = res[key];
  }
  return res;
}

export function setPath<T extends BaseDeepMap, K extends AllPaths<T>>(
  obj: T,
  path: K,
  value: FromPath<T, K>,
): T {
  return setByKey(obj != null ? obj : {}, getAllKeysFromPath(path), value);
}

function setByKey<T extends BaseDeepMap>(
  obj: T,
  splittedKeys: PropertyKey[],
  value: unknown,
): T {
  const key = splittedKeys[0];
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  if (splittedKeys.length === 1) {
    if (value === undefined) {
      if (Array.isArray(copy)) {
        copy.splice(key, 1);
      } else {
        delete copy[key];
      }
    } else {
      copy[key] = value;
    }
    return copy;
  }
  ensureKey(copy, key, splittedKeys[1]);
  copy[key] = setByKey(copy[key], splittedKeys.slice(1), value);
  return copy;
}

const ARRAY_INDEX = /(.*)\[(\d+)\]/;

function getAllKeysFromPath(path) {
  return path.split(".").flatMap((key) => getKeyAndIndicesFromKey(key));
}

function getKeyAndIndicesFromKey(key) {
  if (ARRAY_INDEX.test(key)) {
    const [, keyPart, index] = key.match(ARRAY_INDEX);
    return [...getKeyAndIndicesFromKey(keyPart), index];
  }
  return [key];
}

const IS_NUMBER = /^\d+$/;
function ensureKey(obj, key, nextKey) {
  if (key in obj) {
    return;
  }

  const isNum = IS_NUMBER.test(nextKey);

  if (isNum) {
    obj[key] = Array(parseInt(nextKey, 10) + 1);
  } else {
    obj[key] = {};
  }
}
