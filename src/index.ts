import { ConsoleLogPipe } from "./pipes/consoleLog.pipe";
import { ParseJSONPipe } from "./pipes/parseJSON.pipe";
import { ReverseStringPipe } from "./pipes/reverseString.pipe";
import { SQLStringEscapePipe } from "./pipes/sqlStringEscape.pipe";
import { ToJSONPipe } from "./pipes/toJSON.pipe";
import { ToLowerCasePipe } from "./pipes/toLowerCase.pipe";
import { ToUpperCasePipe } from "./pipes/toUpperCase.pipe";

/**
 * This pattern catches:
 * 1. {{ :hello | world}}
 * 2. {{:hello}}
 */
const TEMPLATE_REGEXP = /({{ *:[a-zA-Z:|. -@,]+}})/gi;
const PIPE_LIST = [
  new ToUpperCasePipe(),
  new ToLowerCasePipe(),
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

function analyzeTemplate(
  splitTemplate: string[],
  targetObject: { [key: string]: any }
) {
  for (let x = 0; x < splitTemplate.length; x++) {
    const str = splitTemplate[x];
    if (TEMPLATE_REGEXP.test(str)) {
      //reset index tracker of regexp
      TEMPLATE_REGEXP.lastIndex = 0;

      //this is the metadata or positioning of the placeholder string
      const STR_META_DATA = str.replace(/[{} :]/gi, "").split("|");

      const TARGET_VALUE = getTargetValue(
        targetObject,
        STR_META_DATA[0].split(".")
      );

      splitTemplate[x] = TARGET_VALUE || str;

      const DEF_PIPES = STR_META_DATA[1]?.split("-->");

      //check if has defined pipes
      if (DEF_PIPES) {
        //call pipe for modification
        DEF_PIPES.forEach((tPipe: string) => {
          const TARGET_PIPE = PIPE_LIST.find((pipe) => {
            return pipe.name.toLowerCase() === tPipe.toLowerCase();
          });

          if (TARGET_PIPE) {
            splitTemplate[x] = TARGET_PIPE.action(splitTemplate[x]);
          }
        });
      }
    }
  }

  return splitTemplate;
}

function getTargetValueForArray(
  pathName: string,
  remainingPath: string[],
  targetObject: any
) {
  const targetIndexes = pathName.replace("@", "").split("-");
  let targetValue = "";
  //a range was given to access the array. The elements within the range is the `targetValue` which we would want to return.
  if (
    targetIndexes.length === 2 &&
    !Number.isNaN(+targetIndexes[0]) &&
    (!Number.isNaN(+targetIndexes[1]) || targetIndexes[1] === "") // consider `:hello.arr.0-` -> `0-` as an argument for printing all elements of the array
  ) {
    let tempVal = "";
    const endIndex =
      targetIndexes[1] === "" ? targetObject.length : +targetIndexes[1]; //if '' because of `0-` was provided, iterate throughout the lenght of the array
    for (let x = +targetIndexes[0]; x < endIndex; x++) {
      if (remainingPath.length > 0) {
        //traverse the object in accordance of the remaining path
        tempVal += getTargetValue(targetObject[x], [...remainingPath]) + " ";
      } else {
        tempVal += targetObject[x] + " ";
      }
    }
    targetValue += tempVal.trimEnd();
  } else if (!Number.isNaN(+targetIndexes[0])) {
    //only an index was given, access the element and return it as `targetValue`
    if (remainingPath.length > 0) {
      targetValue += getTargetValue(
        targetObject[+targetIndexes[0]],
        remainingPath
      );
    } else {
      targetValue += targetObject[+targetIndexes[0]];
    }
  }
  return targetValue;
}

function getTargetValue(targetObject: any, path: string[]): string {
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

  const SPLITTED_DATA = splitTemplate(template);
  const PREP_DATA = analyzeTemplate(SPLITTED_DATA, TARGET_OBJECT);

  return PREP_DATA.join("");
}

// console.log("----");
// const FORMATTED_STRING = formatString(
//   "Sample: {{:objTest | toJSON --> consoleLog --> toUpperCase --> reverseString }}",
//   {
//     hello: "Hello",
//     name: "Tiger",
//     world: "world",
//     place: "Makati",
//     deep: {
//       info: {
//         welcome: "Huhu.",
//       },
//     },
//     func: () => {
//       return "orange";
//     },
//     arr: [
//       1,
//       {
//         name: ["success"],
//       },
//       {
//         name: "Tiger",
//       },
//       {
//         name: "Shower",
//       },
//     ],
//     arr2: [
//       [0, 1, 2, 3],
//       [4, 5, 6, 7],
//     ],
//     arr3: [
//       [
//         {
//           name: "Ayala",
//         },
//         {
//           name: "BGC",
//         },
//       ],
//       [
//         {
//           name: "Cainta",
//         },
//         {
//           name: "Pasig",
//         },
//         {
//           name: "Marikina",
//         },
//         {
//           name: "Quezon City",
//         },
//       ],
//     ],

//     query: {
//       q1: "QUERY",
//     },
//     objTest: {
//       param: "1",
//     },
//   }
// );

// console.log("RESULT", FORMATTED_STRING);
