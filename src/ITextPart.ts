module SpinText {
  export interface ITextPart {
    toString(): string;
    toStructuredString(): string;
    countVariants(): number;
    countMinWords(): number;
    countMaxWords(): number;
  }
}