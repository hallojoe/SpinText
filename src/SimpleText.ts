module SpinText
{
  export class SimpleText implements SpinText.ITextPart {

    private _text: string;
    private _wordsCount: number = -1;
    
    constructor(text: string) {
      this._text = text;
    } 

    public WordsCount() {
      return (this._wordsCount == -1) ? SpinText.TextHelper.WordsCount(this._text) : this._wordsCount;
    }    

    public toString() {
      return this._text;
    }  

    public toStructuredString() {
      return this._text;
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
      return new SimpleText("");
    } 
  }
}



