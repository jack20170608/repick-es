# typeof vs instanceof 区别指南

## 快速对比

| 特性 | typeof | instanceof |
|------|--------|-------------|
| 用途 | 检测**原始类型** | 检测**原型链** |
| 返回值 | 字符串 (`'number'`, `'string'` 等) | 布尔值 (`true`/`false`) |
| 适用场景 | 基础类型判断 | 对象继承关系 |

---

## 一、typeof

### 1.1 工作原理

`typeof` 检测值的**原始类型**，返回类型字符串。

### 1.2 返回值一览

```javascript
// 原始类型
typeof 123           // → 'number'
typeof 'hello'       // → 'string'
typeof true          // → 'boolean'
typeof undefined     → 'undefined'
typeof Symbol('s')   → 'symbol'
typeof 123n          → 'bigint'

// 对象类型
typeof {}            → 'object'
typeof []            → 'object'
typeof function(){}  → 'function'
typeof null          → 'object'  (历史 bug)

// 特殊：ES6+ 类型
typeof class {}      → 'function'
typeof () => {}      → 'function'
```

### 1.3 常见用途

```javascript
// 检查未定义变量（安全）
if (typeof maybeUndefined === 'undefined') {
  console.log('变量未定义');
}

// 检查函数
if (typeof callback === 'function') {
  callback();
}

// 检查原始类型
function isNumber(val) {
  return typeof val === 'number';
}
```

### 1.4 注意事项

```javascript
// ⚠️ 历史遗留问题
typeof null  // → 'object'

// ⚠️ 数组也是 object
typeof []    // → 'object'
typeof {}    // → 'object'
```

---

## 二、instanceof

### 2.1 工作原理

`instanceof` 检查**原型链**中是否存在某个构造函数的 `prototype`。

```javascript
obj instanceof Constructor
// 等价于：
// Constructor.prototype 是否在 obj 的原型链上
```

### 2.2 检测原型链

```javascript
function Animal(name) {
  this.name = name;
}

function Dog(name) {
  this.name = name;
}

// 原型链继承
Dog.prototype = Object.create(Animal.prototype);

const dog = new Dog('旺财');

dog instanceof Dog      // true  (dog.__proto__ = Dog.prototype)
dog instanceof Animal   // true  (Animal.prototype 在原型链上)
dog instanceof Object   // true  (Object.prototype 在原型链上)
```

### 2.3 图解

```
┌─────────────────────────────────────────────────────────────┐
│                      dog 实例                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ name: "旺财"                                          │  │
│  │ __proto__ → Dog.prototype                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
        dog instanceof Dog ?  Dog.prototype 在这里 → ✓ true
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Dog.prototype                            │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
        dog instanceof Animal ?  Animal.prototype 在这里 → ✓ true
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Animal.prototype                          │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 常见用途

```javascript
// 检查数组
[] instanceof Array           // → true

// 检查日期
new Date() instanceof Date    // → true

// 检查正则
/regex/ instanceof RegExp     // → true

// 检查自定义类型
dog instanceof Animal         // → true
```

---

## 三、核心区别

### 3.1 对比示例

```javascript
const arr = [];

// typeof：检查类型
typeof arr         // → 'object'

// instanceof：检查原型链
arr instanceof Array    // → true
arr instanceof Object   // → true (Array 继承自 Object)
```

### 3.2 原型链 vs 类型

| 值 | typeof | instanceof |
|----|--------|-------------|
| `function(){}` | `'function'` | `instanceof Function` → true |
| `{}` | `'object'` | `instanceof Object` → true |
| `[]` | `'object'` | `instanceof Array` → true |
| 普通对象 | `'object'` | 检查原型链 |

### 3.3 非函数对象特殊情况

```javascript
const obj = Object.create(A);

obj instanceof Function    // → true!
// 因为 obj.__proto__ = A，A.__proto__ = Function.prototype

typeof obj                 // → 'object'（正确）
```

⚠️ **注意**：`instanceof Function` 是 true 不代表它是函数！

---

## 四、实战选择

### 4.1 何时用 typeof？

```javascript
// ✓ 检查原始类型
typeof 'str'   === 'string'
typeof 123     === 'number'
typeof true    === 'boolean'
typeof undefined

// ✓ 检查函数
if (typeof onClick === 'function') {
  onClick();
}

// ✓ 安全检查未定义变量
if (typeof window.maybeExist !== 'undefined') {
  // 变量可能存在
}
```

### 4.2 何时用 instanceof？

```javascript
// ✓ 检查数组
if (value instanceof Array) {
  value.forEach(item => console.log(item));
}

// ✓ 检查特定类型
if (error instanceof TypeError) {
  console.error('类型错误:', error.message);
}

// ✓ 检查继承关系
if (dog instanceof Animal) {
  dog.speak();  // 确认有 Animal 的方法
}
```

### 4.3 不建议的用法

```javascript
// ✗ 用 typeof 检查数组
typeof [] === 'array'  // false！typeof 无法区分数组和对象

// ✗ 用 instanceof 检查原始类型
123 instanceof Number  // false（原始类型不是对象）
```

---

## 五、通用类型检测方案

由于 `typeof` 和 `instanceof` 都有局限，实际项目中常用组合：

### 5.1 检测数组

```javascript
// 方案1：instanceof
[] instanceof Array  // true

// 方案2：Array.isArray (推荐)
Array.isArray([])    // true

// 方案3：Object.prototype.toString
Object.prototype.toString.call([])  // '[object Array]'
```

### 5.2 检测 null

```javascript
// 只能用 ===，没有其他办法
value === null
```

### 5.3 检测函数

```javascript
// typeof 是最简单的
typeof func === 'function'
```

### 5.4 检测日期

```javascript
value instanceof Date
// 或
Object.prototype.toString.call(value) === '[object Date]'
```

---

## 六、总结

| 判断场景 | 推荐方式 |
|----------|----------|
| 原始类型 (`string`, `number`, `boolean`) | `typeof` |
| 是否为函数 | `typeof` |
| 是否为数组 | `Array.isArray()` |
| 是否为对象且有特定原型 | `instanceof` |
| 继承关系检查 | `instanceof` |
| 跨 iframe/窗口的对象 | 用 `Array.isArray()` 或 `Object.prototype.toString` |

**一句话**：`typeof` 看"是什么类型"，`instanceof` 看"继承自谁"。