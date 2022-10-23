interface IPipeImplementation {
  action(value: any): any;
}
export abstract class Pipe implements IPipeImplementation {
  private _name: string;
  constructor(name?: string) {
    this._name = (name ?? this.constructor.name)
      .toLowerCase()
      .replace("pipe", "");
  }

  get name() {
    return this._name;
  }

  abstract action(value: any): any;
}
