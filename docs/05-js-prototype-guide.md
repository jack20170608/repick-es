# JavaScript 原型系统完全指南

## 什么是原型？

原型（Prototype）是 JavaScript 实现**继承**的核心机制。每个对象都有一个隐藏的原型属性 (`__proto__`)，通过它可以访问原型对象上的属性和方法。

---

## 一、对象与原型

### 1.1 普通对象

```javascript
const obj = {};
```

```
┌─────────────────────────────────────────────────────────────┐
│                      obj 对象                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ __proto__ ───────────────────────────────────────→    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                      ▲                       │
│                                      │                       │
└──────────────────────────────────────┼───────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │    Object.prototype                 │
                    │  ┌─────────────────────────────┐    │
                    │  │ toString()                  │    │
                    │  │ valueOf()                   │    │
                    │  │ hasOwnProperty()            │    │
                    │  │ constructor → Object        │    │
                    │  └─────────────────────────────┘    │
                    │              ▲                       │
                    │              │                       │
                    └──────────────┼───────────────────────┘
                                   │
                    ┌──────────────┴───────────────────────┐
                    │              null                     │
                    └──────────────────────────────────────┘
```

### 1.2 空原型对象

```javascript
const obj = Object.create(null);
```

```
┌─────────────────────────────────────────────────────────────┐
│                      obj 对象                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ __proto__ → null                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、函数对象 vs 普通对象

### 2.1 主要区别

| 特性 | 普通对象 `{}` | 函数对象 `function(){}` |
|------|---------------|------------------------|
| `prototype` | ❌ 没有 | ✅ 有 |
| `__proto__` | `Object.prototype` | `Function.prototype` |
| 可调用 | ❌ | ✅ `fn()` |
| 可作构造函数 | ❌ | ✅ `new fn()` |

### 2.2 函数对象图解

```javascript
function Person(name) {
  this.name = name;
}
```

```
┌─────────────────────────────────────────────────────────────┐
│                    Person (函数对象)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ name: "Person"                                        │  │
│  │ length: 1                                             │  │
│  │ prototype ───────────────→ ┌───────────────────────┐  │
│  │ __proto__ ───────────────→ │ Function.prototype    │  │
│  └─────────────────────────────┴───────────────────────┘  │
│                                                           │
│                    ┌────────────────────────────────────┐  │
│                    │     Person.prototype               │  │
│                    │  ┌────────────────────────────┐    │  │
│                    │  │ constructor → Person       │    │  │
│                    │  │ __proto__ → Object.prot... │    │  │
│                    │  └────────────────────────────┘    │  │
│                    └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、Function.prototype 和 Object.prototype

### 3.1 它们的关系

```javascript
Object instanceof Function     // true  → Object 是 Function 的实例
Function instanceof Object     // true  → Function 也是 Object 的实例
```

### 3.2 原型链全景图

```
                    ┌─────────────────────────────────────┐
                    │            Object (函数对象)        │
                    │     __proto__ → Function.prototype  │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │       Function.prototype            │
                    │  ┌─────────────────────────────┐    │
                    │  │ call() / apply() / bind()   │    │
                    │  │ __proto__ → Object.prot...  │    │
                    │  │ constructor → Function      │    │
                    │  └─────────────────────────────┘    │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │        Object.prototype             │
                    │  ┌─────────────────────────────┐    │
                    │  │ toString() / valueOf()      │    │
                    │  │ hasOwnProperty()            │    │
                    │  │ constructor → Object        │    │
                    │  └─────────────────────────────┘    │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │               null                  │
                    └─────────────────────────────────────┘
```

---

## 四、继承的实现

### 4.1 原型链继承

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} 发出了声音`);
};

function Dog(name) {
  this.name = name;
}

// 原型链继承：Dog.prototype → Animal.prototype
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} 汪汪汪!`);
};

const dog = new Dog('旺财');
dog.speak();  // "旺财 发出了声音"  (继承自 Animal)
dog.bark();   // "旺财 汪汪汪!"     (自己的方法)
```

### 4.2 图解继承关系

```
┌─────────────────────────────────────────────────────────────┐
│                      dog 实例                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ name: "旺财"                                          │  │
│  │ __proto__ → Dog.prototype                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Dog.prototype                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ bark: function()                                      │  │
│  │ constructor: Dog                                      │  │
│  │ __proto__ → Animal.prototype                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Animal.prototype                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ speak: function()                                     │  │
│  │ constructor: Animal                                   │  │
│  │ __proto__ → Object.prototype                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Object.prototype                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ toString() / valueOf() / hasOwnProperty()            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 五、Object.create() 方法

### 5.1 创建指定原型的对象

```javascript
const person = {
  greeting: function() {
    console.log('你好!');
  }
};

const student = Object.create(person);
student.name = '小明';
student.study = function() {
  console.log('学习中...');
};
```

### 5.2 图解

```
┌─────────────────────────────────────────────────────────────┐
│                      student 实例                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ name: "小明"                                          │  │
│  │ __proto__ → person (性能差，慎用)                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、常用 API

### 6.1 获取原型

```javascript
const obj = {};

// 方法1: __proto__ (不推荐)
obj.__proto__

// 方法2: Object.getPrototypeOf() (推荐)
Object.getPrototypeOf(obj)

// 方法3: constructor.prototype
obj.constructor.prototype
```

### 6.2 设置原型

```javascript
const obj = {};

// 方法1: __proto__ (不推荐)
obj.__proto__ = newParent;

// 方法2: Object.setPrototypeOf() (推荐)
Object.setPrototypeOf(obj, newParent);

// 方法3: Object.create() (推荐，用于创建)
const newObj = Object.create(proto);
```

### 6.3 检查原型关系

```javascript
const obj = {};
const arr = [];

Object.getPrototypeOf(obj) === Object.prototype      // true
Object.getPrototypeOf(arr) === Array.prototype        // true

obj instanceof Object                                 // true
arr instanceof Array                                  // true
arr instanceof Object                                 // true (子类型也是 Object 的实例)
```

---

## 七、总结

### 7.1 核心要点

1. **每个对象都有原型** - 通过 `__proto__` 访问
2. **函数对象有 prototype 属性** - 用于创建实例的原型
3. **原型链顶端是 Object.prototype** - 提供通用方法
4. **Object.prototype 的原型是 null** - 原型链终点
5. **Function.prototype 是所有函数的原型** - 提供 call/apply/bind

### 7.2 原型链速查

| 对象 | 原型 |
|------|------|
| 普通对象 `{}` | `Object.prototype` |
| 函数 `function(){}` | `Function.prototype` |
| 数组 `[]` | `Array.prototype` |
| `Object` | `Function.prototype` |
| `Function` | `Function.prototype` |
| `Array` | `Function.prototype` |
| `Function.prototype` | `Object.prototype` |
| `Object.prototype` | `null` |

### 7.3 为什么这样设计？

JavaScript 采用原型继承而非类继承，主要优点：

- **更灵活** - 可以在运行时动态修改原型
- **更高效** - 属性查找沿原型链进行，无需复制
- **更简洁** - 无需类定义，直接通过对象创建对象
- **更动态** - 原型可以在实例创建后修改

---

## 八、延伸阅读

- [MDN: 继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN: Object.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [MDN: Function.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)