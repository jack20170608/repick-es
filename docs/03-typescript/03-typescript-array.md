# TypeScript 数组类型

## 基本语法

### 两种声明方式

```typescript
// 方式一：类型 + 方括号
let arr1: number[] = [1, 2, 3];
let arr2: string[] = ['a', 'b', 'c'];
let arr3: boolean[] = [true, false];

// 方式二：Array 泛型
let arr4: Array<number> = [1, 2, 3];
let arr5: Array<string> = ['a', 'b', 'c'];
```

两种方式完全等价，习惯用哪种都可以。

---

## 数组类型推导

TypeScript 会自动推导数组类型：

```typescript
const numbers = [1, 2, 3];     // number[]
const strings = ['a', 'b'];    // string[]
const mixed = [1, 'a', true];  // (string | number | boolean)[]
```

---

## 常用数组操作

### 添加元素

```typescript
const arr: number[] = [1, 2, 3];
arr.push(4);        // 添加到末尾
arr.unshift(0);     // 添加到开头

console.log(arr);   // [0, 1, 2, 3, 4]
```

### 删除元素

```typescript
const arr: number[] = [1, 2, 3, 4, 5];
arr.pop();          // 删除末尾
arr.shift();        // 删除开头

console.log(arr);   // [2, 3]
```

### 遍历

```typescript
const arr: number[] = [1, 2, 3];

// for 循环
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// for...of（推荐）
for (const item of arr) {
  console.log(item);
}

// forEach
arr.forEach((item, index) => {
  console.log(`${index}: ${item}`);
});
```

---

## 只读数组

### readonly 修饰符

```typescript
// 创建一个不可修改的数组
const arr: readonly number[] = [1, 2, 3];
// arr.push(4);     // ❌ 错误：无法修改
// arr.pop();       // ❌ 错误：无法修改

// Array 泛型方式
const arr2: ReadonlyArray<number> = [1, 2, 3];
```

### const vs readonly

```typescript
// const 保证变量不可重新赋值，但数组内容可以修改
const arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅ OK
// arr1 = [5, 6];   // ❌ 错误

// readonly 保证数组内容不可修改
const arr2: readonly number[] = [1, 2, 3];
// arr2.push(4);    // ❌ 错误
arr2.slice(1);       // ✅ OK，返回新数组
```

---

## 元组（Tuple）

元组是**固定长度和类型的数组**：

```typescript
// 定义元组
const user: [string, number] = ['Tom', 25];

// 访问元素
console.log(user[0]);  // 'Tom'
console.log(user[1]);  // 25

// 解构
const [name, age] = user;
```

### 实际应用场景

```typescript
// 坐标
const point: [number, number] = [100, 200];

// 键值对
const kv: [string, number][] = [
  ['a', 1],
  ['b', 2]
];

// 函数返回多个值
function getUser(): [string, number, boolean] {
  return ['Tom', 25, true];
}
const [name, age, isAdmin] = getUser();
```

### 可选元组元素

```typescript
// 第三个元素可选
const tuple: [string, number, boolean?] = ['Tom', 25];

console.log(tuple);        // ['Tom', 25]
console.log(tuple[2]);     // undefined
```

---

## 数组类型注解

### 数组中可以有多种类型

```typescript
// 联合类型数组
const arr: (string | number)[] = [1, 'a', 2, 'b'];

// 任意类型数组
const anyArr: any[] = [1, 'a', {}, []];

// 空数组（推断为 never[]）
const empty: [] = [];
```

### 限制数组元素

```typescript
// 枚举数组
enum Direction { Up, Down, Left, Right }
const dirs: Direction[] = [Direction.Up, Direction.Down];

// 字面量数组（固定值）
const levels: 1[] = [1, 1, 1];  // 所有元素必须是 1
```

---

## 函数返回数组类型

```typescript
// 返回 number[]
function getNumbers(): number[] {
  return [1, 2, 3];
}

// 返回元组
function getUser(): [string, number] {
  return ['Tom', 25];
}

// 返回只读数组
function getReadonly(): readonly string[] {
  return ['a', 'b', 'c'];
}
```

---

## 总结

| 语法 | 说明 |
|------|------|
| `number[]` | 数字数组 |
| `Array<number>` | 同上，泛型形式 |
| `readonly number[]` | 只读数字数组 |
| `[string, number]` | 元组（固定长度） |
| `(string \| number)[]` | 混合类型数组 |
| `any[]` | 任意类型数组 |