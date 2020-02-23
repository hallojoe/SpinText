export class StringBuilder {

  private _strings : Array<string>;

  constructor(value: string = "")
  {
    this._strings = new Array<string>();
    this.append(value);
  }

  public append (value: string): void {
    if (value) 
      this._strings.push(value);
  }

  public clear (): void {
    this._strings = new Array<string>();
  }

  public toString (): string {
    var result = this._strings.join("");
    return result;
  }
}
