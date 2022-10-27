export function parseJSON(tempObject: any, path: string) {
  let tempValue = tempObject;

  try {
    tempValue = JSON.parse(tempObject[path]);
  } catch (e) {
    tempValue = undefined;
  }

  return tempValue;
}
