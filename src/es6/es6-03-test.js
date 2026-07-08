let obj = {
    p: ["Hello", { y: "World" }],
};

let {
    p,
    p: [x, { y }],
} = obj;

console.log(`${p}, x=${x}, y=${y}.`);

let obj2 = {
    name: "jack",
    hi: function () {
        console.log("hi");
    },
};

const node = {
    loc: {
        start: {
            line: 1,
            column: 5
        }
    }
};

let { loc, loc: { start }, loc: { start: { line } } } = node;

console.log(`${loc.start.column}`);
console.log(`start.line=${start.line}`);
console.log(`start.column=${start.column}`);
console.log(`line=${line}`);

let x1 = 100;

(console.log(x1));

var str = '中国';
console.log(`str's length is ${str.length}`);


var s = "吉";
// var s = "𠮷";
console.log(s.length);

const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;

let a = 5;
let b = 10;

function tag(s, v1, v2) {
  console.log(s[0]);
  console.log(s[1]);
  console.log(s[2]);
  console.log(v1);
  console.log(v2);

  return "OK";
}

tag`Hello ${ a + b } world ${ a * b}`;

let total = 30;
let msg = passthru`The total is ${total} (${total*1.05} with tax)`;

function passthru(literals) {
  let result = '';
  let i = 0;

  while (i < literals.length) {
    result += literals[i++];
    if (i < arguments.length) {
      result += arguments[i];
    }
  }

  return result;
}

console