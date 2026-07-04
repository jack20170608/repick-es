# 函数对象：prototype vs __proto__ 深度对比

## 核心区别

| 属性 | 归属 | 含义 | 示例 |
|------|------|------|------|
| `prototype` | **函数独有** | 创建实例时，实例的原型指向这里 | `Person.prototype` |
| `__proto__` | **所有对象都有** | 对象自身的实际原型 | `person.__proto__` |

---

## 一句话解释

```javascript
function Person(name) {
    this.name = name;
}

const p = new Person('Jack');

p.__proto__ === Person.prototype  // true 🎯
```

**执行 `new` 时**：把 实例的 `__proto__` 指向 函数的 `prototype`

---

## 图解关系

```
┌─────────────────────────────────────────────────────────────────┐
│                        Person 函数                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ name: "Person"                                           │  │
│  │ length: 1                                                │  │
│  │ prototype: ──────────────────────→ { constructor: Person }│
│  │ __proto__: ──────────────────────→ Function.prototype    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                              │
                                              │ new 时复制
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       p 实例                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ name: "Jack"                                             │  │
│  │ __proto__: ───────────────────→ Person.prototype         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 详细对比

### 1. 谁有这些属性？

```javascript
// 普通对象
const obj = {};
obj.prototype    // ❌ undefined - 普通对象没有 prototype
obj.__proto__    // ✅ Object.prototype

// 函数对象
function Fn() {}
Fn.prototype     // ✅ { constructor: Fn }
Fn.__proto__     // ✅ Function.prototype
```

### 2. 各自指向什么？

```javascript
function Person(name) {
    this.name = name;
}

// Person.prototype - 函数的原型对象（供实例继承）
Person.prototype              // { constructor: Person }
Person.prototype.constructor // Person 本身

// Person.__proto__ - Person 作为一个对象的原型
Person.__proto__ === Function.prototype  // true
```

### 3. 实例的 __proto__ 指向哪里？

```javascript
const p = new Person('Jack');

// 实例的 __proto__ 指向 构造函数的 prototype
p.__proto__ === Person.prototype           // true
p.__proto__ === Person.prototype.constructor  // false!
p.__proto__.constructor === Person         // true (通过原型链)
```

---

## 完整原型链图

```
                                   ┌─────────────────────────┐
                                   │    Function.prototype   │
                                   │  ┌───────────────────┐  │
                                   │  │ call()            │  │
                                   │  │ apply()           │  │
                                   │  │ bind()            │  │
                                   │  │ constructor       │  │
                                   │  └───────────────────┘  │
                                   │          ▲              │
                                   │          │              │
┌──────────────────────────────────┼──────────┼──────────────┘
│                                  │          │
│  Person (函数)                   │          │ __proto__
│  ┌────────────────────────────┐  │          │
│  │ name: "Person"             │  │          │
│  │ prototype: ──────────┐     │  │          │
│  │ __proto__: ──────────┼─────┘  │          │
│  └──────────────────────│────────┘          │
│                         │                   │
│                         ▼                   │
│  Person.prototype                     │
│  ┌────────────────────────────┐            │
│  │ constructor: Person ←───────┤            │
│  │ __proto__: ────────────────┼────────────┘
│  └────────────────────────────┘
│                                   
│                                   
│  p (实例)                          
│  ┌────────────────────────────┐ 
│  │ name: "Jack"               │ 
│  │ __proto__: ────────────────┘
│  └────────────────────────────┘
```

---

## 实战演练

### Q1: 实例的方法在哪里？

```javascript
function Dog(name) {
    this.name = name;
}

Dog.prototype.bark = function() {
    console.log('汪!');
};

const dog = new Dog('旺财');

// 方法不在实例上，而是在原型上
dog.bark();           // "汪!" - 通过原型链找到的
dog.hasOwnProperty('bark')   // false
dog.__proto__.hasOwnProperty('bark')  // true
```

### Q2: 修改 prototype 会影响实例吗？

```javascript
function Cat(name) {
    this.name = name;
}

const cat = new Cat('Tom');

// ✅ 会影响 - 因为实例的 __proto__ 指向 Cat.prototype
Cat.prototype.say = function() {
    console.log('Meow~');
};

cat.say();  // "Meow~" - 能调用到

// ❌ 不会影响 - 重新赋值是改变指针
Cat.prototype = { meow: function() {} };
cat.say();  // 仍然有效 - 引用的是旧对象
```

### Q3: 函数的 __proto__ 指向哪里？

```javascript
function Person() {}

// 函数也是对象，它的 __proto__ 指向 Function.prototype
Person.__proto__ === Function.prototype  // true

// Function 本身也是一个函数
Function.__proto__ === Function.prototype  // true (自引用)

// Object 也是一个函数
Object.__proto__ === Function.prototype    // true
```

---

## 常见面试题

### Q1: 下面代码输出什么？

```javascript
function A() {}
function B() {}

A.prototype = new B();

const a = new A();
console.log(a.constructor);  // ???
```

**答案**: `B`

**原因**: `A.prototype = new B()` 替换了默认的 prototype，新对象没有 constructor 属性，所以沿原型链找到了 `B.prototype.constructor`。

**修复**:
```javascript
A.prototype = new B();
A.prototype.constructor = A;  // 修复 constructor
```

### Q2: Object.prototype.__proto__ 是什么？

```javascript
Object.prototype.__proto__  // null
```

因为 Object.prototype 是原型链的终点。

### Q3: Function.prototype 是什么类型的对象？

```javascript
typeof Function.prototype  // "function"

// 但它没有 prototype 属性！
Function.prototype.prototype  // undefined

// 它的 __proto__ 指向 Object.prototype
Function.prototype.__proto__ === Object.prototype  // true
```

---

## 总结

| 关系 | 代码 | 说明 |
|------|------|------|
| 实例的原型 | `实例.__proto__ === 函数.prototype` | 核心关系 |
| prototype 的 constructor | `函数.prototype.constructor === 函数` | 默认存在 |
| 函数的原型 | `函数.__proto__ === Function.prototype` | 函数也是对象 |
| 原型链终点 | `Object.prototype.__proto__ === null` | 终点 |

### 记忆口诀

> **prototype 是函数的"模具"，__proto__ 是对象的"血缘"**
> - 函数的 `prototype` 决定了 new 出来的实例像谁
> - 对象的 `__proto__` 记录了它继承自谁