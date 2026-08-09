class Point {
    #c = 100;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    set counter(v){
        this.#c = v;
    }

    get counter() {
        return this.#c;
    }
}

const p1 = new Point(1, 2);

console.log(`${p1.counter}`);
