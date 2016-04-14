exports.module = {
    utils:require('../../utils.js').utils,
    callback:null,
    query:null,
    postData:null,
    excute:function on(callback) {
        //可能存在另外一种写法是在外面对callback赋值，这里可以不传入，做判断的目的是为了兼容闭包样式的写法
        if (callback) { this.callback = callback; }
        var data = {
            title: 'JazzNode - The Easy Use Web Server For Node.js',
            buttonTitle:'点我请求api'
        };
        var html = this.utils.templateRender('/static/temp/tmp_samples',data);

        if (this.postData) {
            html += '<script> alert(\'' + this.postData['user'] + '\'); </script>';
        };
        exports.module.callback(html);
    },
    //分割线，以上成员为module的必要成员，每个module都必须存在
};