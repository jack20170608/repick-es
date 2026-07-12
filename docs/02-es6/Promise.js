// 极简版 Promise 实现
class MiniPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    thishandlers = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.runHandlers();
    };

    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.runHandlers();
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MiniPromise((resolve, reject) => {
      const handler = () => {
        try {
          const cb = this.state === 'fulfilled' ? onFulfilled : onRejected;
          if (typeof cb === 'function') {
            const result = cb(this.value);
            resolve(result);
          } else {
            // 没有回调，沿着链条传递
            if (this.state === 'fulfilled') {
              resolve(this.value);
            } else {
              reject(this.value);
            }
          }
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === 'pending') {
        thishandlers.push(handler);
      } else {
        // 已经 resolved/rejected，异步执行
        setTimeout(handler, 0);
      }
    });
  }

  runHandlers() {
    // 异步执行所有等待的回调
    this.handlers.forEach(handler => {
      setTimeout(handler, 0);
    });
    this.handlers = [];
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      value => {
        onFinally();
        return value;
      },
      reason => {
        onFinally();
        throw reason;
      }
    );
  }
}
