var Vehicle = function(){
    this.price = 1000;
}

var v = new Vehicle();
console.log(v.price);

function Fubar(foo, bar){
    if (!(this instanceof Fubar)){
        return new Fubar(foo, bar);
    }
    this._foo = foo;
    this._bar = bar;
}

var result = Fubar(1,2);
console.log(result._foo);



