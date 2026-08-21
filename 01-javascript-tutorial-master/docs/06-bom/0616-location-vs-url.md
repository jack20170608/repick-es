# Location 对象与 URL 对象的区别

在浏览器环境中，有两个用于处理 URL 的接口：`Location` 对象和 `URL` 对象。它们虽然功能相似，但定位和使用场景有所不同。

## 概念对比

| 特性 | Location 对象 | URL 对象 |
|-----|--------------|---------|
| 来源 | BOM（浏览器对象模型） | URL Standard（W3C 标准 API） |
| 访问方式 | `window.location` / `document.location` | `new URL(urlString)` |
| 作用范围 | 当前页面 URL | 任意 URL 字符串 |
| 可写性 | 可修改（跳转页面） | 只读（需创建新实例修改） |

## Location 对象

`Location` 对象是浏览器提供的原生对象，代表当前页面的 URL，并提供页面跳转功能。

### 获取方式

```javascript
// 两种方式等价
window.location
document.location
```

### 属性列表

| 属性 | 说明 | 示例值 |
|------|------|-------|
| `href` | 完整 URL | `https://example.com:8080/path/page?id=123#section` |
| `protocol` | 协议 | `https:` |
| `host` | 主机名和端口 | `example.com:8080` |
| `hostname` | 主机名 | `example.com` |
| `port` | 端口号 | `8080` |
| `pathname` | 路径 | `/path/page` |
| `search` | 查询字符串 | `?id=123` |
| `hash` | 片段标识 | `#section` |
| `username` | 用户名 | `user` |
| `password` | 密码 | `pass` |
| `origin` | 协议+主机名+端口 | `https://example.com:8080` |

### 示例

```javascript
// 假设当前 URL 为
// https://user:pass@example.com:8080/path/page?id=123#section

location.href        // 'https://user:pass@example.com:8080/path/page?id=123#section'
location.protocol    // 'https:'
location.host        // 'example.com:8080'
location.hostname    // 'example.com'
location.port        // '8080'
location.pathname    // '/path/page'
location.search      // '?id=123'
location.hash        // '#section'
location.username    // 'user'
location.password    // 'pass'
location.origin      // 'https://user:pass@example.com:8080'
```

### 方法（页面跳转）

| 方法 | 说明 |
|------|------|
| `assign(url)` | 加载指定 URL（会记录到历史记录） |
| `replace(url)` | 替换当前页面（不记录到历史记录） |
| `reload(force)` | 重新加载当前页面 |

```javascript
// 跳转到指定页面
location.assign('https://example.com/new-page');
location.href = 'https://example.com/new-page'; // 效果相同

// 替换当前页面（不产生历史记录）
location.replace('https://example.com/new-page');

// 重新加载
location.reload();        // 可能有缓存
location.reload(true);    // 强制从服务器加载
```

---

## URL 对象

`URL` 对象是 URL Standard 定义的构造函数，用于解析、构建和操作 URL 字符串。与 Location 不同，它可以处理任意 URL，而不限于当前页面。

### 创建方式

```javascript
// 通过完整的 URL 字符串创建
const url = new URL('https://example.com:8080/path/page?id=123#section');

// 也可以基于当前页面创建（和 Location 等价）
const currentUrl = new URL(window.location.href);

// 基于 base URL 创建（相对路径）
const baseUrl = new URL('/path/page', 'https://example.com');
// 结果: https://example.com/path/page
```

### 属性列表

`URL` 对象的属性与 Location 完全一致：

| 属性 | 说明 | 示例值 |
|------|------|-------|
| `href` | 完整 URL | `https://example.com:8080/path/page?id=123#section` |
| `protocol` | 协议 | `https:` |
| `host` | 主机名和端口 | `example.com:8080` |
| `hostname` | 主机名 | `example.com` |
| `port` | 端口号 | `8080` |
| `pathname` | 路径 | `/path/page` |
| `search` | 查询字符串 | `?id=123` |
| `hash` | 片段标识 | `#section` |
| `username` | 用户名 | `user` |
| `password` | 密码 | `pass` |
| `origin` | 协议+主机名+端口 | `https://example.com:8080` |

### searchParams（特有功能）

`URL` 对象最强大的特性是 `searchParams` 属性，可以方便地操作查询参数：

```javascript
const url = new URL('https://example.com/search?q=javascript&page=1');

// 读取参数
url.searchParams.get('q');      // 'javascript'
url.searchParams.get('page');   // '1'

// 检查参数是否存在
url.searchParams.has('q');      // true

// 获取所有参数名
[...url.searchParams.keys()];   // ['q', 'page']

// 获取所有参数值
[...url.searchParams.values()]; // ['javascript', '1']

// 遍历所有参数
url.searchParams.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 修改参数
url.searchParams.set('page', '2');
url.searchParams.get('page');   // '2'

// 添加参数（不删除已有的）
url.searchParams.append('lang', 'zh');
url.searchParams.toString();    // 'q=javascript&page=2&lang=zh'

// 删除参数
url.searchParams.delete('page');

// 清空所有参数
url.searchParams = new URLSearchParams();

// 最终结果
url.href;
// 'https://example.com/search?q=javascript&lang=zh'
```

### 构建新 URL

`URL` 对象修改属性后，会生成新的 URL 字符串：

```javascript
const url = new URL('https://example.com/original');

// 修改属性
url.pathname = '/new-path';
url.searchParams.set('id', '123');

console.log(url.href);
// 'https://example.com/new-path?id=123'
```

---

## 核心差异总结

| 差异点 | Location | URL |
|-------|----------|-----|
| **页面跳转** | ✅ 支持（assign/replace） | ❌ 不支持 |
| **操作查询参数** | ❌ 只能整体赋值 | ✅ 支持增删改查 |
| **处理任意 URL** | ❌ 只能处理当前页面 | ✅ 可处理任意字符串 |
| **创建实例** | 无需创建（已存在） | 需 `new URL()` |
| **修改 effect** | 改变后页面跳转 | 生成新的 URL 字符串 |

---

## 使用场景

### Location 适用场景

```javascript
// 1. 页面跳转
function redirectTo(url) {
  location.href = url;
}

// 2. 重新加载
function refresh() {
  location.reload();
}

// 3. 获取当前页面的 URL 信息
const currentPage = location.pathname;
```

### URL 适用场景

```javascript
// 1. 解析 URL 参数
const params = new URL(location.href).searchParams;
const userId = params.get('userId');

// 2. 构建 URL（更推荐 URL 或 URLSearchParams）
function buildUrl(base, params) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.href;
}

// 3. 操作任意 URL 字符串
const apiUrl = new URL('https://api.example.com/users');
apiUrl.searchParams.set('page', '1');
apiUrl.searchParams.set('limit', '10');
```

---

## 注意事项

1. **协议继承**：使用相对路径时需要注意基础 URL
   ```javascript
   const url = new URL('/path', 'https://example.com');
   // 结果: https://example.com/path
   ```

2. **查询字符串编码**：`searchParams` 自动处理编码
   ```javascript
   const url = new URL('?name=' + encodeURIComponent('张三'));
   const url2 = new URL('?name=张三'); // 同样正确
   ```

3. **URL 构造函数在 Node.js 中可用**：现代 Node.js 也支持 URL 类

---

## 总结

- **Location**：管理**当前页面**的 URL，负责页面跳转，操作整体
- **URL**：解析/操作**任意 URL** 字符串，擅长处理查询参数

两者属性相同，但 Location 更侧重页面导航，URL 更侧重 URL 字符串的解析与构建。