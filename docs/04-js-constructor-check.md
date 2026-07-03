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