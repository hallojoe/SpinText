module SpinText {

  export class ConcatenetedText extends Array<ITextPart> implements ITextPart {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);

    }

    toString(): string {
      let sb: SpinText.StringBuilder = new SpinText.StringBuilder();
      this.forEach((tp) => { 
        sb.append(tp.toString()); 
      });
      return sb.toString();
    }

    toStructuredString(): string {
      let sb: SpinText.StringBuilder = new SpinText.StringBuilder();
      this.forEach((tp) => { 
        sb.append(tp.toStructuredString()); 
      });
      return sb.toString();
    }

    countVariants(): number {
      let res: number = 1;
      this.forEach((tp) => { 
        if (res <= 100000) // stop counting after reaching 100000
          res = res * tp.countVariants(); 
      });
      return res;
    }

    countMinWords(): number {
      let res: number = 0;
      this.forEach((tp) => { 
        res = res + tp.countMinWords(); 
      });
      return res;
    }

    countMaxWords(): number {
      let res: number = 0;
      this.forEach((tp) => { 
        res = res + tp.countMaxWords(); 
      });
      return res;
    }

  }
}