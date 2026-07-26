const SPLITER = "================================";
function* g1() {
  console.log("good");
}

console.log(`${SPLITER}`);
const gen1 = g1();
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

var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  var length = a.length;
  for (var i = 0; i < length; i++) {
    var item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (var f of flat(arr)) {
  console.log(f);
}
