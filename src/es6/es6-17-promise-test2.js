const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail in p1')), 2000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p1
    .catch(error => console.log(error));

// p2
    // .then(result => console.log(result))
    // .catch(error => console.log(error))