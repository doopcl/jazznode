exports.module = {
    utils:require('../../utils.js').utils,
    callback:null,
    query:null,
    postData:null,
    cookies:null,
    excute:function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { this.callback = callback; }
        var data = {
            title: 'JazzNode - The Easy Use Web Server For Node.js',
            buttonTitle:'点我请求api'
        };
        var html = this.utils.templateRender('/static/temp/tmp_samples',data);

        if (this.query['upload'] == '1' && this.postData["resource"] != undefined) {
            var fs = require('fs');
            fs.rename(this.postData["resource"].path,this.utils.getDirectoryPath('upload/' + this.postData["resource"].name),function on(err){
                if (err) {
                    console.log(err);
                } else {
                    html += '<script> alert(\'upload success\'); </script>';
                }
                exports.module.callback(html);
            });
            return;
        }
        
        if (this.query['alert'] == '1' && this.postData) {
            html += '<script>alert(\'' + this.postData['user'] + '\');</script>';
        };

        if (this.query['cookieset'] == '1') {
            this.cookies.set( "user_name", "jazzcai");
        }

        if (this.query['cookieget'] == '1') {
            var username = this.cookies.get( "user_name" );
            html += '<script>alert(\'' + username + '\');</script>';
        }

        this.callback(html);
    },
    //分割线，以上成员为module的必要成员，每个module都必须存在
};