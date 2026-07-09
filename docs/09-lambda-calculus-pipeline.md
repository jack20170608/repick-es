# λ 演算与函数组合学习笔记

> 2025-07-09 学习记录

## 一、λ 演算是什么

**λ 演算**（Lambda Calculus）由阿隆佐·丘奇（Alonzo Church）在 1930 年代发明，是函数式编程的数学理论基础。

### 核心规则（只有三条）

1. **λ 抽象**（定义函数）：`λx. body` 表示"一个接受 x 并返回 body 的函数"
2. **函数应用**（调用函数）：`(M N)` 表示"把函数 M 应用到参数 N"
3. **变量绑定**：x 可以是绑定的（在 λ 后面）或自由的

### 示例

| λ 表达式 | 等价 JS | 说明 |
|---------|---------|------|
| `λx. x` | `x => x` | 恒等函数 |
| `λx. λy. x` | `x => y => x` | 返回第一个参数 |
| `λx. λy. y` | `x => y => y` | 返回第二个参数 |

### 求值示例

```
(λx. λy. x) 5 3
     ↓
先给 x 传 5  →  λy. 5
     ↓
再给 y 传 3  →  5
```

### 为什么重要

- **图灵完备**：可以表达任何可计算函数
- **函数式编程的理论基础**：Lisp、Haskell、Scheme 等语言的祖先
- **闭包（Closure）**概念的来源

---

## 二、Curry 化（柯里化）

`λx. λy. x` 从内向外阅读，等价于 `λx. (λy. x)`，也就是 `x => y => x`。

这被称为 **Curry 化**——一个多参数函数可以转成一系列单参数函数。

```javascript
// 非柯里化
const add = (a, b) => a + b;
add(1, 2);  // 3

// 柯里化
const curriedAdd = a => b => a + b;
curriedAdd(1)(2);  // 3
```

---

## 三、pipeline 函数

### 原始实现

```javascript
const pipeline = (...funcs) =>
  val => funcs.reduce((a, b) => b(a), val);
```

### 含义

将多个函数**串联**起来，让数据像流水线一样依次经过每个函数：

```javascript
const plus1 = a => a + 1;    // +1
const mult2 = a => a * 2;    // ×2

const addThenMult = pipeline(plus1, mult2);
addThenMult(3);  // (3 + 1) × 2 = 8

// 数据流向：3 → +1 → 4 → ×2 → 8
```

### 价值

| 场景 | 价值 |
|-----|------|
| **数据转换链** | 多个 map/filter/reduce 串联时更清晰 |
| **函数式组合** | 避免嵌套括号，接近自然语言 |
| **可复用的管道** | pipeline(a, b, c, d) 可到处重用 |
| **函数式日志** | 中间步骤可插桩调试 |

### 对比

```javascript
// 传统写法（从内向外读）
mult2(plus1(3))

// pipeline（从左向右读，更直观）
pipeline(plus1, mult2)(3)
```

---

## 四、pipeline 的局限性与优化

### 问题：可读性不够强

当函数名不够清晰时，pipeline 会变得难以理解：

```javascript
// 很难看懂
pipeline(a, b, c, d)(x)

// 需要靠函数名才能理解
const processUser = pipeline(
  validateInput,    // 验证
  normalizeName,   // 格式化
  addTimestamp,    // 加时间戳
  sanitizeOutput   // 清理
);
```

### 优化方案

#### 1. 用更语义化的命名

```javascript
const pipe = (...fns) => initial => fns.reduce((v, fn) => fn(v), initial);

// 或加注释
const pipeline = (...funcs) =>
  val => funcs.reduce((acc, fn) => fn(acc), val);  // acc → fn → newAcc
```

#### 2. 管道操作符（原生支持后）

```javascript
// ES2024 管道运算符（部分支持）
const result = 3 |> plus1 |> mult2;  // 非常直观
```

#### 3. 使用函数式库

```javascript
import { flow, pipe } from 'lodash/fp';

const process = flow(
  validateInput,
  normalizeName,
  sanitizeOutput
);
```

#### 4. 短链直接展开

```javascript
// 2-3 个函数时，直接写最简单
const addThenMult = val => {
  const afterPlus = plus1(val);
  return mult2(afterPlus);
};
```

---

## 五、总结

| 概念 | 核心思想 |
|-----|---------|
| λ 演算 | 一切皆函数，用最简形式描述计算 |
| Curry 化 | 多参数函数转单参数函数链 |
| pipeline | 函数组合，嵌套调用 → 线性流动 |

### 实践建议

- **短链**（2-3 个函数）：直接嵌套最简单
- **长链**（4+ 个函数）：用 `pipeline`，但必须配合语义化函数名
- **环境支持**：直接用 `|>` 管道操作符

> 代码的可读性永远是第一位的，函数名的清晰度比花哨的技巧更重要。