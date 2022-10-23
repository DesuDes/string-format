import { Pipe } from "./pipe";

export class ToLowerCasePipe extends Pipe {
  action(value: any): any {
    return value?.toString().toLowerCase();
  }
}
