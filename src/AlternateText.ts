module SpinText {

  export class AlternatedText extends Array<ITextPart> implements ITextPart {

    private _rnd: Random;
    private _level: number;

    constructor(rnd: Random, level : number = 0) {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
      this._rnd = rnd != null ? rnd : new Random(1000);
      this._level = level;
    }

    public toString(): string {
      if (this.length === 0) return ""; 
      var chosedIdx: number = this._rnd.nextInt(0, this.length - 1);
      var result = this[chosedIdx].toString()
      return result;
    } 

    public toStructuredString(): string {
      let sb: StringBuilder = new SpinText.StringBuilder();
      let first: boolean = true;
      sb.append("{");
      this.forEach((el) => {
        if (first) first = false;
        else sb.append("|"); 
        sb.append(el.toStructuredString());
      });
      sb.append("}");
      return sb.toString();
    } 
         
    public countVariants(): number {
      let res: number = 0;
      this.forEach((tp) => {
        if (res <= 100000) // stop counting after reaching 100000
          res += tp.countVariants();
      });
      return res;
    }

    public countMinWords(): number {
      let counter = 0;
      this.forEach((tp) => {                  
        let minWords = tp.countMinWords();
        if (counter === 0) counter = minWords;
        if (minWords < counter && minWords > 0) counter = minWords;
      });
      return counter;
    }

    public countMaxWords(): number {
      let counter = 0;
      this.forEach((tp) => {
        let maxWords = tp.countMinWords();
        if (maxWords > counter) counter = maxWords;
      });
      return counter;
    }
  }
}
