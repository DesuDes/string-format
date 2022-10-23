import { Pipe } from "./pipe";

export class ConsoleLogPipe extends Pipe {
  action(value: any): any {
    console.log(value);
    return value;
  }
}
