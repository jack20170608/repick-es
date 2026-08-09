# TypeScript Symbol 类型

> 注意：Symbol 是 JavaScript 的原始类型，TypeScript 只是继承了 JS 的 Symbol 并添加了类型支持。

## 什么是 Symbol？

Symbol 是 ES6 引入的**唯一性标识符**，每次调用 `Symbol()` 都会创建一个**唯一且不可变**的值。

```typescript
const sym1 = Symbol();
const sym2 = Symbol();

console.log(sym1 === sym2);  // false（每次都唯一）
```

---

## 基本用法

### 创建 Symbol

```typescript
// 不带描述
const sym1 = Symbol();

// 带描述（便于调试）
const sym2 = Symbol('my-symbol');
const sym3 = Symbol('my-symbol');

console.log(sym2 === sym3);  // false（描述相同但值仍唯一）
console.log(sym2);           // Symbol(my-symbol)
```

### 作为对象属性 key

```typescript
const name = Symbol('name');
const age = Symbol('age');

const user = {
  [name]: 'Tom',
  [age]: 25,
  city: 'Beijing'
};

console.log(user[name]);  // 'Tom'
console.log(user[age]);   // 25
```

---

## Symbol 的特性

### 1. 唯一性

```typescript
const s1 = Symbol('key');
const s2 = Symbol('key');

console.log(s1 === s2);  // false
```

### 2. 不可枚举

```typescript
const sym = Symbol('secret');
const obj = {
  name: 'Tom',
  [sym]: 'hidden value'
};

console.log(Object.keys(obj));    // ['name']（Symbol 属性不枚举）
console.log(Object.getOwnPropertySymbols(obj));  // [Symbol(secret)]
```

### 3. 可共享（Symbol.for）

```typescript
// 全局 Symbol 注册表
const s1 = Symbol.for('global-key');
const s2 = Symbol.for('global-key');

console.log(s1 === s2);  // true（同一 key 返回同一 Symbol）
```

### 4. 内置 Symbol

JavaScript 提供了一些内置 Symbol：

```typescript
// Symbol.iterator - 可迭代协议
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();

// Symbol.toStringTag
const obj = {};
console.log(obj[Symbol.toStringTag]);  // 'Object'

// Symbol.hasInstance
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray);  // true
console.log({} instanceof MyArray);  // false
```

---

## 在 TypeScript 中的类型注解

### Symbol 类型

```typescript
const sym: symbol = Symbol('my-symbol');
```

### Symbol 作为对象属性

```typescript
const name = Symbol('name');

const user: {
  [key: symbol]: string
} = {
  [name]: 'Tom'
};

console.log(user[name]);  // 'Tom'
```

### Symbol 数组

```typescript
const sym1 = Symbol('a');
const sym2 = Symbol('b');

const syms: symbol[] = [sym1, sym2];
```

---

## 实际应用场景

### 1. 定义类的私有属性

```typescript
const privateField = Symbol('privateField');

class MyClass {
  [privateField] = '私有值';
  
  getPrivate() {
    return this[privateField];
  }
}

const instance = new MyClass();
console.log(instance.getPrivate());  // '私有值'
// instance[privateField] 从外部无法直接访问
```

### 2. 定义常量（确保唯一性）

```typescript
const EVENT_CLICK = Symbol('click');
const EVENT_HOVER = Symbol('hover');

function handleEvent(event: symbol) {
  if (event === EVENT_CLICK) {
    console.log('点击事件');
  } else if (event === EVENT_HOVER) {
    console.log('悬停事件');
  }
}

handleEvent(EVENT_CLICK);   // 点击事件
handleEvent(EVENT_HOVER);  // 悬停事件
```

### 3. 避免属性名冲突

```typescript
const toJSON = Symbol('toJSON');

const obj = {
  name: 'Tom',
  [toJSON]() {
    return { name: 'JSON版本' };
  }
};

console.log(obj.toJSON());       // [Function: toJSON]
console.log(obj[toJSON]());      // { name: 'JSON版本' }
console.log(JSON.stringify(obj)); // {"name":"Tom"}
```

### 4. 实现迭代器

```typescript
const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const item of iterable) {
  console.log(item);  // 1, 2, 3
}
```

---

## Symbol 常用方法

| 方法 | 说明 |
|------|------|
| `Symbol.for(key)` | 全局注册表获取/创建 Symbol |
| `Symbol.keyFor(sym)` | 获取全局 Symbol 的 key |

```typescript
const sym = Symbol.for('my-key');
console.log(Symbol.keyFor(sym));  // 'my-key'
```

---

## 总结

| 特性 | 说明 |
|------|------|
| 唯一性 | 每次 `Symbol()` 创建唯一值 |
| 不可枚举 | 不会出现在 `Object.keys()` 中 |
| 可共享 | `Symbol.for()` 全局共享 |
| 用途 | 私有属性、唯一常量、避免冲突 |

> **记住**：Symbol = **唯一标识符**，主要用于需要唯一 key 的场景。