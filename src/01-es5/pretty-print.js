/**
 * 漂亮地打印对象的所有属性
 * @param {any} obj - 要打印的对象
 * @param {string|object} options - 标题或选项对象
 * @param {string} options.title - 标题
 * @param {boolean} options.showJson - 是否显示 JSON 格式，默认 false
 * @param {boolean} options.showProperties - 是否显示属性列表，默认 false
 * @example
 * prettyPrint(obj, 'Title')
 * prettyPrint(obj, { title: 'Title', showJson: true })
 */
function prettyPrint(obj, options = {}) {
    // 支持旧写法: prettyPrint(obj, 'title')
    let title, showJson = false, showProperties = false;
    if (typeof options === 'string') {
        title = options;
    } else if (options && typeof options === 'object') {
        title = options.title;
        showJson = options.showJson ?? false;
        showProperties = options.showProperties ?? false;
    }

    // 如果有标题，先打印标题
    if (title) {
        console.log(`\n========== ${title} ==========`);
    }

    // 使用 util.inspect 深度展开打印
    const util = require('util');
    console.log(util.inspect(obj, {
        showHidden: false,      // 不显示不可枚举属性
        depth: null,            // 无限深度展开
        compact: false          // 不压缩，多行显示
    }));

    // 如果是对象，可选打印 JSON 格式
    if (showJson && obj && typeof obj === 'object') {
        console.log('\n--- JSON format ---');
        console.log(JSON.stringify(obj, null, 2));
    }

    // 可选打印属性列表
    if (showProperties && obj && typeof obj === 'object') {
        console.log('\n--- Properties list ---');
        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
            const value = obj[key];
            const type = typeof value;
            console.log(`  ${index + 1}. ${key}: ${type === 'object' ? '{...}' : value}`);
        });
        console.log(`\nTotal: ${keys.length} properties`);
    }
}

// 测试
if (require.main === module) {
    const testObj = {
        name: 'Tom',
        age: 25,
        hobbies: ['coding', 'reading'],
        address: {
            city: 'Beijing',
            district: 'Haidian'
        }
    };

    // 两种调用方式都支持
    prettyPrint(testObj, { title: 'Test Object', showJson: true, showProperties: true });

    // 也可以用字符串作为标题
    // prettyPrint(testObj, 'Simple Title');
}

module.exports = { prettyPrint };