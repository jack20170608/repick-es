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

var Vehicle = function (){
    this.price = 1000;
    return {
        price : 2999
    }
}

Vehicle.prototype.ride = function() {
    console.log('Riding is a good thing!!')
}

var aVehicle = new Vehicle();
console.log(aVehicle.price);

var people = {"id": 1, "name": "jack"}

var man = Object.create(people);

console.log(`people is ${JSON.stringify(people)}`);
console.log(`man is ${JSON.stringify(man)}`);
people.sayHi();
man.sayHi();

man.id = 100;
man.name = 'lucy';

console.log(`people is ${JSON.stringify(people)}`);
console.log(`man is ${JSON.stringify(man)}`);
people.sayHi();
man.sayHi();


