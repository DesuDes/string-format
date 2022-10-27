import { getTargetValue } from "./getTargetValue";
import { ConsoleLogPipe } from "./pipes/consoleLog.pipe";
import { ParseJSONPipe } from "./pipes/parseJSON.pipe";
import { ReverseStringPipe } from "./pipes/reverseString.pipe";
import { SQLQPipe } from "./pipes/sqlq.pipe";
import { SQLStringEscapePipe } from "./pipes/sqlStringEscape.pipe";
import { ToJSONPipe } from "./pipes/toJSON.pipe";
import { processPipes } from "./processPipes";
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
  new SQLQPipe(),
  new ReverseStringPipe(),
  new ConsoleLogPipe(),
];

let CACHE_PARSED_JSON: any = {};
export function splitTemplate(template: string): string[] {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split#splitting_with_a_regexp_to_include_parts_of_the_separator_in_the_result
   */
  return template.split(TEMPLATE_REGEXP).filter((str) => str.length);
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
        STR_META_DATA[0].split("."),
        { CACHE_PARSED_JSON }
      );

      if (Array.isArray(TARGET_VALUE)) {
        const TEMPLATE: Array<string> = [];

        TARGET_VALUE.forEach((value: any) => {
          const VAL = processPipes(value, STR_META_DATA[1], NEW_PIPE_LIST);
          TEMPLATE.push(VAL);
        });

        templateTokens[x] = TEMPLATE.join(" ");
      } else {
        templateTokens[x] = processPipes(
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

export function formatString(template: string, value: any, opts?: any): string {
  const TARGET_OBJECT = value;

  if (typeof TARGET_OBJECT === "object" && TARGET_OBJECT !== null) {
    //remove existing data from cache
    CACHE_PARSED_JSON = {};

    const SPLITTED_DATA = splitTemplate(template);
    const PREP_DATA = analyzeTemplate(SPLITTED_DATA, TARGET_OBJECT, opts);
    return PREP_DATA.join("");
  } else {
    return TARGET_OBJECT + "";
  }
}
