module SpinText {

  export class Random {
    private _seedStart: number;
    private _seed: number;

    constructor(seed: number) {
      this._seedStart = seed;
      if (this._seedStart <= 0) 
         this._seedStart = Math.floor(Math.random() * 99999) + 11111;
      this._seed = this._seedStart;
    }

    private next(min: number = 0, max: number = 0): number {
      this._seed = (this._seedStart * 9301 + 49297) % 233281;  //changed 233280 to 233281 
      var rnd = this._seed / 233281;             // changed 233280 to 233281 
      var result = min + rnd * (max - min + 1);
      return result;
    }

    public nextInt(min: number, max: number): number {
      let result = Math.floor(this.next(min, max));       // changed round to floor
      return result;
    }

    public nextDouble(): number {
      return this.next(0, 1);
    }

    public pick(collection: any[]): any {
      return collection[this.nextInt(0, collection.length - 1)];
    }
  }
}