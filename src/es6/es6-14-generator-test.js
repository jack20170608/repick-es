function* firstGen() {
    yield 1;
    yield 2;
    yield 3;
}
const gen1 = firstGen();

console.log(gen1.next());
console.log(gen1.next());
console.log(gen1.next());
console.log(gen1.next());

function* integerGen() {
    for(let i =0; ; i++){
        yield i;
    }
}

const gen2 = integerGen();
console.log(gen2.next());
console.log(gen2.next());
console.log(gen2.next());
console.log(gen2.next());

function* thirdGen(){
    yield 1;
    yield 2;
    yield 3;
    return 100;
}

const gen3 = thirdGen();
console.log(gen3.next());
console.log(gen3.next());
console.log(gen3.next());
console.log(gen3.next());

console.log("Return quickly");
const gen31 = thirdGen();
console.log(gen31.next());
gen31.return(99);
console.log(gen31.next());