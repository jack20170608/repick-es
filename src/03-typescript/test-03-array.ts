// TypeScript 数组实战案例

// ========================
// 1. 基本数组类型
// ========================
console.log('=== 1. 基本数组类型 ===');

const numbers2: number[] = [1, 2, 3, 4, 5];
const names2: string[] = ['Tom', 'Jerry', 'Bob'];
const booleans: boolean[] = [true, false, true];

console.log('数字数组:', numbers2);
console.log('字符串数组:', names2);
console.log('布尔数组:', booleans);

// ========================
// 2. Array 泛型方式
// ========================
console.log('\n=== 2. Array 泛型方式 ===');

const arr1: Array<number> = [10, 20, 30];
const arr2: Array<string> = ['a', 'b', 'c'];
const mixed1: (string | number | boolean)[] = ['aaa', 111, true, 222];
console.log('Array<number>:', arr1);
console.log('Array<string>:', arr2);
console.log('混合数组:', mixed1);

// ========================
// 3. 类型推导
// ========================
console.log('\n=== 3. 类型推导 ===');

const autoNumbers = [1, 2, 3];      // number[]
const autoStrings = ['a', 'b'];     // string[]
const autoMixed = [1, 'a', true];   // (string | number | boolean)[]

console.log('autoNumbers:', autoNumbers);
console.log('autoStrings:', autoStrings);
console.log('autoMixed:', autoMixed);

// ========================
// 4. 数组操作
// ========================
console.log('\n=== 4. 数组操作 ===');

const fruits: string[] = ['apple', 'banana'];
fruits.push('orange');       // 添加到末尾
fruits.unshift('grape');     // 添加到开头

console.log('添加后:', fruits);

fruits.pop();                // 删除末尾
fruits.shift();              // 删除开头
console.log('删除后:', fruits);

// ========================
// 5. 遍历数组
// ========================
console.log('\n=== 5. 遍历数组 ===');

const items: number[] = [10, 20, 30];

// for...of
console.log('for...of:');
for (const item of items) {
  console.log(`  ${item}`);
}

// forEach
console.log('forEach:');
items.forEach((item, index) => {
  console.log(`  ${index}: ${item}`);
});

// ========================
// 6. 只读数组
// ========================
console.log('\n=== 6. 只读数组 ===');

const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4);  // ❌ 错误
// readonlyArr[0] = 100; // ❌ 错误
console.log('只读数组:', readonlyArr);

// ReadonlyArray 方式
const readonlyArr2: ReadonlyArray<string> = ['a', 'b'];
console.log('ReadonlyArray:', readonlyArr2);

// ========================
// 7. 元组 Tuple
// ========================
console.log('\n=== 7. 元组 Tuple ===');

// 用户信息：[名字, 年龄, 是否VIP]
const user2: [string, number, boolean] = ['Tom', 25, true];
console.log('用户:', user2);
console.log('名字:', user2[0]);
console.log('年龄:', user2[1]);

// 解构
const [userName2, userAge, isVip] = user2;
console.log('解构:', userName2, userAge, isVip);

// 坐标
const point: [number, number] = [100, 200];
console.log('坐标:', point);

// ========================
// 8. 可选元组
// ========================
console.log('\n=== 8. 可选元组 ===');

const optional: [string, number, boolean?] = ['Tom', 25];
console.log('可选元组:', optional);
console.log('第三个元素:', optional[2]);  // undefined

// ========================
// 9. 联合类型数组
// ========================
console.log('\n=== 9. 联合类型数组 ===');

const mixed: (string | number)[] = [1, 'a', 2, 'b'];
console.log('混合数组:', mixed);

// ========================
// 10. 枚举数组
// ========================
console.log('\n=== 10. 枚举数组 ===');

enum Level {
  Low,
  Medium,
  High
}

const levels: Level[] = [Level.Low, Level.Medium];
console.log('等级数组:', levels);
console.log('Level[0]:', Level[0]);

// ========================
// 11. 函数返回数组
// ========================
console.log('\n=== 11. 函数返回数组 ===');

function getScores(): number[] {
  return [90, 85, 88];
}

function getUserInfo(): [string, number] {
  return ['Alice', 30];
}

console.log('分数:', getScores());
console.log('用户信息:', getUserInfo());

// ========================
// 12. 实用案例：学生管理系统
// ========================
console.log('\n=== 12. 实用案例：学生管理系统 ===');

interface Student {
  name: string;
  score: number;
}

// 学生列表
const students: Student[] = [
  { name: 'Tom', score: 90 },
  { name: 'Jerry', score: 85 },
  { name: 'Bob', score: 92 }
];

// 添加学生
students.push({ name: 'Alice', score: 88 });
console.log('所有学生:', students);

// 计算平均分
const total = students.reduce((sum, s) => sum + s.score, 0);
const average = total / students.length;
console.log('平均分:', average.toFixed(2));

// 筛选不及格
const failed = students.filter(s => s.score < 60);
console.log('不及格:', failed);

// 查找最高分
const topStudent = students.reduce((prev, curr) =>
  curr.score > prev.score ? curr : prev
);
console.log('最高分学生:', topStudent);

// ========================
// 13. 实战：购物车
// ========================
console.log('\n=== 13. 实战：购物车 ===');

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// 购物车
const cart: CartItem[] = [
  { product: { id: 1, name: 'iPhone', price: 6999 }, quantity: 1 },
  { product: { id: 2, name: 'AirPods', price: 999 }, quantity: 2 }
];

// 计算总价
const totalPrice = cart.reduce((sum, item) =>
  sum + item.product.price * item.quantity, 0
);
console.log('购物车总价:', totalPrice);

// 添加商品
const newProduct: Product = { id: 3, name: 'iPad', price: 4999 };
cart.push({ product: newProduct, quantity: 1 });
console.log('更新后购物车:', cart);
