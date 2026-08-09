// TypeScript 基本类型示例

// 原始类型
const userName: string = 'Tom';
const age: number = 25;
const isStudent: boolean = true;

console.log('=== 原始类型 ===');
console.log(`姓名: ${userName}, 年龄: ${age}, 是学生: ${isStudent}`);

// 数组
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ['Tom', 'Jerry', 'Bob'];

console.log('\n=== 数组 ===');
console.log('数字数组:', numbers);
console.log('名字数组:', names);

// 对象
interface User {
  name: string;
  age: number;
  email?: string;  // 可选属性
}

const user: User = {
  name: 'Tom',
  age: 25
};

console.log('\n=== 对象 ===');
console.log('用户:', user);

// 函数
function add(a: number, b: number): number {
  return a + b;
}

console.log('\n=== 函数 ===');
console.log('1 + 2 =', add(1, 2));

// 类型别名
type ID = string | number;
const userId: ID = 'abc123';
const orderId: ID = 1001;

console.log('\n=== 类型别名 ===');
console.log('用户ID:', userId, '(string)');
console.log('订单ID:', orderId, '(number)');

// 泛型
function identity<T>(arg: T): T {
  return arg;
}

console.log('\n=== 泛型 ===');
console.log('identity<string>("hello"):', identity<string>('hello'));
console.log('identity<number>(42):', identity<number>(42));
console.log('identity("world"):', identity('world'));  // 类型推断

// 联合类型
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

console.log('\n=== 联合类型 ===');
printId('abc123');
printId(1001);

// 接口示例
interface Product {
  id: number;
  name: string;
  price: number;
}

const product: Product = {
  id: 1,
  name: 'Apple',
  price: 5.99
};

console.log('\n=== 接口 ===');
console.log('产品:', product);