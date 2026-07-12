// 回调地狱示例：多层嵌套的异步操作
// 场景：获取用户 → 获取订单 → 获取订单详情

// 模拟异步函数
function fetchUser(userId, callback) {
  setTimeout(() => {
    if (userId === 1) {
      callback(null, { id: 1, name: '张三' });
    } else {
      callback(new Error('用户不存在'));
    }
  }, 100);
}

function fetchOrders(userId, callback) {
  setTimeout(() => {
    if (userId === 1) {
      callback(null, [
        { id: 101, userId: 1, total: 100 },
        { id: 102, userId: 1, total: 200 }
      ]);
    } else {
      callback(new Error('订单不存在'));
    }
  }, 100);
}

function fetchOrderDetail(orderId, callback) {
  setTimeout(() => {
    if (orderId === 101) {
      callback(null, {
        id: 101,
        items: [
          { product: 'iPhone', price: 100 },
          { product: '壳', price: 20 }
        ]
      });
    } else {
      callback(new Error('订单详情不存在'));
    }
  }, 100);
}

// 回调地狱：层层嵌套，难维护
fetchUser(1, function(err, user) {
  if (err) {
    console.error('获取用户失败:', err);
    return;
  }

  console.log('获取到用户:', user.name);

  fetchOrders(user.id, function(err, orders) {
    if (err) {
      console.error('获取订单失败:', err);
      return;
    }

    console.log('获取到订单:', orders.length, '个');

    fetchOrderDetail(orders[0].id, function(err, detail) {
      if (err) {
        console.error('获取订单详情失败:', err);
        return;
      }

      console.log('订单详情:', detail);
      console.log('商品列表:', detail.items);

      // 只有在这里才能做最终处理...
    });
  });
});