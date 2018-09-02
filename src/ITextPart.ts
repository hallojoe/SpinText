module SpinText {
  /**
   * Interface for any textpart
   */
  export interface ITextPart {
    /**
     * To result string representation
     */
    toString(): string;
    /**
     * To original string TextPart was parsed from
     */
    toStructuredString(): string;
    /**
     * Returns total number of variants that can be possibly produced
     */
    countVariants(): number;
    /**
     * Returns the minimal number of alternatives of a single textpart
     */
    countMinWords(): number;
    /**
     * Returns the maximal number of alternatives of a single textpart
     */
    countMaxWords(): number;
  }
}