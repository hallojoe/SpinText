module SpinText {

  export class ParserConfig {

    public seed: number;
    public random: Random;
    public opening: string = '{';
    public closing: string = '}';
    public delimiter: string = '|';

    constructor(seed: number = -1) {
      this.seed = seed;     
      this.random = new Random(this.seed);
    }

    public reSeed() {
      this.random = new Random();
    }
    
  }

}