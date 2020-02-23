import { ITextPart } from "./ITextPart";
import { SimpleText } from "./SimpleText";
import { AlternatedText } from "./AlternateText";
import { ConcatenatedText } from "./ConcatenatedText";
import { Random } from "./Random";
import { ParserConfig } from "./ParserConfig";


export class SpinText {

  private _part: ITextPart;
  private _rnd: Random;
  private _cfg: ParserConfig;

  constructor(text: string, config: ParserConfig = new ParserConfig()) {
    this._part = SpinText.ParsePart(text, 0, text.length, config);
    this._cfg = config;
  }

  private static ParsePart(
    text: string,
    startIdx: number,
    endIdx: number,
    config: ParserConfig = new ParserConfig(-1)): ITextPart
  {      
    if(config.seed <= 0) 
      config.reSeed();
    var at: AlternatedText = new AlternatedText(config.random),
      ct: ConcatenatedText = new ConcatenatedText(),
      part: string = null;
    
    var
      balance: number = 0,  // amount of unmatched opening brackets      
      i: number = 0,      // index of current char      
      opnIdx: number = -1;  // position of the opening bracket

    for (i = startIdx; i <= endIdx - 1; i++) {

      // opening
      // =======
      if (text[i] === config.opening) {
        if (balance == 0) {
          part = text.substr(startIdx, i - startIdx);
          if (part !== null && part !== "")
            ct.push(new SimpleText(part));
            startIdx = i + 1;
          opnIdx = i;
        }
        balance += 1;
      }
      // delimiter
      // =========
      else if (text[i] === config.delimiter && balance === 0)
      {
        part = text.substr(startIdx, i - startIdx);
        ct.push(new SimpleText(part));  // no check for empty string - by design
        at.push(ct); // add to alternatives

        ct = new ConcatenatedText();
        startIdx = i + 1;
      }
      // closing
      // =======
      else if (text[i] === config.closing)
      {           
        balance -= 1;
        if (balance === 0) {
          var innerPart: ITextPart = SpinText.ParsePart(text, opnIdx + 1, i, config);
          ct.push(innerPart);
          opnIdx = -1;
          startIdx = i + 1;
        }
        else if (balance < 0) {
            throw `Unexpected ${config.closing} at position ${i}.`;
        }
      }
    }

    // get part
    // ========
    part = text.substr(startIdx, i - startIdx);

    // if positive balance then trow exception
    // =======================================
    if (balance > 0) 
      throw `Unexpected ${config.opening} at position ${opnIdx}.`;     
    // add part to ConcatenatedText
    // ============================
    if (part !== null && part !== "")
      ct.push(new SimpleText(part));

    // were there alternatives ?
    // =========================
    if (at.length === 0)
      return ct;      // return ConcatenatedText
    else at.push(ct);     // push 

    // return
    // ======
    return at;
  }

  public toString(): string {
    return this._part.toString();
  }

  public toStructuredString(): string {
    return this._part.toStructuredString();
  }

  public toArray(): any {
    return this._part;
  }

  public countVariants(): number {
    return this._part.countVariants();
  }    

  public countMinWords(): number {
    return this._part.countMinWords();
  }

  public countMaxWords(): number {
    return this._part.countMaxWords();
  }

  public static Spin(text: string = '', config: ParserConfig = new ParserConfig(-1)): string {
    if(text === '')
      text = "{This is|It's} {Spin|Spin-text|Spin text}. {Enjoy!| You love it!}";
    return new SpinText(text, config).toString(); 
  }

}
