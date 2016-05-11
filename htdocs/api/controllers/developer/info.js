var base = require('../../../../sys/baseaction.js');

exports.getInstance = function(){
    var instance = base.BaseAction();
    instance.excute = function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { instance.callback = callback; }

        var responseModal = require('../../modals/responseModal.js').modal;

        var userid = instance.query['userid'];
        var userName = instance.query['username'];

        if (!userid && !userName) {
            responseModal.code = 1004;
            responseModal.data = [];
            responseModal.errMsg = '缺少必要参数'
            instance.callback(JSON.stringify(responseModal));
            return;
        }

        var sqlQuery = "SELECT * FROM `dev_users` WHERE " + (userid ? "`userid`" : "`username`") + " = ?" ;
        var sqlParams = [userid ? userid : userName];

        var responseModal = require('../../modals/responseModal.js').modal;
        responseModal.code = 0;
        responseModal.data = [{"userid":1,"username":"admin","password":"55555555","telphone":"18011111111","email":"doopcl@126.com","address":"lixin No.29 xinqing","regtime":"2016-04-26T07:53:01.000Z"}];
        responseModal.errMsg = null;
        instance.callback(JSON.stringify(responseModal));

        /*  查询数据库代码示例

        instance.utils.excuteMySqlQuery(sqlQuery,sqlParams,function on(err,result){
            var responseModal = require('../../modals/responseModal.js').modal;
            if (err) {
                console.log(err);
                switch(err.code) {
                    default:
                        responseModal.code = 1006;
                        responseModal.data = [];
                        responseModal.errMsg = '未知查询错误'
                    break;
                }
                instance.callback(JSON.stringify(responseModal));
                return;
            }
            responseModal.code = 0;
            responseModal.data = result;
            responseModal.errMsg = null;
            instance.callback(JSON.stringify(responseModal));
        });

        */
    };
    instance.name = 'info'
    instance.utils = require('../../utils.js').utils
    return instance;
}