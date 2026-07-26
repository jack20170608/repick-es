// Promise 版本：多层异步操作
// 场景：获取用户 → 获取订单 → 获取订单详情

// 模拟异步函数（返回 Promise）
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 1) {
        resolve({ id: 1, name: '张三' });
      } else {
        reject(new Error('用户不存在'));
      }
    }, 100);
  });
}

function fetchOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 1) {
        resolve([
          { id: 101, userId: 1, total: 100 },
          { id: 102, userId: 1, total: 200 }
        ]);
      } else {
        reject(new Error('订单不存在'));
      }
    }, 100);
  });
}

function fetchOrderDetail(orderId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (orderId === 101) {
        resolve({
          id: 101,
          items: [
            { product: 'iPhone', price: 100 },
            { product: '壳', price: 20 }
          ]
        });
      } else {
        reject(new Error('订单详情不存在'));
      }
    }, 100);
  });
}

// Promise 链式调用：扁平化
fetchUser(1)
  .then(user => {
    console.log('获取到用户:', user.name);
    return fetchOrders(user.id);
  })
  .then(orders => {
    console.log('获取到订单:', orders.length, '个');
    return fetchOrderDetail(orders[0].id);
  })
  .then(detail => {
    console.log('订单详情:', detail);
    console.log('商品列表:', detail.items);
  })
  .catch(err => {
    console.error('出错啦:', err.message);
  });