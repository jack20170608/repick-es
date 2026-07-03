# 函数的 prototype 属性

## 什么是 prototype

每个 JavaScript 函数在创建时，都会自动生成一个 `prototype` 属性，它是一个对象。

```javascript
function Vehicle() {
    this.price = 1000;
}

console.log(Vehicle.prototype);  // { constructor: f Vehicle() }
```

## prototype 的作用

通过 `new` 创建的实例，会**继承** prototype 上的属性和方法：

```javascript
// 在 prototype 上定义方法
Vehicle.prototype.getPrice = function() {
    return this.price;
};

Vehicle.prototype.drive = function() {
    console.log(' driving...');
};

// 创建实例
var v = new Vehicle();
v.getPrice();  // 1000 - 继承自 prototype
v.drive();     // " driving..." - 继承自 prototype
```

## 原型链

```
实例 v
   │
   └── [[prototype]] → Vehicle.prototype
                           │
                           └── getPrice()
                           └── drive()
```

实例本身没有 `getPrice` 方法，但会沿着原型链向上查找。

## 常用操作

### 判断属性来源

```javascript
v.hasOwnProperty('price');    // true - 自身属性
v.hasOwnProperty('getPrice'); // false - 在 prototype 上

'getPrice' in v;              // true - 包括原型链
```

### 查看 prototype 对象

```javascript
Object.getPrototypeOf(v);     // 获取原型
v.__proto__;                  // 同上（不推荐使用）
```

### 修改 prototype

```javascript
Vehicle.prototype.color = 'red';  // 添加属性
```

## 典型用途

| 场景 | 示例 |
|------|------|
| 定义共享方法 | `Vehicle.prototype.drive = function() {}` |
| 添加属性 | `Vehicle.prototype.wheels = 4` |
| 实现继承 | `Child.prototype = Object.create(Parent.prototype)` |
| 静态属性/方法 | `Vehicle.maxSpeed = 200` (直接写在函数上) |

## 完整示例

```javascript
function Vehicle(price) {
    this.price = price;
}

// 在 prototype 上定义方法（所有实例共享）
Vehicle.prototype.getPrice = function() {
    return this.price;
};

Vehicle.prototype.drive = function() {
    console.log('Vehicle is driving');
};

// 创建两个实例
var car = new Vehicle(1000);
var bike = new Vehicle(500);

console.log(car.getPrice());  // 1000
console.log(bike.getPrice()); // 500

// car 和 bike 共享同一个 getPrice 函数
console.log(car.getPrice === bike.getPrice); // true
```

## constructor 属性

prototype 对象默认包含一个 `constructor` 属性，指向函数本身：

```javascript
Vehicle.prototype.constructor === Vehicle;  // true
```