import { ITextPart } from "./ITextPart";
import { TextHelper } from "./TextHelper";

export class SimpleText implements ITextPart {

  private _text: string;
  private _wordsCount: number = -1;
  
  private _children: Array<ITextPart>;

  constructor(text: string) {
    this._text = text;
    this._children = [];
  } 

  public children(): Array<ITextPart> {
    return this._children;
  }
  
  public WordsCount() {
    return (this._wordsCount == -1) ? TextHelper.WordsCount(this._text) : this._wordsCount;
  }    

  public toString() {
    return this._text;
  }  

  public toStructuredString() {
    return this._text;
  }

  public toArray() {
    return [this];
  }  

  public count(): number {
    return 1;
  }

  public countVariants() {
    return 1;
  }

  public countMinWords() {
    return this.WordsCount();
  }

  public countMaxWords() {
    return this.WordsCount();
  } 

  public static Empty(): SimpleText {
    return new SimpleText('');
  } 
}




