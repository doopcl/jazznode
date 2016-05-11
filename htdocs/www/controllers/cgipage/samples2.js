var BaseAction = require('../../../../sys/baseaction.js');

exports.getInstance = function(){
    var instance = BaseAction();
    instance.excute = function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { instance.callback = callback; }

        this.callback('Sample2 的代码是最简化的action代码!');
    };
    instance.name = ''
    return instance;
}