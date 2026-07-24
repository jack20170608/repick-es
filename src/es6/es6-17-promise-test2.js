const p1 = new Promise((resolve, reject) => {
    console.log(`${new Date().toISOString()}, running....`);

    setTimeout(() => {
        console.log(`${new Date().toISOString()}, Before resolve ....`);
        resolve("hahahaha");
        console.log(`${new Date().toISOString()}, After resolve ....`);
    }, 1000);
    console.log(`${new Date().toISOString()}, after timeout ....`);
});

p1.then((value) => {
    console.log(`${new Date().toISOString()}, In the 1st then, value=${value}.`);
});

p1.then((value) => {
    console.log(`${new Date().toISOString()}, In the 2nd then, value=${value}.`);
});


console.log(`${new Date().toISOString()}, Finished ....`);


