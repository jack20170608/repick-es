// 简单的令牌桶限流器
function* tokenBucket(maxTokens, refillRate) {
  let tokens = maxTokens;
  let lastTime = Date.now();

  while (true) {
    // 每次迭代都计算时间流逝，补充令牌
    const now = Date.now();
    const elapsed = (now - lastTime) / 1000; // 转换为秒
    tokens = Math.min(maxTokens, tokens + refillRate * elapsed);
    lastTime = now;

    // 消耗一个令牌
    if (tokens >= 1) {
      tokens--;
      yield { allowed: true, remaining: Math.floor(tokens) };
    } else {
      yield { allowed: false, remaining: 0 };
    }
  }
}

// 模拟请求（连续发送，无延迟）
const limiter = tokenBucket(3, 1); // 最多3个令牌，每秒补充1个
console.log('=== 连续请求（无延迟）===');
for (let i = 0; i < 10; i++) {
  const result = limiter.next().value;
  console.log(`请求${i + 1}:`, result.allowed ? '通过' : '拒绝',
    `(剩余: ${result.remaining})`);
}

// 模拟请求（每秒1个，演示真正的限流效果）
async function runWithDelay() {
  console.log('\n=== 每秒1个请求 ===');
  const limiter2 = tokenBucket(3, 1); // 每秒补充1个令牌

  for (let i = 0; i < 6; i++) {
    const result = limiter2.next().value;
    console.log(`请求${i + 1}:`, result.allowed ? '通过' : '拒绝',
      `(剩余: ${result.remaining.toFixed(2)})`);

    if (i < 5) await new Promise(r => setTimeout(r, 1000));
  }
}

runWithDelay();