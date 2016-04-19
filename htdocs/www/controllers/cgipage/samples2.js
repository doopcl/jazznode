exports.module = {
    callback:null,
    query:null,
    postData:null,
    cookies:null,
    excute:function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { this.callback = callback; }

        this.callback('Sample2 的代码是最简化的module代码，已包含的所有成员都是必要成员，如果缺少会造成功能问题!请各位看官知悉哟!');
    }
    //分割线，以上成员为module的必要成员，每个module都必须存在
};