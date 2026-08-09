# TypeScript typeof 的两种用法

## 概述

`typeof` 在 TypeScript 中有两种完全不同的用法：
1. **值上下文**：作为运算符，返回类型字符串
2. **类型上下文**：作为类型操作符，返回类型

## 区分方式

看 `typeof` 出现在什么位置——**类型上下文期望类型，值上下文期望值**。

### 类型上下文的位置

```typescript
// 1. type 声明后面
type A = number;

// 2. 变量类型注解（: 后面）
let x: number;

// 3. 函数返回类型
function fn(): number { return 100; }

// 4. 泛型类型参数
type Box<T> = T;

// 5. 接口属性
interface User {
  name: string;
}
```

> **简单记忆**：冒号后面、type 后面、泛型 <> 里面 → 类型上下文

---

## 1. 值上下文：typeof 作为运算符

作为 JavaScript 原生运算符，返回类型的**字符串表示**。

```typescript
const str = 'hello';
const typeStr = typeof str;  // "string"（值）

console.log(typeof 123);     // "number"
console.log(typeof true);    // "boolean"
console.log(typeof {});      // "object"
console.log(typeof []);      // "object"
console.log(typeof function(){});  // "function"
```

### 实际应用：运行时类型检查

```typescript
function printType(value: any): void {
  const type = typeof value;
  console.log(`类型: ${type}, 值: ${value}`);
}

printType('hello');   // 类型: string, 值: hello
printType(123);       // 类型: number, 值: 123
printType(true);      // 类型: boolean, 值: true
printType({});        // 类型: object, 值: [object Object]
printType([]);        // 类型: object, 值:
```

---

## 2. 类型上下文：typeof 作为类型操作符

作为 TypeScript 类型操作符，获取变量的**类型**。

```typescript
const person = { name: 'Tom', age: 25 };

// 在类型位置使用，获取变量的"类型"
type Person = typeof person;
// 等价于：type Person = { name: string; age: number }

const p: Person = { name: 'Jerry', age: 30 };
```

### 特点

- 编译时生效，编译后消失
- 返回的是 TypeScript 类型，不是字符串

---

## 对比示例

```typescript
const x = 100;

// 值上下文：typeof 是运算符，返回字符串
const str: string = typeof x;  // str = "number"

// 类型上下文：typeof 是类型操作符，返回类型
type X = typeof x;  // X = 100（字面量类型）
```

---

## 实际应用场景

### 1. 从对象快速提取类型

```typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};

type Config = typeof config;
// type Config = { apiUrl: string; timeout: number; retries: number }

function init(cfg: Config) {
  console.log(`API: ${cfg.apiUrl}`);
}
init(config);  // OK
// init({ apiUrl: 'other' });  // ❌ 缺少属性
```

### 2. 从函数返回类型提取

```typescript
function getUser() {
  return { id: 1, name: 'Tom', email: 'tom@example.com' };
}

// 获取函数返回类型
type User = ReturnType<typeof getUser>;
// type User = { id: number; name: string; email: string }

// 常用工具类型
type Awaited<T> = T extends Promise<infer R> ? R : never;
```

### 3. 从类提取类型

```typescript
class User {
  name: string = '';
  age: number = 0;
}

type UserType = typeof User;
// 这里的 UserType 是"类构造函数"的类型，不是实例类型

// 获取实例类型
type UserInstance = InstanceType<typeof User>;
// type UserInstance = User
```

### 4. 配合其他类型操作符

```typescript
const api = {
  GET: '/api/get',
  POST: '/api/post',
  PUT: '/api/put'
} as const;

// 获取键的联合类型
type ApiMethod = keyof typeof api;
// type ApiMethod = "GET" | "POST" | "PUT"

// 获取值的联合类型
type ApiPath = typeof api[ApiMethod];
// type ApiPath = "/api/get" | "/api/post" | "/api/put"
```

---

## 总结

| 上下文 | 位置 | 作用 | 结果 |
|--------|------|------|------|
| 值上下文 | `const x = typeof y` | JavaScript 运算符 | 字符串（如 `"string"`） |
| 类型上下文 | `type X = typeof y` | TypeScript 类型操作符 | 类型（如 `string`） |

**关键点**：TypeScript 根据 `typeof` 出现的位置自动判断是哪种用法。

> 记住这个口诀：**冒号后面、type 后面、泛型<>里面 → 类型上下文**