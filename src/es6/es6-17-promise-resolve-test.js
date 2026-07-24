const p1 = new Promise((resolve, reject) => {
    console.log(`${new Date().toISOString()}, running....`);

    setTimeout(() => {
        console.log(`${new Date().toISOString()}, Before resolve ....`);
        resolve("hahahaha");
        console.log(`${new Date().toISOString()}, After resolve ....`);
    }, 1000);
    console.log(`${new Date().toISOString()}, after timeout ....`);
});

const p11 = p1.then((value) => {
    console.log(`${new Date().toISOString()}, In the 1st then, value=${value}.`);
});

const p12 = p1.then((value) => {
    console.log(`${new Date().toISOString()}, In the 2nd then, value=${value}.`);
});

console.log(p11.toString());
console.log(p12.toString());


console.log(`p1==p11 is ${p1 === p11}`);
console.log(`p1==p12 is ${p1 === p12}`);
console.log(`p11==p12 is ${p11 === p12}`);

console.log(`${new Date().toISOString()}, Finished ....`);



