# Promise 发展历史

## 回调地狱时代（ES5 以前）

```javascript
fetchData(function(a) {
  processA(a, function(b) {
    processB(b, function(c) {
      processC(c, function(d) {
        // 地狱...
      });
    });
  });
});
```

**问题**：嵌套深、难维护、错误处理分散

---

## Promise/A+ 规范诞生（2008-2013）

- **2008**: CommonJS 社区提出 Promise/A 规范
- **2011**: jQuery 提出 `$.Deferred`
- **2012**: **Promise/A+ 规范**正式发布（社区共识）

---

## ES6 官方支持（2015）

```javascript
// ES6 原生 Promise
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

同时诞生了 **async/await** 的基础

---

## async/await（ES2017）

```javascript
// 更优雅的写法
async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

---

## Promise 方法扩展

| 方法 | 简介 |
|-----|------|
| `Promise.all()` | 并行执行，全部完成 |
| `Promise.race()` | 谁先完成用谁 |
| `Promise.allSettled()` | 等全部完成（不论成功/失败）ES2020 |
| `Promise.any()` | 任意一个成功即可 ES2021 |

---

## 现状

- 现代 JS **必备**技能
- 几乎所有新 API 都返回 Promise（fetch、File System Access API 等）
- async/await 成为主流写法