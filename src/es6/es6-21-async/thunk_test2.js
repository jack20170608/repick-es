import fs from 'fs';

const foo = './foo.txt';
console.log("--==============================readFileSync=================================")
let content = fs.readFileSync(foo, 'utf8');
console.log(content);

console.log("--==============================readFileWithCallback=================================")
fs.readFile(foo, 'utf8', (err, c) => {
  console.log(c);
})

console.log("--==============================readFileWithChunk=================================")
const Thunk = function (fileName){
  return function (callback) {
    fs.readFile(fileName, 'utf8', callback)
  }
}

Thunk(foo)((err, c) => {
  if (err){
    throw err;
  }
  console.log(c);
})
