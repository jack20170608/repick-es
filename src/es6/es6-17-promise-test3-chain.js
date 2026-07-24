//this is a Promise that return a new Promise object
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
      console.log("P1 is running............");
      resolve(new Promise((resolve, reject) => {
        console.log("P11 is running...........");
        setTimeout(() => {
           resolve("P11 is good.")
        }, 500);
        console.log("P11 finished............");
      }));
      console.log("P1 finished...........")
  }, 500);
});

//  Promise 的**自动展开（flattening）**机制，value是 string而不是Promise
p1.then(value => {
  console.log(`${typeof value}`);
  console.log(`${value}`);
}).then(value => {
  console.log(`${value}`);
  return "aaaaa";
}).then(value => {
  console.log(`${value}`);
  return "bbbbb";
}).then(value => {
  console.log(`${value}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("ccccc");
    }, 500);
  });
}).then(value => {
  console.log(`${value}`);
  return "ddddd";
});


