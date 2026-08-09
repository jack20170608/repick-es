const message:String = 'Hello World!!';
console.log(message);

const firstName:string = 'jack';
console.log(`Hi,${firstName}`);

console.log(`typeof message is ${typeof message}`);
console.log(`typeof firstName is ${typeof firstName}`);


type FullName = { firstName: String, lastName : String};

type Person = {
  age : Number,
  name: FullName
}

const p1: Person = {
  age : 100,
  name : {
    firstName: 'petter'
    ,lastName : 'man'
  }
};

console.log(`${p1}`);
