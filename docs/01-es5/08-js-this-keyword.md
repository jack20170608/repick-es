# JavaScript this 关键字全面指南

## 什么是 this？

`this` 是函数执行时的**上下文对象**，指向当前调用的对象。它的值取决于**函数的调用方式**，而不是定义位置。

---

## this 的5种绑定规则

### 1. 默认绑定（独立函数调用）

**规则**：函数直接调用时，`this` 指向全局对象（非严格模式）或 `undefined`（严格模式）

```javascript
// 非严格模式
function foo() {
    console.log(this);  // Window (浏览器) 或 global (Node)
}
foo();

// 严格模式
'use strict';
function bar() {
    console.log(this);  // undefined
}
bar();
```

### 2. 隐式绑定（作为对象的方法）

**规则**：当函数作为对象的方法调用时，`this` 指向**调用该方法的对象**

```javascript
const person = {
    name: 'Jack',
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

person.greet();  // "Hello, I'm Jack" - this 指向 person
```

#### 隐式丢失

**陷阱**：把方法赋值给变量后调用，`this` 会丢失！

```javascript
const person = {
    name: 'Jack',
    greet() {
        console.log(this.name);
    }
};

const greet = person.greet;  // 赋值给变量
greet();  // undefined (非严格模式) - this 指向 Window

// ✅ 解决：bind 绑定
const greet2 = person.greet.bind(person);
greet2();  // "Jack"
```

#### 传入回调函数

```javascript
const person = {
    name: 'Jack',
    greet() {
        console.log(this.name);
    }
};

// 隐式丢失：回调函数中 this 丢失
setTimeout(person.greet, 100);  // undefined

// ✅ 解决1：使用箭头函数
setTimeout(() => person.greet(), 100);  // "Jack"

// ✅ 解决2：bind 绑定
setTimeout(person.greet.bind(person), 100);  // "Jack"
```

### 3. 显式绑定（call / apply / bind）

**规则**：使用 `call`、`apply`、`bind` 显式指定 `this`

```javascript
function greet(message, punctuation) {
    console.log(`${message}, I'm ${this.name}${punctuation}`);
}

const person = { name: 'Jack' };

// call - 参数逐一传递
greet.call(person, 'Hello', '!');  // "Hello, I'm Jack!"

// apply - 参数以数组传递
greet.apply(person, ['Hello', '!']);  // "Hello, I'm Jack!"

// bind - 返回新函数（不立即执行）
const boundGreet = greet.bind(person, 'Hello', '!');
boundGreet();  // "Hello, I'm Jack!"
```

#### 三者对比

| 方法 | 用法 | 参数形式 | 返回值 |
|------|------|----------|--------|
| `call(thisArg, ...args)` | 立即调用 | 逗号分隔 | 函数返回值 |
| `apply(thisArg, [args])` | 立即调用 | 数组 | 函数返回值 |
| `bind(thisArg, ...args)` | 返回新函数 | 逗号分隔 | 新函数 |

### 4. 构造器绑定（new 关键字）

**规则**：使用 `new` 调用构造函数时，`this` 指向**新创建的实例**

```javascript
function Person(name) {
    this.name = name;
}

const jack = new Person('Jack');
console.log(jack.name);  // "Jack"
```

#### new 做了什么？

```javascript
function newOperator(constructor, ...args) {
    // 1. 创建新对象
    const obj = {};
    
    // 2. 设置原型链
    obj.__proto__ = constructor.prototype;
    
    // 3. 绑定 this 并执行
    const result = constructor.apply(obj, args);
    
    // 4. 返回对象
    return result || obj;
}
```

### 5. 箭头函数的 this 绑定

**规则**：箭头函数没有自己的 `this`，它**继承外层作用域的 this**

```javascript
const person = {
    name: 'Jack',
    
    // 普通函数 - this 指向调用者
    greetNormal() {
        console.log(this.name);
    },
    
    // 箭头函数 - this 继承外层（person）
    greetArrow: () => {
        console.log(this.name);  // undefined! 外层是全局
    }
};

person.greetNormal();  // "Jack"
person.greetArrow();   // undefined
```

#### 箭头函数适用场景

```javascript
// ✅ 适合：回调函数中使用外层的 this
class Counter {
    constructor() {
        this.count = 0;
    }
    
    increment() {
        setTimeout(() => {
            this.count++;  // this 指向 Counter 实例
        }, 100);
    }
}

// ❌ 不适合：作为对象方法（无法获取正确的 this）
const obj = {
    value: 10,
    getValue: () => this.value  // 错误！this 指向全局
};
```

---

## this 绑定优先级

从高到低：

```
new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定
```

```javascript
function foo() {
    console.log(this.name);
}

const obj1 = { name: 'obj1' };
const obj2 = { name: 'obj2' };

// 1. 显式绑定 > 隐式绑定
obj1.foo = foo;
obj1.foo();              // "obj1" (隐式)
obj1.foo.call(obj2);     // "obj2" (显式 - 更高优先级)

// 2. new 绑定 > 显式绑定
const bound = foo.bind(obj2);
new bound();             // {} - new 忽略 bind 的 this
```

---

## 常见面试题

### Q1: 输出是什么？

```javascript
const obj = {
    name: 'obj',
    fn() {
        console.log(this.name);
    }
};

const fn = obj.fn;
fn();  // ???
```

**答案**: `undefined`（浏览器中）  
**原因**: `fn()` 是独立调用，this 指向 Window（Window.name 通常是空的）

---

### Q2: 输出是什么？

```javascript
const obj = {
    name: 'obj',
    fn() {
        return function() {
            console.log(this.name);
        };
    }
};

obj.fn()();  // ???
```

**答案**: `undefined`  
**原因**: 内部函数独立调用，this 指向 Window

---

### Q3: 如何修正？

```javascript
const obj = {
    name: 'obj',
    fn() {
        return function() {
            console.log(this.name);  // 丢失 this
        };
    }
};
```

**方案1**: 保存 this 引用
```javascript
fn() {
    const self = this;
    return function() {
        console.log(self.name);
    };
}
```

**方案2**: 使用箭头函数
```javascript
fn() {
    return () => {
        console.log(this.name);
    };
}
```

---

### Q4: 输出是什么？

```javascript
function Foo() {
    getName = function() { console.log(1); };
    return this;
}

Foo.getName = function() { console.log(2); };
Foo.prototype.getName = function() { console.log(3); };

var getName = function() { console.log(4); };

function getName() { console.log(5); }

// 依次输出：
Foo.getName();         // ???
getName();             // ???
Foo().getName();       // ???
getName();             // ???
new Foo.getName();     // ???
new Foo().getName();   // ???
new new Foo().getName();  // ???
```

**答案**:
```
Foo.getName():        // 2 (静态方法)
getName():            // 4 (函数声明提升，但被变量赋值覆盖)
Foo().getName():      // 1 (Foo() 返回 this，指向 Window，getName 被覆盖)
getName():            // 1 (Window.getName)
new Foo.getName():    // 2 (new Foo.getName 等于 new (Foo.getName)())
new Foo().getName():  // 3 (实例上的方法)
new new Foo().getName();  // 3 (new (new Foo()).getName())
```

---

### Q5: eval 中的 this

```javascript
const obj = {
    fn() {
        eval('console.log(this.name)');
    }
};

obj.fn();  // "obj" - eval 在调用者的上下文中执行
```

---

## 箭头函数 vs 普通函数

| 特性 | 普通函数 | 箭头函数 |
|------|----------|----------|
| this | 运行时决定（调用方式） | 定义时决定（继承外层） |
| arguments | ✅ 有 | ❌ 没有（需用 rest） |
| constructor | ✅ 有 | ❌ 没有 |
| 可作为构造函数 | ✅ 可以 | ❌ 不可以 |
| this 可修改 | ✅ 可以（call/apply/bind） | ❌ 不可以 |

---

## ES6 Class 中的 this

### 构造器中的 this

```javascript
class Person {
    constructor(name) {
        this.name = name;  // this 指向实例
    }
}
```

### 方法中的 this

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
    
    // -arrow 箭头函数 - this 永远绑定实例
    greetArrow = () => {
        console.log(`Hello, I'm ${this.name}`);
    }
}
```

### 类方法作为回调

```javascript
class Handler {
    constructor() {
        this.value = 100;
    }
    
    handleClick() {
        console.log(this.value);
    }
}

const handler = new Handler();

// ❌ 丢失 this
button.addEventListener('click', handler.handleClick);

// ✅ 方案1：bind
button.addEventListener('click', handler.handleClick.bind(handler));

// ✅ 方案2：箭头属性
class Handler2 {
    constructor() {
        this.value = 100;
    }
    handleClick = () => {
        console.log(this.value);  // class 字段初始化时绑定
    };
}
```

---

## 总结

### this 指向速查表

| 调用方式 | this 指向 |
|----------|-----------|
| `obj.method()` | obj |
| `method()` | Window / undefined |
| `method.call(obj)` | obj |
| `method.apply(obj)` | obj |
| `method.bind(obj)()` | obj |
| `new Constructor()` | 新实例 |
| `() => {}` | 外层 this |

### 绑定 this 的最佳实践

1. **优先使用箭头函数** - 在回调、定时器中避免 this 丢失
2. **谨慎使用 bind** - 需要时显式绑定
3. **避免在回调中直接使用 this** - 用箭头函数包装
4. **class 字段** - 用箭头函数定义方法，永远绑定实例