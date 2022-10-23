import { Pipe } from "./pipe";

export class ReverseStringPipe extends Pipe {
  action(value: any): any {
    value = value + "";
    return value.split("").reverse().join("");
  }
}
