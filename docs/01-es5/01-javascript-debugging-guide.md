# JavaScript 调试指南

## 1. Console 命令

```javascript
console.log(var)        // 普通打印
console.error(var)      // 错误打印（红色）
console.warn(var)       // 警告打印（黄色）
console.table(array)    // 表格形式打印数组/对象
console.dir(obj)        // 展开查看对象属性
console.trace()         // 打印调用栈
```

## 2. Node.js 调试

```bash
# 直接运行
node src/0501-test.js

# 带检查器（可在 Chrome 调试）
node --inspect src/0501-test.js

# 检查器在首行暂停
node --inspect-brk src/0501-test.js
```

## 3. 断点命令

```javascript
debugger;  // 代码执行到此处自动暂停
```

## 4. VS Code 调试快捷键

| 快捷键 | 功能 |
|--------|------|
| `F5` | 开始调试 |
| `F9` | 切换断点 |
| `F10` | 单步跳过 |
| `F11` | 单步进入 |
| `Shift+F11` | 单步退出 |
| `Shift+F5` | 停止调试 |

## 5. 常用检查命令

```javascript
typeof v                    // 查看变量类型
Object.keys(v)              // 查看对象所有键
v instanceof Vehicle        // 检查实例类型
```

## 6. 调试技巧

### 快速调试
最常用的组合就是 `console.log` + `node + 文件名` 快速调试：
```bash
node src/0501-test.js
```

### VS Code 断点调试（推荐）
1. 安装 Node.js
2. 在 VS Code 中打开项目
3. 按 `F5` 或点击左侧「运行和调试」→ 创建 `launch.json`
4. 选择 "Node.js" 调试配置
5. 在代码行号左侧点击圆点设置断点
6. 按 `F5` 开始调试，可以查看变量、调用栈等

### 浏览器调试（如果涉及 DOM）
把代码放到 HTML 文件中：
```html
<script src="src/0501-test.js"></script>
```
在浏览器打开，按 `F12` 打开开发者工具，在 **Sources** 面板设置断点调试。