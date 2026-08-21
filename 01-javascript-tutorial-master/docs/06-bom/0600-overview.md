# 浏览器对象模型（BOM）

浏览器对象模型（Browser Object Model，简称 BOM）是 JavaScript 与浏览器窗口进行交互的 API 接口集合。与 DOM（文档对象模型）不同，BOM 主要处理浏览器本身的功能，而不是页面内容。

**重要提示**：BOM 不是 ECMAScript 标准的一部分，而是由各浏览器厂商各自实现的，因此存在一定的兼容性问题。在实际开发中，需要注意不同浏览器之间的差异。

## BOM 与 DOM 的区别

| 特性 | DOM | BOM |
|------|-----|-----|
| 全称 | Document Object Model | Browser Object Model |
| 作用 | 操作网页文档内容 | 控制浏览器窗口 |
| 标准 | W3C 国际标准 | 各浏览器厂商自定义 |
| 核心对象 | document | window |

## BOM 核心对象一览

```
window
├── document      # 文档对象（也属于 DOM）
├── navigator     # 浏览器信息
├── screen        # 屏幕信息
├── location      # URL 信息
├── history       # 浏览历史
├── frames        # 框架集合
├── XMLHttpRequest # Ajax 请求
├── Storage       # 本地存储
│   ├── localStorage
│   └── sessionStorage
├── IndexedDB     # 浏览器内置数据库
├── Web Worker    # 后台 Worker 线程
└── console       # 控制台输出
```

## window 对象

`window` 对象是 BOM 的核心，代表浏览器的窗口。所有全局变量和函数都是 `window` 对象的属性和方法。

```javascript
// 全局变量实际上是 window 的属性
var name = 'Tom';
console.log(window.name); // 'Tom'

// 全局函数实际上是 window 的方法
function sayHello() {
  console.log('Hello');
}
window.sayHello(); // 'Hello'
```

### 常用属性和方法

- `window.innerHeight` / `window.innerWidth`：窗口内部高度和宽度
- `window.outerHeight` / `window.outerWidth`：窗口外部高度和宽度
- `window.screenX` / `window.screenY`：窗口相对于屏幕的坐标
- `window.open()` / `window.close()`：打开/关闭窗口
- `window.scrollTo()` / `window.scrollBy()`：滚动页面

### 定时器

```javascript
// 延迟执行
const timeoutId = setTimeout(() => {
  console.log('3秒后执行');
}, 3000);

// 取消延迟执行
clearTimeout(timeoutId);

// 循环执行
const intervalId = setInterval(() => {
  console.log('每2秒执行一次');
}, 2000);

// 取消循环执行
clearInterval(intervalId);
```

## navigator 对象

`navigator` 对象包含浏览器相关的信息，如浏览器名称、版本、操作系统等。

```javascript
// 浏览器名称和版本
console.log(navigator.appName);    // 'Netscape'
console.log(navigator.appVersion); // '5.0 (Windows NT 10.0; Win64; x64)...'

// 用户代理字符串
console.log(navigator.userAgent);

// 是否支持 Cookie
console.log(navigator.cookieEnabled);

// 使用的语言
console.log(navigator.language);   // 'zh-CN'

// 平台信息
console.log(navigator.platform);   // 'Win32'
```

**注意**：`navigator` 对象的属性容易被伪装，生产环境中不建议依赖这些属性做重要判断。

## screen 对象

`screen` 对象包含用户屏幕的相关信息。

```javascript
console.log(screen.width);        // 屏幕宽度
console.log(screen.height);       // 屏幕高度
console.log(screen.availWidth);   // 可用宽度（排除任务栏）
console.log(screen.availHeight);  // 可用高度
console.log(screen.colorDepth);   // 颜色深度
```

## location 对象

`location` 对象包含当前 URL 的相关信息，是最常用的 BOM 对象之一。

```javascript
// 获取 URL 各个部分
console.log(location.href);        // 完整 URL
console.log(location.protocol);    // 'https:'
console.log(location.host);        // 'example.com:8080'
console.log(location.hostname);    // 'example.com'
console.log(location.port);        // '8080'
console.log(location.pathname);    // '/path/page'
console.log(location.search);      // '?id=123'
console.log(location.hash);        // '#section'

// 常用方法
location.reload();        // 重新加载页面
location.assign('url');   // 跳转到指定 URL
location.replace('url');  // 替换当前页面（无历史记录）
```

### URLSearchParams

```javascript
// 解析查询字符串
const params = new URLSearchParams('?name=Tom&age=25');
console.log(params.get('name')); // 'Tom'
console.log(params.get('age'));  // '25'

// 操作查询参数
params.set('age', '26');
params.append('city', 'Beijing');
console.log(params.toString()); // 'name=Tom&age=26&city=Beijing'
```

## history 对象

`history` 对象包含浏览器的历史记录。

```javascript
// 页面导航
history.back();     // 后退一页
history.forward();  // 前进一页
history.go(-1);     // 后退指定页数
history.go(1);      // 前进指定页数

// 历史记录数量
console.log(history.length);

// HTML5 新增 API（需要同源）
history.pushState({}, '', '/new-page');   // 添加新历史记录
history.replaceState({}, '', '/modify');  // 修改当前历史记录

// 监听 popstate 事件
window.addEventListener('popstate', (event) => {
  console.log('URL 变化了', event.state);
});
```

## Storage 接口

Storage 接口用于在浏览器中存储键值对数据，与 Cookie 相比，Storage 容量更大且不会自动发送给服务器。

### localStorage

- 持久化存储，除非手动删除，否则永不过期
- 同一域名的所有页面共享数据
- 存储容量通常为 5MB 左右

```javascript
// 存储数据
localStorage.setItem('name', 'Tom');
localStorage.setItem('age', '25');

// 读取数据
console.log(localStorage.getItem('name')); // 'Tom'

// 删除数据
localStorage.removeItem('name');
localStorage.clear(); // 清空所有数据

// 遍历所有数据
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

### sessionStorage

- 会话级存储，关闭页面后数据消失
- 同一页面的不同窗口（tab）不共享数据

```javascript
sessionStorage.setItem('tempData', 'some value');
console.log(sessionStorage.getItem('tempData'));
sessionStorage.removeItem('tempData');
```

### 注意事项

1. Storage 只能存储字符串，存储对象需要 JSON 序列化
2. 同步 API，大量数据操作可能影响性能
3. 同一域名下子域名共享 Storage（可通过 document.domain 调整）
4. 隐私模式下（Firefox 的隐私浏览、 Safari 的无痕模式）可能不可用

## XMLHttpRequest

`XMLHttpRequest` 是浏览器提供的原生 Ajax 实现，用于在不刷新页面的情况下与服务器通信。

### 基本用法

```javascript
const xhr = new XMLHttpRequest();

// 监听状态变化
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error('请求失败', xhr.status);
    }
  }
};

// 配置请求
xhr.open('GET', '/api/data', true); // true 表示异步

// 发送请求
xhr.send();
```

### POST 请求

```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', '/api/submit', true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  }
};

xhr.send(JSON.stringify({ name: 'Tom', age: 25 }));
```

### 现代化的 Fetch API

现代浏览器推荐使用 `Fetch API`，它更加简洁和现代化：

```javascript
// GET 请求
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST 请求
fetch('/api/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Tom', age: 25 })
})
  .then(response => response.json())
  .then(data => console.log(data));

// Async/Await 写法
async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## IndexedDB

IndexedDB 是浏览器内置的 NoSQL 数据库系统，适合存储大量结构化数据。

### 基本操作

```javascript
// 打开数据库
const request = indexedDB.open('myDatabase', 1);

request.onerror = (event) => {
  console.error('数据库打开失败', event.target.error);
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('数据库打开成功', db);
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  // 创建对象仓库
  if (!db.objectStoreNames.contains('users')) {
    const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('name', 'name', { unique: false });
  }
};
```

### 数据操作

```javascript
// 添加数据
function addUser(db, user) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.add(user);
  
  request.onsuccess = () => console.log('添加成功');
}

// 读取数据
function getUser(db, id) {
  const transaction = db.transaction(['users'], 'readonly');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.get(id);
  
  request.onsuccess = () => console.log(request.result);
}

// 更新数据
function updateUser(db, user) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');
  objectStore.put(user);
}

// 删除数据
function deleteUser(db, id) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');
  objectStore.delete(id);
}
```

### 注意事项

- 异步 API，采用事件回调或 Promise 写法
- 存储容量通常较大（至少 50MB）
- 支持索引，可高效查询
- 同一域名下所有页面共享数据库

## Web Worker

Web Worker 允许在主线程之外创建后台线程，用于执行耗时任务，避免阻塞页面。

### 基本用法

```javascript
// main.js - 主线程
const worker = new Worker('worker.js');

// 发送消息给 Worker
worker.postMessage({ type: 'start', data: 1000000 });

// 接收 Worker 消息
worker.onmessage = function(event) {
  console.log('计算结果:', event.data);
};

// 错误处理
worker.onerror = function(event) {
  console.error('Worker 错误:', event.message);
};

// 终止 Worker
worker.terminate();
```

```javascript
// worker.js - Worker 线程
// 接收主线程消息
self.onmessage = function(event) {
  const num = event.data.data;
  
  // 执行耗时计算
  let result = 0;
  for (let i = 0; i < num; i++) {
    result += i;
  }
  
  // 发送结果给主线程
  self.postMessage(result);
};
```

### 专用 Worker 与共享 Worker

```javascript
// 专用 Worker（只属于创建它的页面）
const dedicatedWorker = new Worker('worker.js');

// 共享 Worker（可被多个页面共享）
const sharedWorker = new SharedWorker('shared-worker.js');
```

### 注意事项

- Worker 线程中无法访问 DOM
- Worker 线程中无法访问 window、document
- 主线程和 Worker 线程通过消息传递通信
- Worker 线程中可以使用 importScripts() 加载脚本

## 浏览器安全机制

### 同源策略

同源策略是浏览器最基本的安全机制，限制来自不同源的文档或脚本与当前源的文档交互。

**同源**：协议、域名、端口三者完全相同。

```javascript
// 以下都与 http://example.com 不同源
https://example.com     // 协议不同
http://www.example.com  // 域名不同
http://example.com:8080 // 端口不同
```

### CORS（跨域资源共享）

CORS 是 W3C 制定的跨域访问标准，允许服务器声明哪些来源可以访问其资源。

```javascript
// 简单请求（自动处理）
fetch('https://api.example.com/data', {
  credentials: 'include'  // 发送 Cookie
});

// 预检请求（非简单请求）
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Custom-Header': 'value'
  },
  body: JSON.stringify({ key: 'value' })
});
```

## 总结

BOM 提供了丰富的浏览器控制能力，是前端开发的基础知识。本章介绍的核心内容：

1. **window 对象**：浏览器窗口的全局对象
2. **navigator 对象**：获取浏览器信息
3. **location 对象**：操作 URL
4. **history 对象**：管理浏览历史
5. **Storage**：本地数据存储
6. **XMLHttpRequest / Fetch**：网络请求
7. **IndexedDB**：浏览器内置数据库
8. **Web Worker**：后台线程处理

掌握这些 API，能够实现单页应用、数据缓存、后台数据处理等常见功能。