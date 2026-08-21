var F = function (){};

var foo = 1, bar = 2;

var F2 = function (foo, bar){
    this.foo = foo;
    this.bar = bar;
};

var v = Object();
console.log(v);

console.log(F2('jack','fang'));

console.log(this.foo);
console.log(this);
