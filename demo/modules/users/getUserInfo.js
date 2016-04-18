exports.module = {
    utils:require('../../../utils.js').utils,
    callback:null,
    query:null,
    postData:null,
    cookies:null,
    excute:function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { this.callback = callback; }

        if (!this.query['userid']) { 
            exports.module.callback('',1004,'缺少必要参数');
            return; 
        }

        var query_sql = 'SELECT * FROM nodejs_users WHERE user_id = "' + this.query['userid'] + '"';

        this.utils.excuteMySqlQuery(query_sql,function on(err,result){
            if (err) {
                console.log('[Mysql Error]please check querystring!');
                exports.module.callback([], 1010, '[Mysql Error]please check querystring!');
                return;
            }
            var responseModal = require('../../modals/responseModal.js').modal;
            responseModal.code = 0;
            responseModal.data = result;
            responseModal.errMsg = null;
            exports.module.callback(JSON.stringify(responseModal));
        });
    },
    //分割线，以上成员为module的必要成员，每个module都必须存在
};