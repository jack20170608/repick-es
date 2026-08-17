# 柯里化：从数学到 JavaScript 的优雅演进

> **前置知识**：建议先阅读 [[01-lambda-calculus-pipeline]] 了解 λ 演算基础

## 一、柯里化的数学起源

### 1.1 多元函数的问题

在数学中，我们经常会遇到多个参数的函数：

$$f(x, y, z) = x + y + z$$

但在 λ 演算的原始定义中，λ 表达式只能接受**一个参数**。这似乎是一个严重的限制。

### 1.2 哥德尔与柯里的洞见

**哈斯克尔·柯里（Haskell Curry）** 提出了一个革命性的思想：

> 任何多元函数都可以转化为一元函数的嵌套调用

数学表达：
$$f(x, y, z) = ((f(x))(y))(z)$$

举例说明。原始函数：
$$add(x, y) = x + y$$

柯里化后：
$$curriedAdd(x)(y) = x + y$$

我们可以这样理解：
- `curriedAdd(3)` 返回一个**新函数**，这个函数接受 `y` 并计算 `3 + y`
- `curriedAdd(3)(4)` = 7

这叫做**柯里化（Currying）**，以数学家哈斯克尔·柯里的名字命名。

### 1.3 形式化定义

设有一个 n 元函数 f：
$$f: (A_1 \times A_2 \times \cdots \times A_n) \rightarrow B$$

柯里化后的类型：
$$curry(f): A_1 \rightarrow (A_2 \rightarrow (\cdots (A_n \rightarrow B)\cdots))$$

对应的反操作称为**反柯里化（Uncurry）**：
$$uncurry(f)(x, y) = f(x)(y)$$

---

## 二、JavaScript 中的柯里化

### 2.1 基础实现

在 ES6 中，我们可以轻松实现柯里化：

```javascript
// 普通的二元函数
function add(a, b) {
  return a + b;
}

// 柯里化版本
function curriedAdd(a) {
  return function(b) {
    return a + b;
  };
}

// 使用箭头函数更简洁
const curriedAdd = a => b => a + b;
```

测试：
```javascript
console.log(add(3, 4));              // 7
console.log(curriedAdd(3)(4));       // 7

// 惰性求值：先填充部分参数
const add5 = curriedAdd(5);
console.log(add5(10));               // 15
console.log(add5(20));               // 25
```

### 2.2 通用的柯里化函数

如何将任意函数柯里化？我们需要编写一个**高阶函数**：

```javascript
function curry(fn) {
  return function curried(...args) {
    // 当接收的参数数量足够时，直接调用原函数
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 否则返回一个等待更多参数的函数
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}
```

使用示例：

```javascript
// 普通函数
function multiply(a, b, c) {
  return a * b * c;
}

// 柯里化版本
const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4));    // 24
console.log(curriedMultiply(2, 3)(4));    // 24
console.log(curriedMultiply(2)(3, 4));    // 24
console.log(curriedMultiply(2, 3, 4));    // 24
```

### 2.3 箭头函数版本

```javascript
const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    return args.length >= arity
      ? fn(...args)
      : (...more) => curried(...args, ...more);
  };
};
```

---

## 三、柯里化的实际应用

### 3.1 函数复合

柯里化是函数复合的基础。来看一个经典例子：

```javascript
// 辅助函数：函数复合
const compose = (...fns) => x => 
  fns.reduceRight((acc, fn) => fn(acc), x);

// 柯里化的工具函数
const prop = curry((key, obj) => obj[key]);
const map = curry((fn, arr) => arr.map(fn));
const filter = curry((fn, arr) => arr.filter(fn));
const add = curry((a, b) => a + b);

// 使用示例：获取用户名称并转为大写
const users = [
  { name: 'alice', age: 25 },
  { name: 'bob', age: 30 },
  { name: 'charlie', age: 35 }
];

const getName = prop('name');
const upperCase = s => s.toUpperCase();

// 不用柯里化
const result1 = users.map(u => u.name.toUpperCase());

// 用柯里化 + 函数复合
const getUpperNames = compose(
  map(upperCase),
  map(getName)
);
const result2 = getUpperNames(users);

console.log(result2);  // ['ALICE', 'BOB', 'CHARLIE']
```

### 3.2 延迟执行

柯里化可以实现函数的延迟执行：

```javascript
const lazyAdd = curry((a, b) => {
  console.log('计算中...');
  return a + b;
});

const add10 = lazyAdd(10);  // 不打印 "计算中..."
console.log(add10(5));      // 打印 "计算中..."，返回 15
console.log(add10(8));      // 再次打印 "计算中..."，返回 18
```

### 3.3 事件处理

在事件处理中，柯里化可以预配置处理器：

```javascript
const handleClick = curry((message, event) => {
  console.log(message, event.target);
});

// 预配置不同的事件处理器
const handleSave = handleClick('保存按钮被点击：');
const handleDelete = handleClick('删除按钮被点击：');
const handleEdit = handleClick('编辑按钮被点击：');

// 使用
// button.addEventListener('click', handleSave);
```

### 3.4 参数复用（Point-Free 风格）

```javascript
const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    return args.length >= arity
      ? fn(...args)
      : (...more) => curried(...args, ...more);
  };
};

// 柯里化数组方法
const map = curry((fn, arr) => arr.map(fn));
const filter = curry((fn, arr) => arr.filter(fn));
const reduce = curry((fn, init, arr) => arr.reduce(fn, init));
const get = curry((key, obj) => obj[key]);
const eq = curry((a, b) => a === b);

// Point-free 风格的数据转换
const users = [
  { id: 1, name: 'Alice', score: 85 },
  { id: 2, name: 'Bob', score: 72 },
  { id: 3, name: 'Charlie', score: 90 }
];

// 提取分数大于80的用户名称
const getHighScorers = compose(
  map(get('name')),
  filter(compose(
    gte(80),
    get('score')
  ))
);

console.log(getHighScorers(users));  // ['Alice', 'Charlie']
```

---

## 四、柯里化与偏函数

这两个概念经常被混淆，但它们不同：

| 概念 | 定义 | 示例 |
|------|------|------|
| **柯里化** | 将多元函数转换为一元函数链 | `f(x)(y)(z)` |
| **偏函数** | 预设部分参数，返回剩余参数的函数 | `partial(f, x)(y, z)` |

```javascript
// 柯里化：固定第一个参数
const curriedAdd = a => b => a + b;
const add5 = curriedAdd(5);

// 偏函数：固定任意位置的参数
function partial(fn, ...args) {
  return fn.bind(null, ...args);
}

const add5Partial = partial(add, 5);
console.log(add5Partial(10));  // 15
```

---

## 五、实战：用柯里化实现日志系统

```javascript
// 柯里化的日志记录器
const createLogger = curry((level, tag, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] [${tag}] ${message}`);
});

const debug = createLogger('DEBUG');
const info = createLogger('INFO');
const error = createLogger('ERROR');

// 预配置不同模块的日志器
const logAuth = debug('Auth');
const logApi = debug('API');
const logDb = debug('Database');

logAuth('User login attempt');       // [DEBUG] [Auth] User login attempt
logApi('GET /api/users');            // [DEBUG] [API] GET /api/users
logDb('Query executed in 5ms');      // [DEBUG] [Database] Query executed in 5ms
```

---

## 六、总结

| 维度 | 说明 |
|------|------|
| **数学起源** | λ 演算中处理多元函数的核心技术 |
| **核心思想** | 将接受多个参数的函数转换为接受单个参数的函数链 |
| **JavaScript 实现** | 通过闭包和箭头函数轻松实现 |
| **应用场景** | 函数复合、延迟执行、事件处理、Point-free 编程 |
| **与偏函数的区别** | 柯里化是固定的参数顺序；偏函数可以固定任意参数 |

柯里化不仅是一个数学概念，更是函数式编程的核心支柱。掌握它，你将能够写出更加优雅、简洁且可组合的代码。

---

## 参考资料

- [Lambda calculus - Wikipedia](https://en.wikipedia.org/wiki/Lambda_calculus)
- [Haskell Curry - Wikipedia](https://en.wikipedia.org/wiki/Haskell_Curry)
- [JavaScript Functional Programming: Currying](https://www.sitepoint.com/currying-in-functional-javascript/)