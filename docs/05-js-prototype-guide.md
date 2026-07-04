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

## 二、__proto__ 和 prototype 的区别

| 属性 | 作用 | 谁有 |
|------|------|------|
| `prototype` | **用作模板** - new 创建实例时，实例的原型指向它 | 只有函数有 |
| `__proto__` | **实际原型** - 对象本身的原型是哪 | 所有对象有 |

### 一句话解释

```javascript
function Person() {}
const p = new Person();

p.__proto__ === Person.prototype  // 实例的原型 = 函数的 prototype
```

**`prototype` 是函数身上的，`__proto__` 是对象身上的。**

`new` 操作会把实例的 `__proto__` 指向函数的 `prototype`。

### 示例

```javascript
// 函数有 prototype
function Dog() {}
Dog.prototype  // → { constructor: Dog }

// 对象有 __proto__
const dog = new Dog();
dog.__proto__  // → Dog.prototype（和上面是同一个对象！）
```

### 2.1 普通对象 vs 函数对象

| 特性 | 普通对象 `{}` | 函数对象 `function(){}` |
|------|---------------|------------------------|
| `prototype` | ❌ 没有 | ✅ 有 |
| `__proto__` | `Object.prototype` | `Function.prototype` |
| 可调用 | ❌ | ✅ `fn()` |
| 可作构造函数 | ❌ | ✅ `new fn()` |

---

## 三、Function.prototype 和 Object.prototype

```
1. 定义函数
   ▼
┌─────────────────────────────────────────┐
│  function Person(name) { this.name..."} │
│  ┌───────────────────────────────────┐  │
│  │ name: "Person"                    │  │
│  │ prototype: ???   ← 自动创建       │  │
│  │ __proto__: Function.prototype     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │
           │ 自动生成
           ▼
┌─────────────────────────────────────────┐
│         Person.prototype                │
│  ┌───────────────────────────────────┐  │
│  │ constructor: Person  ← 自动添加   │  │
│  │ __proto__: Object.prototype       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### 默认 prototype 的属性

| 属性 | 值 |
|------|-----|
| `函数.prototype` | 新建的对象 `{ constructor: 函数 }` |
| `函数.prototype.constructor` | 指向函数自身 |
| `函数.prototype.__proto__` | 指向 `Object.prototype` |

#### 可以手动覆盖

```javascript
function Person(name) {
    this.name = name;
}

// 手动替换 prototype（会丢失默认的 constructor）
Person.prototype = {
    sayHi() { console.log('Hi'); }
};

// 需要手动修复 constructor
Person.prototype.constructor = Person;
```

> **这正是 ES5 继承时需要修复 constructor 的原因！**

```javascript
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;  // 修复丢失的 constructor
```

---

## 四、Function.prototype 和 Object.prototype
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

完整的 ES5 继承需要3步：

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} 发出了声音`);
};

function Dog(name, tail) {
  // 第1步：调用父构造函数，继承属性
  Animal.call(this, name);
  this.tail = tail;
}

// 第2步：继承父的原型方法
Dog.prototype = Object.create(Animal.prototype);

// 第3步：修复 constructor 指向
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} 汪汪汪!`);
};

const dog = new Dog('旺财', '短');
dog.speak();  // "旺财 发出了声音"  (继承自 Animal)
dog.bark();   // "旺财 汪汪汪!"     (自己的方法)
```

#### 核心3行代码详解

| 步骤 | 代码 | 作用 |
|------|------|------|
| 1 | `Animal.call(this, name)` | 调用父构造函数，继承属性 |
| 2 | `Object.create(Animal.prototype)` | 继承父的原型方法 |
| 3 | `Dog.prototype.constructor = Dog` | 修复 constructor 指向 |

#### 图解继承后的原型链

```
dog 实例
  │
  │ __proto__
  ▼
Dog.prototype ─┬─→ bark: function()
               │   constructor: Dog  ← 被修复
               │
               │ __proto__
               ▼
         Animal.prototype ─┬─→ speak: function()
                           │
                           │ __proto__
                           ▼
                     Object.prototype
```

#### 为什么需要这3步？

1. **`Animal.call(this, name)`** - 把父类的属性继承过来
2. **`Object.create(Animal.prototype)`** - 把父类的方法继承过来  
3. **`constructor = Dog`** - 保持实例的 constructor 指向正确

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

// ❌ 不推荐：__proto__ 是非标准属性
obj.__proto__

// ✅ 推荐：标准 API
Object.getPrototypeOf(obj)

// 方法3: constructor.prototype
obj.constructor.prototype
```

### 6.2 设置原型

```javascript
const obj = {};

// ❌ 不推荐：__proto__ 是非标准属性
obj.__proto__ = newParent;

// ✅ 推荐：标准 API
Object.setPrototypeOf(obj, newParent);

// 方法3: Object.create() (推荐，用于创建新对象)
const newObj = Object.create(proto);
```

### 6.3 为什么不用 __proto__ ？

`__proto__` 是**非标准**属性，虽然大多数浏览器支持，但**不推荐使用**：

1. **非标准** - 从未进入 ECMAScript 规范
2. **性能差** - 修改 `__proto__` 性能很差
3. **兼容性问题** - 某些环境不支持

**现代代码用 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()`**。

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

### 7.4 constructor 属性

`constructor` 是原型对象上的一个特殊属性，指向创建该原型的函数。

```javascript
function Person(name) {
    this.name = name;
}

// constructor 在 Person.prototype 上
console.log(Person.prototype.constructor === Person);  // true

// 实例也有 constructor，通过原型链访问
const p = new Person('Tom');
console.log(p.constructor === Person);  // true (从原型链上找到的)
```

#### 图解

```
Person (函数对象)
  │
  │ prototype
  ▼
┌──────────────────────────────────────────┐
│         Person.prototype                 │
│  ┌────────────────────────────────────┐  │
│  │ constructor → Person (指向函数自身) │  │
│  │ __proto__ → Object.prototype       │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

p 实例
  │
  │ __proto__
  ▼
  └─→ Person.prototype → p.constructor 访问的就是上面的 constructor
```

#### 总结

| 对象 | constructor 来自 |
|------|------------------|
| 函数 `function(){}` | `函数.prototype.constructor === 函数` |
| 普通对象 `{}` | `Object.prototype.constructor === Object` |
| 实例 `new Fn()` | 通过 `__proto__` 访问到 `Fn.prototype.constructor`**一句话**：`constructor` 在 prototype 上，默认指向创建它的函数。

### 7.4 ES5 原型继承的复杂性

ES5 中实现继承需要写很多样板代码：

```javascript
// ES5 继承写法 - 繁琐且容易出错
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    console.log(`${this.name} 发出了声音`);
};

function Dog(name) {
    Animal.call(this, name);  // 手动调用父类构造函数
}
Dog.prototype = Object.create(Animal.prototype);  // 继承原型
Dog.prototype.constructor = Dog;                  // 修复 constructor
Dog.prototype.bark = function() {
    console.log(`${this.name} 汪汪汪!`);
};

const dog = new Dog('旺财');
```

问题：
1. **步骤多** - 4-5 行才能实现继承
2. **易出错** - 容易忘记 `constructor` 修复
3. **不直观** - 看不出是 "父子关系"
4. **语法不一致** - 和其他语言（Java、C++）差别大

### 7.5 ES6 class 的简化

ES6 引入 class 语法，大大简化了继承写法：

```javascript
// ES6 继承 - 一眼就能看懂
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        console.log(`${this.name} 发出了声音`);
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);  // 自动调用父类构造函数
    }
    bark() {
        console.log(`${this.name} 汪汪汪!`);
    }
}

const dog = new Dog('旺财');
dog.speak();  // "旺财 发出了声音"
dog.bark();   // "旺财 汪汪汪!"
```

### 7.6 ES6 class vs ES5 原型

| 对比 | ES5 | ES6 class |
|------|-----|-----------|
| 继承 | `Object.create + constructor 修复` | `extends` |
| 父类调用 | `Animal.call(this, id)` | `super(id)` |
| 代码行数 | 4-5 行 | 2-3 行 |
| 可读性 | 难看出关系 | 清晰 |

### 7.7 为什么发明 ES6 class？

ES6 class 很大程度上是为了：

1. **简化原型继承** - 用 `extends` 和 `super` 替代繁琐的手动写法
2. **统一语法** - 和传统 OOP 语言（Java、C++、Python）保持一致
3. **改善可读性** - 一眼看出类之间的关系

> TC39（JavaScript 标准委员会）的设计目标之一就是：**让 JS 的类语法与其他 OOP 语言平齐**，降低学习成本。

**本质**：ES6 class 只是语法糖，底层仍然是原型继承。

```javascript
// 这两种写法是等价的

// ES6 class
class Dog extends Animal { }

// ES5 原型
function Dog(name) {
    Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

---

## 八、延伸阅读

- [MDN: 继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN: Object.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [MDN: Function.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)