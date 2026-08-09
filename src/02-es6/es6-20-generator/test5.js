function * inner(){
  yield 'jack';
}

function * outer1(){
  yield 'lucy';
  yield inner();
  yield 'bill';
}

const out1 = outer1();

console.log(`${out1.next().value}`)

const out1Val = out1.next().value;
console.log(`${out1Val.next().value}`)
console.log(`${out1.next().value}`)


function* outer2(){
  yield 'lucy';
  yield * inner();
  yield 'bill';
}

const out2 = outer2();
for(let s of out2 ){
  console.log(`${s}`)
}


function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
  console.log("ddddddddddddd")
}

var it = bar();
it.next();
it.next();
it.next();
it.next();
it.next();

