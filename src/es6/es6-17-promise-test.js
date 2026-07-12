// Promise 对象的三种创建方式

// ============================================
// 方式一：new Promise() 手动创建
// ============================================
const p1 = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('成功啦！'); // 标记为成功
    } else {
      reject(new Error('失败啦！')); // 标记为失败
    }
  }, 100);
});

p1.then(value => console.log('p1:', value))
  .catch(err => console.error('p1:', err));


// ============================================
// 方式二：Promise.resolve() 快速创建成功状态
// ============================================
const p2 = Promise.resolve('直接成功');
// 等价于：
// new Promise(resolve => resolve('直接成功'))

p2.then(value => console.log('p2:', value));


// ============================================
// 方式三：Promise.reject() 快速创建失败状态
// ============================================
const p3 = Promise.reject(new Error('直接失败'));
// 等价于：
// new Promise((_, reject) => reject(new Error('直接失败')))

p3.catch(err => console.error('p3:', err.message));


// ============================================
// 常用场景示例
// ============================================

// 封装 setTimeout 为 Promise
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(ms), ms);
  });
}

delay(500).then(ms => console.log(`等待了 ${ms}ms`));

// 封装读取文件为 Promise (Node.js)
const fs = function() { return {} } /* 模拟：需要引入 fs 模块 */

/* 实际使用需要：const fs = require('fs'); */
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    // 实际使用：
    // fs.readFile(path, 'utf8', (err, data) => {
    //   err ? reject(err) : resolve(data);
    // });
    console.log('读取文件:', path);
    resolve('文件内容模拟');
  });
}

readFilePromise('./data.txt').then(console.log);