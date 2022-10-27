export function processPipes(
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
