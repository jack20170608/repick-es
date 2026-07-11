# CLAUDE.md - 项目规范

## 文档命名与目录规则

### 序号规则
- 所有文档文件使用 **2位数序号** 命名
- 格式：`XX-文件名.md`（例如：`01-intro.md`, `02-guide.md`）
- 序号连续递增：01, 02, 03, 04...

### 目录规则
- 文档存放于 `docs/` 目录
- 按内容分类使用子目录，格式：`XX-分类名`
- 例如：
  - `docs/01-es5/` - JavaScript ES5 相关文档
  - `docs/02-es6/` - JavaScript ES6 相关文档
  - `docs/03-node/` - Node.js 相关文档
  - `docs/04-react/` - React 相关文档

### 文档编号规则
1. 每个子目录内的文档独立编号（从01开始）
2. 创建新文档时，序号取该目录下最大序号 + 1
3. 示例：
   ```
   docs/01-es5/
   ├── 01-javascript-debugging-guide.md
   ├── 02-javascript-prototype.md
   └── 03-vscode-shortcuts.md    ← 新文档用 03

   docs/02-es6/
   ├── 01-es6-new-features.md    ← 新目录从 01 开始
   └── 02-promises.md
   ```

### 创建新分类目录
1. 先查看现有分类目录序号
2. 使用下一个序号创建新目录（如已有 01, 02，则新建 03）
3. 目录内文档从 01 开始编号