const p1 = new Promise((resolve, reject) => {
    console.log(`${new Date().toISOString()}, running....`);

    setTimeout(() => {
        console.log(`${new Date().toISOString()}, Before resolve ....`);
        reject(new Error("Ah, what's going on? Internal Error."));
        console.log(`${new Date().toISOString()}, After resolve ....`);
    }, 1000);
    console.log(`${new Date().toISOString()}, after timeout ....`);
});

const p11 = p1.then((value) => {
    console.log(`${new Date().toISOString()}, In the 1st then, value=${value}.`);
}).catch(e => {
    console.error(e, `${new Date().toISOString()}, In the 1st catch.`);
});


const p12 = p1.then((value) => {
    console.log(`${new Date().toISOString()}, In the 2nd then, value=${value}.`);
}).catch((e, reason) => {
    console.error(e, `${new Date().toISOString()}, In the 2nd catch.`);
});


console.log(`${new Date().toISOString()}, Finished ....`);



