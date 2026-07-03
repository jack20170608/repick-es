# JavaScript 如何区分函数是否为构造函数

## 1. 使用 `new` 调用

```javascript
function Vehicle() {
    this.price = 1000;
}

// 用 new 调用 = 构造函数
var v = new Vehicle();  // this 指向新实例

// 直接调用 = 普通函数
var result = Vehicle(); // this 指向全局对象（window/global）
```

## 2. 命名规范（约定）

构造函数通常首字母大写：

```javascript
function Vehicle() {}  // 构造函数（约定）
function drive() {}    // 普通函数
```

## 3. 运行时检测

```javascript
function Foo() {
    // 方法一：检测 this 是否是自身实例
    if (this instanceof Foo) {
        console.log('构造函数调用');
    } else {
        console.log('普通函数调用');
    }

    // 方法二：检测 new.target（ES6）
    if (new.target === Foo) {
        console.log('用 new 调用');
    }
}

new Foo();   // "构造函数调用", "用 new 调用"
Foo();       // "普通函数调用"
```

## 4. 总结对比

| 特征 | 构造函数 | 普通函数 |
|------|----------|----------|
| 调用方式 | `new Foo()` | `Foo()` |
| 命名 | 首字母大写 | 小写/驼峰 |
| `this` | 指向新实例 | 指向全局 |
| `new.target` | 等于函数本身 | `undefined` |

> **最佳实践**：通过命名约定和调用方式区分，不要依赖运行时检测。

---

## 5. 为什么不能"禁用 this"

**问**：在非构造函数里禁用 this 不就可以了？

**答**：JavaScript 设计上不允许"禁用 this"：

### 5.1 `this` 无法被禁用

`this` 是语言内置的关键字，不能禁用或移除。

### 5.2 JavaScript 的灵活调用

同一个函数可以用不同方式调用：

```javascript
function greet() {
    console.log('Hello, ' + this.name);
}

var obj = { name: 'Tom' };

greet();                    // this = window/undefined (严格模式)
greet.call(obj);            // this = obj
obj.method = greet;
obj.method();               // this = obj
```

函数被设计为**可复用**的，不能因为用了 `this` 就变成"只能当构造函数"。

### 5.3 需要 `this` 的场景

```javascript
// 对象方法需要 this
var person = {
    name: 'John',
    sayHi: function() {
        console.log('Hi, I am ' + this.name);
    }
};

// 回调函数需要 this
button.addEventListener('click', function() {
    console.log(this);  // 指向 button 元素
});
```

### 5.4 正确的做法

JavaScript 选择**约定俗成**而非强制：

| 约定 | 说明 |
|------|------|
| 首字母大写 | `function Vehicle()` = 构造函数 |
| 小写/驼峰 | `function drive()` = 普通函数 |
| 文档注释 | 用 JSDoc 标注函数用途 |

> **设计哲学**：JavaScript 信任开发者，通过约定而不是强制来区分。

---

## 6. new 的工作原理

`new` 在行为上确实**像一个函数调用**：

### 6.1 new 做了什么

```javascript
function Vehicle(price) {
    this.price = price;
}
var v = new Vehicle(1000);
```

`new Vehicle(1000)` 实际上做了 3 件事：

| 步骤 | 操作 | 相当于 |
|------|------|--------|
| 1 | 创建新对象 | `{}` |
| 2 | 绑定 this | `this = 新对象` |
| 3 | 执行构造函数 | `Vehicle.call(this, 1000)` |
| 4 | 返回 this | 自动返回 |

### 6.2 手动实现 new

```javascript
function myNew(constructor, ...args) {
    // 1. 创建空对象
    var obj = {};
    
    // 2. 设置原型
    obj.__proto__ = constructor.prototype;
    
    // 3. 执行构造函数，绑定 this
    var result = constructor.apply(obj, args);
    
    // 4. 返回对象（如果构造函数返回对象则返回它）
    return result || obj;
}

// 用法
var v = myNew(Vehicle, 1000);
```

### 6.3 结论

> `new` = **创建对象 + 绑定this + 执行函数 + 返回对象**
> 
> 本质上就是一个**特殊的函数调用语法糖**

这揭示了 JavaScript 的**原型继承**机制。

---

## 7. 构造函数的显式 return

### 规则

| 返回值类型 | 结果 |
|------------|------|
| 原始类型 (number, string, boolean) | **忽略**，返回 `this` |
| 对象 (Object, Array, Function) | **返回该对象**，忽略 `this` |

### 示例

```javascript
function Foo() {
    this.name = 'Foo';
    return 'hello';  // 原始类型，被忽略
}
var f = new Foo();
console.log(f.name);  // 'Foo' — 返回的是 this


function Bar() {
    this.name = 'Bar';
    return { type: 'custom' };  // 返回对象
}
var b = new Bar();
console.log(b.type);  // 'custom'
console.log(b.name);  // undefined — this 被丢弃
```

### 应用：单例模式

```javascript
var instance = null;

function Single() {
    if (instance) {
        return instance;  // 返回已有实例
    }
    instance = this;
    this.data = 'only one';
}

var s1 = new Single();
var s2 = new Single();
console.log(s1 === s2);  // true — 同一个实例
```