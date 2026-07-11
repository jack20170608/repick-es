# JavaScript 生成器完全指南

> 生成器（Generator）是 ES6 引入的一种可暂停、可恢复的函数执行模型，为异步编程带来了全新的范式。

## 目录

1. [什么是生成器](#什么是生成器)
2. [基本语法](#基本语法)
3. [核心概念](#核心概念)
4. [实际用途与场景](#实际用途与场景)
5. [高级用法](#高级用法)
6. [与异步编程的结合](#与异步编程的结合)

---

## 什么是生成器

生成器是一种**可暂停可恢复**的函数。与普通函数不同，生成器在执行过程中可以在任意位置暂停，并且可以**多次yield值**，而不是像普通函数那样一次性返回。

```
普通函数：     开始 → 执行 → 结束（只返回一次）
生成器函数：   开始 → yield → 暂停 → 恢复 → yield → 暂停 → 结束（可返回多次）
```

### 生成器的核心能力

| 能力 | 说明 |
|------|------|
| **暂停执行** | 遇到 `yield` 时暂停函数执行 |
| **恢复执行** | 调用 `.next()` 方法从暂停处继续 |
| **双向通信** | 可以传入值，也可以向外传递值 |
| **状态保持** | 局部变量在暂停期间保留 |

---

## 基本语法

### 1. 定义生成器函数

```javascript
// 使用 function* 语法
function* myGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

// 箭头函数不能用于生成器
// const gen = () => {}  // ❌ 错误
```

### 2. 创建生成器对象

```javascript
const gen = myGenerator();

// gen 是一个迭代器对象
console.log(gen[Symbol.iterator]()); // gen 本身
```

### 3. 遍历生成器

```javascript
// 方式一：手动调用 next()
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 方式二：使用 for...of
const gen2 = myGenerator();
for (const value of gen2) {
  console.log(value); // 1, 2, 3
}

// 方式三：使用扩展运算符
const values = [...myGenerator()];
console.log(values); // [1, 2, 3]
```

---

## 核心概念

### 1. yield 关键字

`yield` 是生成器的核心，它有两个作用：
- **暂停**函数执行
- **产出**一个值

```javascript
function* simpleGenerator() {
  console.log('开始执行');
  
  const a = yield 1;
  console.log('收到传入值:', a);
  
  const b = yield 2;
  console.log('收到传入值:', b);
  
  yield 3;
}

const gen = simpleGenerator();

console.log(gen.next());     // { value: 1, done: false }
console.log(gen.next('传A')); // { value: 2, done: false }
console.log(gen.next('传B')); // { value: 3, done: false }
console.log(gen.next());     // { value: undefined, done: true }
```

**执行流程：**

```
.next() 第1次  →  开始执行 → yield 1 → 暂停 → 返回 { value: 1 }
.next() 第2次  →  恢复执行，a = '传A' → yield 2 → 暂停 → 返回 { value: 2 }
.next() 第3次  →  恢复执行，b = '传B' → yield 3 → 暂停 → 返回 { value: 3 }
.next() 第4次  →  恢复执行 → 结束 → 返回 { value: undefined, done: true }
```

### 2. next() 方法

`next()` 方法用于**恢复**生成器的执行。

```javascript
function* demo() {
  yield 1;
}

const gen = demo();

// 基础用法：.next() 不传参数
gen.next(); // { value: 1, done: false }

// 传值用法：.next(value) 传递值给 yield
function* withValue() {
  const result = yield '请给我值';
  console.log('收到的值:', result);
}

const gen2 = withValue();
gen2.next();              // { value: '请给我值', done: false }
gen2.next('Hello');       // 打印 'Hello'，{ value: undefined, done: true }
```

### 3. done 属性

`done: true` 表示生成器已经**执行完毕**，后续调用 `.next()` 不会再产出值。

```javascript
function* numbers() {
  yield 1;
  yield 2;
}

const gen = numbers();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: undefined, done: true }

// 注意：done: true 不代表 value 一定为 undefined
function* withReturn() {
  yield 1;
  return '结束';
}

const gen2 = withReturn();
gen2.next(); // { value: 1, done: false }
gen2.next(); // { value: '结束', done: true }  ← 最后一次才有值
```

### 4. throw() 方法

在生成器内部抛出错误。

```javascript
function* errorGen() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    console.log('捕获到错误:', e.message);
    yield 10;  // 可以在错误处理后继续
  }
}

const gen = errorGen();
gen.next();                    // { value: 1, done: false }
gen.throw(new Error('出错了')); // 打印 '捕获到错误: 出错了'，{ value: 10, done: false }
gen.next();                    // { value: undefined, done: true }
```

### 5. return() 方法

立即终止生成器，并可以设置返回值。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();

g.next();           // { value: 1, done: false }
g.return('终止');   // { value: '终止', done: true }
g.next();           // { value: undefined, done: true }  ← 永远结束
```

#### return() 的实际用途

**用途一：提前终止，避免无限生成器泄漏**

```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
// 只要前5个
for (let i = 0; i < 5; i++) {
  console.log(fib.next().value);
}
fib.return('已完成'); // 显式终止，避免无限生成器泄漏
```

**用途二：触发 finally 清理资源**

```javascript
function* longRunningTask() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    // return() 会触发 finally 块
    console.log('清理资源...');
  }
}

const task = longRunningTask();
task.next();           // { value: 1, done: false }
task.return('取消');   // 打印 '清理资源...'，返回 { value: '取消', done: true }
```

**用途三：实现可取消的迭代**

```javascript
function* processItems(items) {
  for (const item of items) {
    // 当 return 被调用时，可以在这里检查 done 状态
    const result = yield item * 2;
    if (result === 'STOP') {
      return 'canceled';
    }
  }
  return 'completed';
}

const process = processItems([1, 2, 3, 4, 5]);
process.next();           // 处理 1
process.next();           // 处理 2
process.return('STOP');   // 提前终止，返回 { value: 'STOP', done: true }
```

#### 三者对比

| 方法 | 作用 |
|------|------|
| `yield value` | 暂停并产出值，可恢复 |
| `throw(error)` | 注入错误，可捕获后继续 |
| `return(value)` | 永久终止，返回指定值 |

---

## 实际用途与场景

### 场景一：惰性计算 (Lazy Evaluation)

生成器按需计算，**节省内存**，适合处理大数据或无限序列。

```javascript
// 生成斐波那契数列（无限序列）
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// 只取前10个，不需要预先计算所有值
const fib = fibonacci();
const first10 = [];
for (let i = 0; i < 10; i++) {
  first10.push(fib.next().value);
}
console.log(first10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// 或者用 take 工具函数
function take(n, generator) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const { value, done } = generator.next();
    if (done) break;
    result.push(value);
  }
  return result;
}

console.log(take(5, fibonacci())); // [0, 1, 1, 2, 3]
```

**优势对比：**
```javascript
// 普通函数：一次性计算全部（占用大量内存）
function fibArray(n) {
  const arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr.push(arr[i-1] + arr[i-2]);
  }
  return arr;
}

// 生成器：按需计算（内存友好）
function* fibGen(n) {
  let [a, b] = [0, 1];
  for (let i = 0; i < n; i++) {
    yield a;
    [a, b] = [b, a + b];
  }
}
```

### 场景二：遍历非标准数据结构

生成器可以自定义遍历逻辑，遍历任意数据结构。

```javascript
// 手动实现一个树结构的遍历生成器
class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

function* preOrderTraversal(node) {
  if (!node) return;
  yield node.val;
  for (const child of node.children) {
    yield* preOrderTraversal(child);  // yield* 委托给子生成器
  }
}

// 构建一个简单的树
const tree = new TreeNode('root', [
  new TreeNode('a', [
    new TreeNode('a1'),
    new TreeNode('a2')
  ]),
  new TreeNode('b', [
    new TreeNode('b1'),
    new TreeNode('b2')
  ]),
  new TreeNode('c')
]);

// 遍历结果: root → a → a1 → a2 → b → b1 → b2 → c
for (const val of preOrderTraversal(tree)) {
  console.log(val);
}
```

### 场景三：实现迭代器协议

任何实现了 `[Symbol.iterator]` 的对象都可用 `for...of` 遍历。

```javascript
// 为自定义集合实现可迭代协议
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  
  // 使得 Range 可迭代
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  }
}

const range = new Range(1, 5);
console.log([...range]);        // [1, 2, 3, 4, 5]
for (const num of range) {
  console.log(num);            // 1, 2, 3, 4, 5
}
```

### 场景四：状态机

生成器天然适合实现状态机，每 `yield` 代表一个状态转换。

```javascript
// 简单的令牌桶限流器
function* tokenBucket(maxTokens, refillRate) {
  let tokens = maxTokens;
  
  while (true) {
    // 消耗一个令牌
    if (tokens > 0) {
      tokens--;
      yield { allowed: true, remaining: tokens };
    } else {
      yield { allowed: false, remaining: 0 };
    }
    
    // 模拟令牌补充
    tokens = Math.min(maxTokens, tokens + refillRate);
  }
}

const limiter = tokenBucket(3, 1); // 最多3个令牌，每秒补充1个

// 模拟请求
for (let i = 0; i < 10; i++) {
  const result = limiter.next().value;
  console.log(`请求${i + 1}:`, result.allowed ? '通过' : '拒绝', 
    `(剩余: ${result.remaining})`);
}
```

### 场景五：异步流程控制（原始方案）

在 `async/await` 出现之前，生成器是处理异步操作的主要方式。

```javascript
// 模拟异步操作
const fetchUser = (id) => new Promise(r => 
  setTimeout(() => r({ id, name: `User${id}` }), 100)
);

const fetchPosts = (userId) => new Promise(r => 
  setTimeout(() => r([`Post1 of ${userId}`, `Post2 of ${userId}`]), 100)
);

// 使用生成器实现类似 async/await 的效果
function* asyncFlow() {
  console.log('开始...');
  
  const user = yield fetchUser(1);
  console.log('获取到用户:', user);
  
  const posts = yield fetchPosts(user.id);
  console.log('获取到帖子:', posts);
  
  console.log('完成!');
}

// 运行器：将生成器转换为 Promise
function runGenerator(generator) {
  const gen = generator();
  
  function step(result) {
    if (result.done) return result.value;
    
    // 如果 yield 的是一个 Promise，等待它完成
    return Promise.resolve(result.value).then(
      value => step(gen.next(value)),
      error => gen.throw(error)
    );
  }
  
  return step(gen.next());
}

runGenerator(asyncFlow);
```

### 场景六：协程与并发

通过生成器模拟协程，实现协作者之间的协作。

```javascript
// 调度器：管理多个协程的执行
function* scheduler() {
  const tasks = [];
  
  return {
    add(gen) {
      tasks.push(gen);
      return () => {
        const g = gen();
        tasks.push(g);
        g.next(); // 启动
      };
    },
    run() {
      const results = [];
      for (const task of tasks) {
        const result = task.next();
        if (!result.done) results.push(result.value);
      }
      return results;
    }
  };
}

// 示例：两个任务的协作
function* taskA() {
  yield 'A1';
  yield 'A2';
  yield 'A3';
}

function* taskB() {
  yield 'B1';
  yield 'B2';
}

const scheduled = scheduler();
scheduled.add(taskA);
scheduled.add(taskB);

console.log(scheduled.run()); // ['A1', 'B1']
console.log(scheduled.run()); // ['A2', 'B2']
console.log(scheduled.run()); // ['A3']
console.log(scheduled.run()); // []
```

---

## 高级用法

### 1. yield* 委托

`yield*` 可以委托给另一个生成器或可迭代对象。

```javascript
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield* gen1();  // 委托给 gen1
  yield 3;
  yield* [4, 5]; // 委托给数组
}

console.log([...gen2()]); // [1, 2, 3, 4, 5]
```

### 2. 生成器作为数据流管道

```javascript
// 数据流处理管道
function* map(fn, iterable) {
  for (const item of iterable) {
    yield fn(item);
  }
}

function* filter(predicate, iterable) {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* take(n, iterable) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) break;
    yield item;
  }
}

// 使用管道
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pipeline = function*() {
  yield* take(3, filter(x => x % 2 === 0, map(x => x * 2, numbers)));
}();

console.log([...pipeline]); // [4, 6, 8] ← 取偶数 × 2 的前3个
```

### 3. 生成器组合工具

```javascript
// 创建可取消的生成器
function cancellable(generator, signal) {
  return {
    [Symbol.iterator]() {
      const gen = generator();
      return {
        next(arg) {
          if (signal?.aborted) {
            return { done: true, value: undefined };
          }
          return gen.next(arg);
        },
        throw(err) {
          return gen.throw(err);
        },
        return(value) {
          return gen.return(value);
        }
      };
    }
  };
}

// 使用示例
const controller = new AbortController();
const signal = controller.signal;

const gen = cancellable(function*() {
  for (let i = 0; i < 10; i++) {
    yield i;
    console.log('yielded:', i);
  }
}, signal);

for (const value of gen) {
  if (value > 3) {
    controller.abort(); // 取消生成器
    break;
  }
}
```

---

## 与异步编程的结合

### async/awit 的本质

`async/await` 实际上是生成器的语法糖，底层实现基于 Promises。

```javascript
// async 函数
async function fetchData() {
  const data = await fetch('/api/data');
  return data.json();
}

// 等价的生成器写法
function* fetchDataGenerator() {
  const data = yield fetch('/api/data');
  return data.json();
}

// 需要手动实现运行器（现在由 JS 引擎自动处理）
```

### 实际应用建议

| 场景 | 推荐方案 |
|------|----------|
| 简单的异步流程 | `async/await` |
| 需要暂停/恢复的迭代器 | 生成器 |
| 处理无限数据流 | 生成器 |
| 状态机 | 生成器 |
| 复杂的异步流程控制 | 生成器 + 运行器 |

---

## 总结

生成器函数是 JavaScript 中一个强大且独特的特性：

1. **可暂停、可恢复**的执行模型
2. **惰性计算**能力，适合处理大数据和无限序列
3. **自定义迭代**行为，简化数据结构遍历
4. **状态机**实现的天然选择
5. **异步编程**的重要基础（async/await 的前身）

虽然现代开发中 `async/await` 更常用，但生成器在特定场景下仍然具有不可替代的价值。

---

> 📚 延伸阅读：[MDN 迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols) | [MDN 生成器函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)