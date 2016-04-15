exports.module = {
    utils:require('../../utils.js').utils,
    callback:null,
    query:null,
    postData:null,
    cookies:null,
    excute:function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { this.callback = callback; }

        this.callback('Good Bye,This is Module Speaking!');
    }
    //分割线，以上成员为module的必要成员，每个module都必须存在
};