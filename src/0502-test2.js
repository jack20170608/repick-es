const { prettyPrint } = require('./pretty-print');

function printSpliter(title){
    console.log("--========================================");
    console.log(`--===${title}====`)
    console.log("--========================================");
}

//--=====================================
printSpliter("Test01 the difference of function's prototype and object's prototype!!");
var aFunction = function(){
    print('111');
}

var aObject = {}

console.log('Function:', !!aFunction.prototype);  // true
//Object don't have prototype property
console.log('Object:', !!aObject.prototype);// false

console.log(`aFunction's prototype === Function.prototype is 
    ${aFunction.prototype === Function.prototype}.`);


//--=====================================
printSpliter("Test02 test the extend function in ES5.");

var Animal = function(name){
    this.name = name;
}
Animal.prototype.bar = function(words){
    console.log(`${this.name} bar with ${words}`);
}

var aSnake = new Animal('snake');
prettyPrint(aSnake, "This is a snake");


var Dog = function(name, tail){
    // 1. 调用父构造函数，绑定this
    Animal.call(this, name);
    this.tail = tail;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.waggingTail = function(){
    console.log(`Wagging ${this.tail} tail.`);
}

var aDog = new Dog("lighting", "fat");
prettyPrint(aDog , "This is a dog");
aDog.waggingTail();