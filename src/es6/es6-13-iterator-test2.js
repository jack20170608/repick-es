function getIt(list) {
  let nextIndex = 0;
  return {
    next: function () {
      return nextIndex < list.length ?
        {
          value: list[nextIndex++], done: false
        } : { value: undefined, done: true }
    }
  }
}

const a1 = ['a','b',1];
const it = getIt(a1);
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log("--===================================");
const it2 = getIt(a1);
let result = it2.next();
while(!result.done){
  console.log(result);
  result = it2.next();
}

console.log("--===================================");
const it3 = getIt(a1);
it3.foreach(v => console.log(v));

