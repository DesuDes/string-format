import { ConsoleLogPipe } from "./pipes/consoleLog.pipe";
import { ParseJSONPipe } from "./pipes/parseJSON.pipe";
import { ReverseStringPipe } from "./pipes/reverseString.pipe";
import { SQLStringEscapePipe } from "./pipes/sqlStringEscape.pipe";
import { ToJSONPipe } from "./pipes/toJSON.pipe";
/**
 * This pattern catches:
 * 1. {{ :hello | world}}
 * 2. {{:hello}}
 */
const TEMPLATE_REGEXP = /({{ *:[a-zA-Z:|. -@,]+}})/gi;
const PIPE_LIST = [
  new ToJSONPipe(),
  new ParseJSONPipe(),
  new SQLStringEscapePipe(),
  new ReverseStringPipe(),
  new ConsoleLogPipe(),
];

export function splitTemplate(template: string): string[] {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split#splitting_with_a_regexp_to_include_parts_of_the_separator_in_the_result
   */
  return template.split(TEMPLATE_REGEXP).filter((str) => str.length);
}

function processPipes(
  placeholder: string,
  value: any,
  pipeDeclString: string,
  PIPE_LIST: Array<any>
) {
  let tempStr = value;
  const DEF_PIPES = pipeDeclString?.split("-->");

  //do not process null and undefined
  if (
    value === null ||
    value === undefined ||
    value === true ||
    value === false
  ) {
    return value + "";
  } else if (DEF_PIPES) {
    //call pipe for modification
    DEF_PIPES.forEach((tPipe: string) => {
      //check if pipe explicitly calls for a built-in string method
      if (tPipe[0] === "!") {
        tempStr = ((tempStr + "") as any)[tPipe.substring(1)]();
      } else {
        const TARGET_PIPE = PIPE_LIST.find((pipe) => {
          return pipe.name.toLowerCase() === tPipe.toLowerCase();
        });

        if (TARGET_PIPE) {
          tempStr = TARGET_PIPE.action(tempStr);
        }
      }
    });

    return tempStr;
  } else {
    /**
     *  Restore placeholder instead of displaying `undefined`.
     *  BUT check test case #11 of formatString.test.ts for exception in printing undefined.
     *  The string parser we have for array accessbility automatically converts undefined to string hence it will not trigger the logic below.
     */
    return tempStr;
  }
}

function analyzeTemplate(
  templateTokens: string[],
  targetObject: { [key: string]: any },
  opts?: any
) {
  let importedPipes: Array<{ name: string; action: any }> = [];
  if (opts?.pipes) {
    importedPipes = [...opts.pipes];
  }

  const NEW_PIPE_LIST = [...PIPE_LIST, ...importedPipes];

  for (let x = 0; x < templateTokens.length; x++) {
    if (TEMPLATE_REGEXP.test(templateTokens[x])) {
      //reset index tracker of regexp
      TEMPLATE_REGEXP.lastIndex = 0;

      //this is the metadata or positioning of the placeholder string
      const STR_META_DATA = templateTokens[x]
        .replace(/[{} :]/gi, "")
        .split("|");

      // TARGET_Value is an array if queries values are coming from an array
      const TARGET_VALUE = getTargetValue(
        targetObject,
        STR_META_DATA[0].split(".")
      );

      if (Array.isArray(TARGET_VALUE)) {
        const TEMPLATE: Array<string> = [];

        TARGET_VALUE.forEach((value: any) => {
          const VAL = processPipes(
            templateTokens[x],
            value,
            STR_META_DATA[1],
            NEW_PIPE_LIST
          );
          TEMPLATE.push(VAL);
        });

        templateTokens[x] = TEMPLATE.join(" ");
      } else {
        templateTokens[x] = processPipes(
          templateTokens[x],
          TARGET_VALUE,
          STR_META_DATA[1],
          NEW_PIPE_LIST
        );
      }

      //this section is for binding data to placeholder with its pipes
      //if splitTemplate[x] (undefined) hasn't transformed because there's no matching data for it.
    }
  }
  return templateTokens;
}

function getTargetValueForArray(
  pathName: string,
  remainingPath: string[],
  targetObject: any
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
        const V = getTargetValue(targetObject[x], [...remainingPath]);

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
      const V = getTargetValue(targetObject[+targetIndexes[0]], remainingPath);
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

function getTargetValue(
  targetObject: any,
  path: string[]
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
          tempObject
        );
      }
    } else {
      targetValue = tempObject[pathName];
    }

    if (typeof targetValue === "object") {
      tempObject = targetValue;
    }
  }
  return targetValue;
}

export function formatString(template: string, value: any, opts?: any): string {
  const TARGET_OBJECT = value;

  if (typeof TARGET_OBJECT === "object" && TARGET_OBJECT !== null) {
    const SPLITTED_DATA = splitTemplate(template);
    const PREP_DATA = analyzeTemplate(SPLITTED_DATA, TARGET_OBJECT, opts);

    return PREP_DATA.join("");
  } else {
    return TARGET_OBJECT + "";
  }
}
