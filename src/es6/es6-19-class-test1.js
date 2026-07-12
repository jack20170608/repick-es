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