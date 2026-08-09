# TypeScript 基本用法

## 什么是 TypeScript

TypeScript 是 JavaScript 的超集，它添加了类型系统和其他特性。TypeScript 代码最终会被编译成纯 JavaScript 代码。

## 安装 TypeScript

```bash
npm install -g typescript
```

验证安装：

```bash
tsc --version
```

## 编译 TypeScript

### 方式一：直接编译单个文件

```bash
tsc src/03-typescript/test-01-helloworld.ts
```

这会生成同名的 `.js` 文件。

### 方式二：项目级配置

在目录中初始化配置：

```bash
cd src/03-typescript
tsc --init
```

这会生成 `tsconfig.json` 文件，然后可以一次性编译所有 `.ts` 文件：

```bash
tsc
```

## tsconfig.json 常用配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

常用选项说明：

| 选项 | 说明 |
|------|------|
| `target` | 编译后的 JavaScript 版本（如 ES2020） |
| `module` | 使用的模块系统（如 commonjs） |
| `strict` | 开启严格类型检查 |
| `outDir` | 输出目录 |
| `rootDir` | 源码根目录 |

## 基本类型

### 原始类型

```typescript
let name: string = 'Tom';
let age: number = 25;
let isStudent: boolean = true;
```

### 数组

```typescript
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['Tom', 'Jerry'];
```

### 对象

```typescript
let user: { name: string; age: number } = {
  name: 'Tom',
  age: 25
};
```

### 函数

```typescript
function add(a: number, b: number): number {
  return a + b;
}

// 函数类型
let myAdd: (x: number, y: number) => number = function(x, y) {
  return x + y;
};
```

### 任意类型

```typescript
let anything: any = 'hello';
anything = 42;
```

### void 和 never

```typescript
function sayHello(): void {
  console.log('Hello!');
}

function throwError(): never {
  throw new Error('Error!');
}
```

### null 和 undefined

在 JavaScript 中，`null` 和 `undefined` 是两个不同的原始值。但在 TypeScript 中，可以通过联合类型将它们合并：

```typescript
// 合并为 nullish 类型
type Nullish = null | undefined;

let value: Nullish = null;
value = undefined;
// value = 42;  // 错误，只能赋值为 null 或 undefined
```

在 `strictNullChecks` 模式下（strict: true 时默认开启），`null` 和 `undefined` 不能直接赋值给其他类型，需要显式声明：

```typescript
// 允许 null/undefined
let name: string | null = null;
let age: number | undefined = undefined;

// 可选属性本质就是加了 undefined 的联合类型
interface User {
  name: string;
  email?: string;  // 等价于 string | undefined
}
```

## 接口（Interface）

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // 可选属性
}

const user: User = {
  name: 'Tom',
  age: 25
};
```

## 类型别名

```typescript
type ID = string | number;
type Callback = (result: string) => void;
```

## 联合类型

```typescript
let result: string | number;
result = 'success';
result = 100;
```

### 字符串字面量联合

```typescript
type Direction = 'up' | 'down' | 'left' | 'right';
let dir: Direction = 'up';
// dir = 'forward';  // 错误
```

这和枚举的作用有点类似，但更轻量。

## 枚举（Enum）

```typescript
// 数字枚举（默认从 0 开始）
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

// 字符串枚举
enum Status {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Error = 'ERROR'
}

// 使用
let dir: Direction = Direction.Up;
let status: Status = Status.Pending;

// 反向映射（数字枚举特有）
console.log(Direction[0]);  // "Up"
```

### 常量枚举

```typescript
const enum Color {
  Red = 'RED',
  Green = 'GREEN'
}
// 编译时内联，不生成额外代码
let c: Color = Color.Red;
```

## 字面量类型（值类型）

TypeScript 允许直接把"值"当作"类型"用，这就是字面量类型。

```typescript
let x: 100;      // x 只能是 100
let name: 'Tom'; // name 只能是 'Tom'
let ready: true; // 只能是 true
```

### 本质

> **把编译期的"值"变成运行期的"类型约束"**

### 作用：精确约束值的范围

```typescript
// 之前：只能约束类型
let age: number;  // 0, 1, 2, ... 任何数字

// 之后：可以约束具体值
let age: 18;  // 只能是 18
```

### 实际用途

```typescript
// 1. 精确的函数参数
function setLevel(level: 1 | 2 | 3) {
  console.log(`Level: ${level}`);
}
setLevel(1);  // OK
setLevel(5);  // ❌ 错误

// 2. 限制字符串字面量
type Direction = 'up' | 'down' | 'left' | 'right';
let dir: Direction = 'up';
dir = 'forward';  // ❌ 错误

// 3. 只读对象
const config = {
  apiUrl: 'https://api.example.com'
} as const;  // 所有值都变成字面量类型

// config.apiUrl = 'other';  // ❌ 错误
```

### 字面量类型 vs 枚举

| 特性 | 枚举 | 字面量类型 |
|------|------|-----------|
| 定义 | 需要先定义 enum | 直接写值 |
| 编译产物 | 生成额外 JS 代码 | 类型，编译后消失 |
| 反向映射 | 数字枚举支持 | 不支持 |
| 适用场景 | 需要集中管理常量 | 简单场景，类型约束 |

**简单总结**：字面量类型 = "内联枚举"，用起来更简洁！

```typescript
// 枚举：先定义，再使用
enum Direction { Up = 'up', Down = 'down' }
let dir: Direction = Direction.Up;

// 字面量类型：直接写，更简洁
let dir: 'up' | 'down' = 'up';
```

## 泛型

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>('hello');
let output2 = identity('world');  // 类型推断
```

## 运行编译后的 JS

```bash
node dist/test-01-helloworld.js
```

## 扩展名说明

| 扩展名 | 用途 |
|--------|------|
| `.ts` | TypeScript 源文件 |
| `.tsx` | 包含 JSX 的 TypeScript 文件 |
| `.d.ts` | 类型声明文件 |