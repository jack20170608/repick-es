const cart = {
    _wheels: 4,

    get wheels() {
        return this._wheels;
    },

    set wheels(value) {
        if (value < this._wheels) {
            throw new Error('数值太小了！');
        }
        this._wheels = value;
    }
}

cart.wheels = 5;

console.log(`cart._wheels: ${cart._wheels}`);
console.log(`cart.wheels: ${cart.wheels}`);
console.log(`cart.wheels: ${cart.wheels}`);
