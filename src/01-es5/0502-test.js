"use strict";

var isAFunction = Object instanceof Function;
console.log(`Object is a Instance of Function is ${isAFunction}`);

var a = {
  print: function (name) {
    console.log("hello " + name);
  },
};

var b = Object.create(a);

console.log(`${Object.getPrototypeOf(a) === Object.prototype}`);
console.log(`${Object.getPrototypeOf(b) === a}`);
console.log(`${b instanceof Object}`);
a.print("a");
b.print("b");

console.log("--==================================================");
var A = function (id) {
  this.id = id;
  this.print = function () {
    console.log(`XXXXXX ${this.id}`);
  };
};

A.prototype.sayHi = function () {
  console.log(`Hi, my id is ${this.id}`);
};

var B = Object.create(A);

B.prototype = Object.create(A.prototype);

console.log(`${Object.getPrototypeOf(A) === Function.prototype}`);
console.log(`${Object.getPrototypeOf(B) === A}`);
console.log(`${B instanceof Object}`);
console.log(`${B instanceof Function}`);
console.log(`typeof A is ${typeof A}`);
console.log(`typeof B is ${typeof B}`);

var a100 = new A(100);
a100.sayHi();
a100.print();

// Object.setPrototypeOf(B, Function.prototype);
console.log(`${Object.getPrototypeOf(B) === Function.prototype}`);
console.log(`After setPrototypeOf, the typeof B is ${typeof B}`);
console.log(
  `After setPrototypeOf, instance of Function of B is ${B instanceof Function}`,
);
// the following code still not work
// var b100 = new B(100);
// b100.sayHi();

console.log("--==================================================");

function doSomething(){}
console.log( JSON.stringify(doSomething.prototype, null, 2));