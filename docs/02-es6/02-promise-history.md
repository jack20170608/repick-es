# Promise 发展历史

## 回调地狱时代（ES5 以前）

```javascript
fetchData(function(a) {
  processA(a, function(b) {
    processB(b, function(c) {
      processC(c, function(d) {
        // 地狱...
      });
    });
  });
});
```

**问题**：嵌套深、难维护、错误处理分散

---

## Promise/A+ 规范诞生（2008-2013）

- **2008**: CommonJS 社区提出 Promise/A 规范
- **2011**: jQuery 提出 `$.Deferred`
- **2012**: **Promise/A+ 规范**正式发布（社区共识）

---

## ES6 官方支持（2015）

```javascript
// ES6 原生 Promise
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

同时诞生了 **async/await** 的基础

---

## async/await（ES2017）

```javascript
// 更优雅的写法
async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

---

## Promise 方法扩展

| 方法 | 简介 |
|-----|------|
| `Promise.all()` | 并行执行，全部完成 |
| `Promise.race()` | 谁先完成用谁 |
| `Promise.allSettled()` | 等全部完成（不论成功/失败）ES2020 |
| `Promise.any()` | 任意一个成功即可 ES2021 |

---

## 现状

- 现代 JS **必备**技能
- 几乎所有新 API 都返回 Promise（fetch、File System Access API 等）
- async/await 成为主流写法

---

# Promise 详解

## 什么是 Promise？

**Promise**（承诺）是 JavaScript 中处理异步操作的对象。

> 它代表一个异步操作的**最终结果**——要么成功，要么失败。

### 三种状态

```
┌─────────────┐
│   pending   │  ← 进行中（初始状态）
└──────┬──────┘
       │ resolve 或 reject
       ▼
┌─────────────┐     ┌─────────────┐
│ fulfilled  │     │   rejected  │
│   (已成功)  │     │   (已失败)  │
└─────────────┘     └─────────────┘
```

**注意**：一旦状态改变（fulfilled 或 rejected），就**不能再改变**了。

---

## 手动创建 Promise

### 基本结构

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 成功 */) {
    resolve(value);  // 标记为成功
  } else {
    reject(error);   // 标记为失败
  }
});
```

- `resolve(value)` — 将 Promise 状态改为 **fulfilled**，并传递值
- `reject(error)` — 将 Promise 状态改为 **rejected**，并传递错误

### 示例：手动封装定时器

```javascript
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error('时间不能为负'));
      return;
    }
    setTimeout(() => {
      resolve(`等待了 ${ms}ms`);
    }, ms);
  });
}

// 使用
delay(1000).then(result => {
  console.log(result); // "等待了 1000ms"
}).catch(err => {
  console.error(err);
});

// 错误情况
delay(-100).catch(err => {
  console.error(err.message); // "时间不能为负"
});
```

### 示例：手动封装异步读取文件

```javascript
const fs = require('fs');

function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// 使用
readFilePromise('./data.txt')
  .then(content => console.log(content))
  .catch(err => console.error('读取失败:', err));
```

### 示例：模拟网络请求

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      if (url.includes('error')) {
        reject(new Error('网络错误'));
      } else {
        resolve({ url, data: 'Success!' });
      }
    }, 500);
  });
}

// 测试成功
fetchData('/api/user')
  .then(res => console.log(res)) // { url: '/api/user', data: 'Success!' }
  .catch(err => console.error(err));

// 测试失败
fetchData('/api/error')
  .then(res => console.log(res))
  .catch(err => console.error(err.message)); // "网络错误"
```

---

## Promise 实例方法

### .then(onFulfilled, onRejected)

成功时执行 `onFulfilled`，失败时执行 `onRejected`：

```javascript
promise.then(
  value => console.log('成功:', value),
  error => console.error('失败:', error)
);
```

### .catch(onRejected)

只处理错误：

```javascript
promise
  .then(value => console.log(value))
  .catch(error => console.error(error));
```

### .finally(onFinally)

无论成功或失败都执行（常用于清理）：

```javascript
promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
  .finally(() => console.log('完成'));
```

---

## 链式调用

Promise 的精髓在于**返回新的 Promise**，实现链式调用：

```javascript
function step1() {
  return new Promise(resolve => resolve(1));
}
function step2(val) {
  return new Promise(resolve => resolve(val + 1));
}
function step3(val) {
  return new Promise(resolve => resolve(val + 1));
}

step1()
  .then(step2)   // 自动把上一步的结果传给下一步
  .then(step3)
  .then(result => console.log(result)); // 3
```

**原理**：每个 `.then()` 都返回一个新的 Promise，所以可以无限链下去。

---

## Promise 静态方法

### Promise.all(promises)

**全部成功**才成功，有一个失败就失败：

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(values => console.log(values)); // [1, 2, 3]

// 有一个失败
const pFail = Promise.reject('error');
Promise.all([p1, pFail, p3])
  .catch(err => console.error(err)); // "error"
```

### Promise.race(promises)

**谁先完成**用谁（无论成功或失败）：

```javascript
const fast = new Promise(r => setTimeout(() => r('快'), 100));
const slow = new Promise(r => setTimeout(() => r('慢'), 1000));

Promise.race([fast, slow])
  .then(value => console.log(value)); // "快"
```

### Promise.allSettled(promises)

等**全部完成**，不管成功或失败（ES2020）：

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
const p3 = Promise.resolve(3);

Promise.allSettled([p1, p2, p3])
  .then(results => console.log(results));
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]
```

### Promise.any(promises)

**任意一个成功**就成功，全部失败才失败（ES2021）：

```javascript
const p1 = Promise.reject('fail1');
const p2 = Promise.resolve('success');
const p3 = Promise.reject('fail3');

Promise.any([p1, p2, p3])
  .then(value => console.log(value)); // "success"
```

---

## 进阶：Promise.resolve() 和 Promise.reject()

快速创建已 resolved 或 rejected 的 Promise：

```javascript
// 成功
Promise.resolve(42).then(console.log); // 42

// 失败
Promise.reject(new Error('bad')).catch(console.error); // Error: bad

// 常用于"已经是 Promise"的情况下避免嵌套
const maybePromise = getData();
const promise = Promise.resolve(maybePromise); // 确保一定是 Promise
```

---

## 进阶：Promise 穿透

```javascript
Promise.resolve(1)
  .then(Promise.resolve)  // 直接传 Promise 会自动穿透
  .then(console.log);     // 1
```

实际上 `.then()` 会自动处理传入的 Promise：

```javascript
// 这两种写法等价
promise.then(x => Promise.resolve(x))
promise.then(Promise.resolve) // 穿透
```

---

## async/await 语法糖

`async/await` 是 Promise 的**语法糖**，让异步代码看起来像同步代码：

```javascript
// Promise 写法
function getData() {
  return fetch('/api')
    .then(res => res.json())
    .then(data => data);
}

// async/await 写法
async function getData() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}
```

### async 函数的特点

1. **永远返回 Promise**
2. `await` 等待 Promise resolved
3. 可以用 `try/catch` 捕获错误

---

## 对比 Java CompletableFuture

Promise 和 Java 的 `CompletableFuture` 非常相似：

| 特性 | Promise | CompletableFuture |
|-----|---------|-------------------|
| 创建 | `new Promise((resolve, reject) => {})` | `CompletableFuture.supplyAsync()` |
| 成功 | `resolve(value)` | `complete(value)` |
| 失败 | `reject(err)` | `completeExceptionally(err)` |
| 链式 | `.then()` | `.thenApply()` / `.thenCompose()` |
| 组合 | `Promise.all()` | `CompletableFuture.allOf()` |
| 异常 | `.catch()` | `.exceptionally()` |

**核心思想**：把"耗时操作"包装成"未来完成的对象"，用链式调用解决回调地狱。

---

## 总结

- Promise 是**异步操作的容器**，有 pending/fulfilled/rejected 三种状态
- 状态一旦改变**不可逆**
- 手动创建：`new Promise((resolve, reject) => {})`
- 链式调用是 Promise 的核心优势
- async/await 是 Promise 的语法糖（现代主流写法）