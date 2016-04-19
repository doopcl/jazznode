exports.domains = {
    'localhost'://默认
    {
        dir:'htdocs/www/',
        route:'routes.js'
    },
    /*

    如何测试虚拟主机：
    
    修改个人电脑hosts，增加不同的域名，如 
    127.0.0.1  api.jazznode.cn
    127.0.0.1  www.jazznode.cn

    然后在virtualHost.js配置文件中增加格式类似以下的配置项
    
    'www.jazznode.cn':
    {
        dir:'htdocs/www/',
        route:'routes.js'
    },
    'api.jazznode.cn':
    {
        dir:'htdocs/api/',
        route:'routes.js'
    }

    之后再配置指定目录的routes.js，指向指定资源即可
    */
}