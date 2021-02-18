class Point {
    constructor(x = 1, y = 1) {
        this.x = x;
        this.y = y;
    }
    draw() {
        console.log("X: " + this.x + ", Y: " + this.y);
    }
    get X() {
        return this.x;
    }
    set X(value) {
        if (value < 0) {
            throw new Error("Value cannot be less than 0");
        }
        this.x = value;
    }
}
class Xcoordinate extends Point {
    show() {
        console.log("X: " + this.x);
    }
}
let point = new Point(1, 2);
console.log(point);
var BaseObject = {
    foo: null,
};
function fooFactory(fooValue) {
    var props = { foo: fooValue };
    return Object.create(BaseObject, props);
}
//# sourceMappingURL=hello.js.map