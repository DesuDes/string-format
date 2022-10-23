import { Pipe } from "./pipe";

export class ToUpperCasePipe extends Pipe {
  action(value: any): any {
    return value?.toString().toUpperCase();
  }
}
