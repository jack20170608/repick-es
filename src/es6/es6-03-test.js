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

