import { Pipe } from "./pipe";

export class ParseJSONPipe extends Pipe {
  action(value: any): any {
    let obj = value;
    try {
      obj = JSON.parse(value);
    } catch (e) {}
    return obj;
  }
}
