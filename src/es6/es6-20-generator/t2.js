function* gen() {
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

const g = gen();
g.next();
g.throw(1);
