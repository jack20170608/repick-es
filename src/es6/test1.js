function * gen1(name){
  console.log("step1...");
  let result = yield `Hello, ${name}!`;
  console.log("result is", result);
  return result;
}

const s1 = gen1("Alice");
console.log(`s1.next():`, s1.next());
console.log(`s1.next("Jack"):`, s1.next("Jack"));

console.log("-==========================================")

const s2 = (function * gen2(name){
  console.log("step1...");
  let result = yield `Hello, ${name}!`;
  console.log("Step1 result is", result);
  result = yield `Good Morning, ${name}!`;
  console.log("Step2 result is", result);
  return result;
})("Bill");

console.log(`s2.next():`, s2.next("s111111111"));
console.log(`s2.next():`, s2.next("s222222222"));
console.log(`s2.next():`, s2.next("s333333333"));

console.log("-==========================================")

const g1 = (function* gen(x){
  try {
    let y = yield x + 2;
    return y;
  } catch (e){
    console.log(e);
    return e;
  }
})(1);

console.log(`g1.next():`, g1.next());
console.log(`g1.throw():`, g1.throw('出错了'));
