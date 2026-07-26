const SPLITER = "================================";
function* g1() {
  console.log("good");
}

console.log(`${SPLITER}`);
const gen1 = g1();
console.log(`[tyoeof g1=${typeof g1}][typeof gen1=${typeof gen1}].`);
console.log(`[typeof gen1.next=]${typeof gen1.next}`)
gen1.next();
gen1.next();
gen1.next();

//==========================================
console.log(`${SPLITER}`);

function* g2() {
  yield 100;
  yield 200;
  return 999;
}

const g2f = g2();
for (let i of [1, 2, 3, 4]) {
  let val = g2f.next();
  console.log(`done=${val.done}, value=${val.value}`);
}
//==========================================
console.log(`${SPLITER}`);
function* demo() {
  // console.log('Hello' + yield); // SyntaxError
  // console.log('Hello' + yield 123); // SyntaxError
  console.log('Hello' + (yield 1)); // OK
  console.log('Hello' + (yield 2)); // OK
}

const demo1 = demo();
for (let i of [1, 2, 3, 4]) {
  let val = demo1.next();
  console.log(`done=${val.done}, value=${val.value}`);
}




//==========================================
console.log(`${SPLITER}`);

const arr = [1, [[2, 3], 4], [5, 6]];

const flat = function* (a) {
  let length = a.length;
  for (let i = 0; i < length; i++) {
    let item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (let f of flat(arr)) {
  console.log(f);
}

//==========================================
console.log(`${SPLITER}`);

function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
console.log(b.next()); // { value:6, done:false }
console.log(b.next(12)); // { value:8, done:false }
console.log(b.next(13)); // { value:42, done:true }



