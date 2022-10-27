import { parseJSON } from "./parseJSON";

function getTargetValueForArray(
  pathName: string,
  remainingPath: string[],
  targetObject: any,
  opts: any
) {
  const targetIndexes = pathName.replace("@", "").split("-");
  const targetValue = [];
  //a range was given to access the array. The elements within the range is the `targetValue` which we would want to return.
  if (
    targetIndexes.length === 2 &&
    !Number.isNaN(+targetIndexes[0]) &&
    (!Number.isNaN(+targetIndexes[1]) || targetIndexes[1] === "") // consider `:hello.arr.0-` -> `0-` as an argument for printing all elements of the array
  ) {
    const tempVal = [];
    const endIndex =
      targetIndexes[1] === "" ? targetObject.length : +targetIndexes[1]; //if '' because of `0-` was provided, iterate throughout the lenght of the array
    for (let x = +targetIndexes[0]; x < endIndex; x++) {
      if (remainingPath.length > 0) {
        const V = getTargetValue(targetObject[x], [...remainingPath], opts);

        //if it's an array, spread them to normalize arrangement in accordance to the syntax
        if (Array.isArray(V)) {
          tempVal.push(...V);
        } else {
          tempVal.push(V);
        }
      } else {
        tempVal.push(targetObject[x]);
      }
    }
    targetValue.push(...tempVal);
  } else if (!Number.isNaN(+targetIndexes[0])) {
    /**
     * This block condition is for array accessor only accessing one index. E.g syntax: `@1`,`@2`
     */

    //if the remaining path isn't done yet, call `getTargetValue` to recursively get the desired value.
    if (remainingPath.length > 0) {
      const V = getTargetValue(
        targetObject[+targetIndexes[0]],
        remainingPath,
        opts
      );
      if (Array.isArray(V)) {
        targetValue.push(...V);
      } else {
        targetValue.push(V);
      }
    } else {
      targetValue.push(targetObject[+targetIndexes[0]]);
    }
  }
  return targetValue;
}

export function getTargetValue(
  targetObject: any,
  path: string[],
  opts: any
): string | Array<string> {
  let targetValue = "";
  let tempObject = targetObject;

  for (let x = 0; x < path.length; x++) {
    const pathName = path[x];
    if (pathName[0] === "@") {
      //logic to access array data structure
      if (Array.isArray(tempObject)) {
        //`getTargetValueForArray` handles proceeding path after the `@` recursively.
        return getTargetValueForArray(
          pathName,
          path.slice(x + 1, path.length),
          tempObject,
          opts
        );
      }
    } else if (pathName[0] === "!") {
      // this code block is for accessing json immediately as indicated by the syntax.
      //exclude the symbol '!' and retain the path
      const CUR_PATH = path.slice(0, x + 1).join(".");
      if (opts.CACHE_PARSED_JSON[CUR_PATH]) {
        targetValue = opts.CACHE_PARSED_JSON[CUR_PATH];
      } else {
        const VALUE = parseJSON(tempObject, pathName.substring(1));
        opts.CACHE_PARSED_JSON[CUR_PATH] = VALUE;
        targetValue = VALUE;
      }
    } else {
      targetValue = tempObject?.[pathName];
    }

    //traverse the object. Also asign falsy values if needed to establish undefined paths.
    if (
      typeof targetValue === "object" ||
      targetValue === undefined ||
      targetValue === null
    ) {
      tempObject = targetValue;
    }
  }
  return targetValue;
}
