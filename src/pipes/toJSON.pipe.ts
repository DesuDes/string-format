import { Pipe } from "./pipe";

export class ToJSONPipe extends Pipe {
  action(value: any): any {
    return JSON.stringify(value);
  }
}
