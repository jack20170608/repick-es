// TypeScript Symbol 实战案例

// ========================
// 1. 基本 Symbol
// ========================
console.log('=== 1. 基本 Symbol ===');

const sym1: symbol = Symbol();
const sym2: symbol = Symbol('my-symbol');

console.log('sym1:', sym1);
console.log('sym2:', sym2);
console.log('sym2.toString():', sym2.toString());

// ========================
// 2. Symbol 作为对象属性
// ========================
console.log('\n=== 2. Symbol 作为对象属性 ===');

const nameKey: symbol = Symbol('name');
const ageKey: symbol = Symbol('age');

const userObj = {
  [nameKey]: 'Tom',
  [ageKey]: 25,
  city: 'Beijing'
};

console.log('userObj[nameKey]:', userObj[nameKey]);
console.log('userObj[ageKey]:', userObj[ageKey]);
console.log('userObj.city:', userObj.city);

// ========================
// 3. Symbol 不可枚举
// ========================
console.log('\n=== 3. Symbol 不可枚举 ===');

const secret: symbol = Symbol('secret');
const obj = {
  name: 'Tom',
  [secret]: 'hidden'
};

console.log('Object.keys:', Object.keys(obj));        // ['name']
console.log('Object.values:', Object.values(obj));    // ['Tom']
console.log('getOwnPropertySymbols:', Object.getOwnPropertySymbols(obj));

// ========================
// 4. Symbol.for 全局共享
// ========================
console.log('\n=== 4. Symbol.for 全局共享 ===');

const s1: symbol = Symbol.for('global-key');
const s2: symbol = Symbol.for('global-key');

console.log('s1 === s2:', s1 === s2);
console.log('Symbol.keyFor(s1):', Symbol.keyFor(s1));

// ========================
// 5. 内置 Symbol
// ========================
console.log('\n=== 5. 内置 Symbol ===');

// Symbol.iterator
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
console.log('iterator.next():', iterator.next());

// Symbol.toStringTag
const customObj = {
  [Symbol.toStringTag]: 'MyObject'
};
console.log('toString:', customObj.toString());

// ========================
// 6. 私有属性实现
// ========================
console.log('\n=== 6. 私有属性实现 ===');

// 定义模块内的私有 Symbol
const _privateData = Symbol('privateData');

class UserClass {
  [_privateData] = '私有数据';
  publicName = 'Tom';

  getSecret(): string {
    return this[_privateData];
  }
}

const userInstance = new UserClass();
console.log('userInstance.publicName:', userInstance.publicName);
console.log('userInstance.getSecret():', userInstance.getSecret());

// ========================
// 7. 唯一常量
// ========================
console.log('\n=== 7. 唯一常量 ===');

const EVENT_CLICK: symbol = Symbol('click');
const EVENT_HOVER: symbol = Symbol('hover');
const EVENT_FOCUS: symbol = Symbol('focus');

function handleEvent(event: symbol): void {
  if (event === EVENT_CLICK) {
    console.log('处理点击事件');
  } else if (event === EVENT_HOVER) {
    console.log('处理悬停事件');
  } else if (event === EVENT_FOCUS) {
    console.log('处理聚焦事件');
  }
}

handleEvent(EVENT_CLICK);
handleEvent(EVENT_HOVER);

// ========================
// 8. 避免属性名冲突
// ========================
console.log('\n=== 8. 避免属性名冲突 ===');

const _toJSON = Symbol('toJSON');

const data = {
  name: 'Tom',
  age: 25,
  [_toJSON]() {
    return { name: '仅显示名字' };
  }
};

// 普通调用
console.log('data[_toJSON]():', data[_toJSON]());
// JSON.stringify 会忽略函数
console.log('JSON.stringify:', JSON.stringify(data));

// ========================
// 9. 自定义迭代器
// ========================
console.log('\n=== 9. 自定义迭代器 ===');

const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    return {
      next: () => {
        if (current <= this.to) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

console.log('for...of 遍历:');
for (const num of range) {
  console.log(`  ${num}`);
}

// ========================
// 10. Map 的 Symbol key
// ========================
console.log('\n=== 10. Map 的 Symbol key ===');

const symKey: symbol = Symbol('map-key');
const map = new Map();

map.set(symKey, 'Symbol 作为 Map 的 key');
map.set('string-key', '字符串作为 Map 的 key');

console.log('map.get(symKey):', map.get(symKey));
console.log('map.get("string-key"):', map.get('string-key'));

// ========================
// 11. 实战：缓存标记
// ========================
console.log('\n=== 11. 实战：缓存标记 ===');

const CACHE_VERSION: symbol = Symbol('version');
const CACHE_DATA: symbol = Symbol('data');

interface CacheBox {
  [CACHE_VERSION]: number;
  [CACHE_DATA]: any;
}

function createCache(data: any): CacheBox {
  return {
    [CACHE_VERSION]: Date.now(),
    [CACHE_DATA]: data
  };
}

const cache = createCache({ users: ['Tom', 'Jerry'] });
console.log('Cache version:', cache[CACHE_VERSION]);
console.log('Cache data:', cache[CACHE_DATA]);

// ========================
// 12. Symbol 类型数组
// ========================
console.log('\n=== 12. Symbol 类型数组 ===');

const symA: symbol = Symbol('a');
const symB: symbol = Symbol('b');
const syms: symbol[] = [symA, symB];

console.log('Symbol 数组:', syms);