var person = {
    name : '张三',
    describe : function(){
        return '姓名:' + this.name;
    }
}

console.log(`${person.describe()}`);

var p2 = {
    name : '李四'
}

p2.describe = person.describe;

console.log(`${p2.describe()}`);

function f() {
  return '姓名：'+ this.name;
}

var A = {
  name: '张三',
  describe: f
};

var B = {
  name: '李四',
  describe: f
};

A.describe() // "姓名：张三"
B.describe() // "姓名：李四"