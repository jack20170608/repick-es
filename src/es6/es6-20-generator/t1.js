function* gen2() {
  console.log("gen start");
  console.log(yield 'a', yield 100);  // 第二次 next() 调用时才会打印
  console.log('gen end');
}

console.log("111");

const g21 = gen2();
g21.next();
g21.next();
g21.next();
