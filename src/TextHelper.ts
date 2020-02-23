
/// <summary>
/// Simple helper that allow counting words within a string
/// </summary>
export class TextHelper {

  private static _seperators: string[] = [' ', ',', ';', '.', '!', '"', '(', ')', '?'];

  public static WordsCount(s: string) {
    s = s.trim();
    let pattern = "[" + this.escapeRegExp(this._seperators.join()) + "]";
    let values = s.split(new RegExp(pattern, "g"));
    let result = 0;
    for (var i = 0; i < values.length; i++) 
      if (values[i].trim() !== '') result += 1;
    return result;
  } 

  private static escapeRegExp(s: string) : string {
    return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
}
