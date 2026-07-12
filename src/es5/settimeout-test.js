const st = setTimeout((num) => {
    console.log(`beat!! ${num}`)
}, 100, 1, 2, 3);


for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // 输出: 3, 3, 3 (var 没有块作用域)
}


for (let i = 0; i < 3; i++) {
    setTimeout((num) => console.log(num), 100, i); // 输出: 0, 1, 2
}
