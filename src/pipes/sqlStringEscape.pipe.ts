// const SqlString = require("sqlstring");
import SqlString from "sqlstring";
import { Pipe } from "./pipe";

export class SQLStringEscapePipe extends Pipe {
  action(value: any): any {
    return SqlString.escape(value);
  }
}
