function f1(m){
  return m * 2;
}

const thunk = function(){
  return x + 5;
}

const x = 10;
console.log(f1(x + 5));


function f2(thunk){
  return thunk() * 2;
}

console.log(f2(thunk));
