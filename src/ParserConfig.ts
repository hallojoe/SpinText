module SpinText {

  export class ParserConfig {

    private _seed: number;

    public random: Random;
    public opening: string = '{';
    public closing: string = '}';
    public delimiter: string = '|';

    constructor(seed: number = -1) {
      if (seed <= 0)
        this.reSeed();
      else
        this._seed = seed;
      this.random = new Random(this._seed);
    }

    public reSeed() {
      this._seed = Math.floor(Math.random() * 99999) + 11111;
    }
    
  }

}