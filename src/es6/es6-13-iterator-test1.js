console.log("--======================================");
const a1 = ["a","b","c", 1, 2, 3];

for(let t in a1){
  console.log(t);
}
console.log("--======================================");
for(let t of a1){
  console.log(t);
}
console.log("--======================================");
a1.forEach(v => console.log(v));

