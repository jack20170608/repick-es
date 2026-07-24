class RangeIterator {
  constructor(start = 0, stop = Infinity, step = 1) {
    this.value = start;
    this.stop = stop;
    this.step = step;
  }

  [Symbol.iterator]() { return this; }

  next() {
    let value = this.value;
    if (value < this.stop) {
      this.value += this.step;
      return { done: false, value: value };
    }
    return { done: true, value: undefined };
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(3, 6)) {
  console.log(value); // 3, 4, 5
}
