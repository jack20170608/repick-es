# Thunk 函数详解

## 什么是 Thunk

Thunk（求值策略）是一种**延迟执行**的技术，将"立即执行"变成"先不执行，等会儿再执行"。

```
普通函数调用：
  fn(a, b, c)  →  立即执行，返回结果

Thunk 转换后：
  const thunk = Thunk(fn)  →  返回一个新函数
  thunk(a, b)              →  收集参数，返回新函数
  thunk()(callback)        →  传入剩余参数，才真正执行
```

## Thunk 函数实现

### 基础版

```javascript
const Thunk = function (fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    return function (callback) {
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};
```

### 生产版（thunkify）

```javascript
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
```

## Thunk vs 柯里化

| 特性 | 柯里化 | Thunk |
|------|--------|-------|
| 目的 | 分解参数，部分应用 | 延迟执行，惰性求值 |
| 适用场景 | 函数式编程 | 异步编程 |
| 典型用途 | 组合函数 | 控制求值时机 |

## Thunk 在 Generator 中的应用

### 手动执行

```javascript
import fs from 'fs';
import thunkify from 'thunkify';

const readFileThunk = thunkify(fs.readFile);

const gen = function* () {
  const r1 = yield readFileThunk('./foo.txt');
  console.log(r1.toString());
  const r2 = yield readFileThunk('./bar.txt');
  console.log(r2.toString());
}

const g = gen();
const r1 = g.next();

r1.value(function (err, data) {
  if (err) throw err;
  let r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  })
})
```

### 自动执行（配合 co 库）

```javascript
import co from 'co';

co(function* () {
  const r1 = yield readFileThunk('./foo.txt');
  const r2 = yield readFileThunk('./bar.txt');
  console.log(r1.toString(), r2.toString());
});
```

## 解决的问题

### 1. 回调地狱

```javascript
// 原始写法（回调地狱）
readFile('./foo.txt', (err, data1) => {
  readFile('./bar.txt', (err, data2) => {
    readFile('./baz.txt', (err, data3) => {
      console.log(data1, data2, data3);
    });
  });
});

// Generator 写法（线性可读）
const r1 = yield readFileThunk('./foo.txt');
const r2 = yield readFileThunk('./bar.txt');
const r3 = yield readFileThunk('./baz.txt');
console.log(r1, r2, r3);
```

### 2. 控制求值时机

- 什么时候调用由你决定
- 调用者和执行时机分离

### 3. 防抖保护

thunkify 包装的回调函数，确保只执行一次，防止原函数因 bug 多次调用 callback。

## 总结

Thunk 的核心思想：
- 把**函数 + 参数**变成**一个等待调用的函数对象**
- 延迟执行，控制求值时机
- 配合 Generator 实现异步流程的同步化写法