function RangeIterator(start = 0, stop = Infinity, step = 1) {
  let current = start;
  return {
    [Symbol.iterator]: function () {
      return {
        next: function () {
          let value = current;
          if (current < stop) {
            current += step;
            return { done: false, value: value }
          } else {
            return { done: true, value: undefined }
          }
        }
      }
    }
  }
}

const v1 = new RangeIterator(1,3);
for(v of v1){
  console.log(v);
}

console.log("=================================================")
const v2 = new RangeIterator(0,10,2);
for(v of v2){
  console.log(v);
}
