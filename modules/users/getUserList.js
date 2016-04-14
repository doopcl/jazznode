exports.module = {
    utils:require('../../utils.js').utils,
    callback:null,
    query:null,
    postData:null,
    excute:function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { this.callback = callback; }

        this.utils.excuteMySqlQuery('SELECT * FROM nodejs_users',function on(err,result){
            if (err) {
                console.log('[Mysql Error]please check querystring!');
                exports.module.callback([],1010,'[Mysql Error]please check querystring!');
                return;
            }
            exports.module.callback(result);
        });
    }
    //分割线，以上成员为module的必要成员，每个module都必须存在
};