var now = new Date();


console.log(`now is ${now.toUTCString()}`);
console.log(`now is ${now.toLocaleString()}`);
console.log(`now is ${now.toString()}`);

console.log(`now UTC hour is ${now.getUTCHours()}`)