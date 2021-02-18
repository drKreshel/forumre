

class Point {
  //if you use an access modifier prefix in constructor this is not needed 🌖
  // protected x: number;
  // private y: number;
  constructor(protected x = 1, private y = 1) {
    //this lines are also not needed 🌖
    // this.x = x;
    // this.y = y;
  }

  /**
   * @method draw - Draws a point given X and Y coordinates.
   */
  draw() {
    console.log("X: " + this.x + ", Y: " + this.y);
  }


  get X() {
    return this.x;
  }

  set X(value: number) {
    if (value < 0) {
      throw new Error("Value cannot be less than 0");
    }
    this.x = value;
  }
}

//because x is protected, child classes can access to x, but not y
class Xcoordinate extends Point {
  show() {
    console.log("X: " + this.x);
  }
}

let point = new Point(1, 2);
console.log(point);



/** @namespace */
var BaseObject = {
  /**
   * foo is now BaseObject#foo rather than BaseObject.foo.
   * @instance
   */
  foo: null,
};

/** Generates BaseObject instances. */
function fooFactory(fooValue: any) {
  var props = { foo: fooValue };
  return Object.create(BaseObject, props);
}
