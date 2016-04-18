exports.routes = {
    '':{
        'type':'static',
        'module':{
            'default':'static/index.html',//保留字段
            'index':'static/index.html',
            'images':'static/images.html',
            'favicon.ico':'static/favicon.ico'
        }
    },
    'cgipage':{
        'type':'cgi',
        'module':{
            'default':'modules/cgipage/samples.js',
            'samples':'modules/cgipage/samples.js',
            'samples2':'modules/cgipage/samples2.js'
        }
    },
    'users':{
        'type':'cgi',
        'module':{
            'info':'modules/users/getuserinfo.js',
            'list':'modules/users/getuserlist.js'
        }
    },
    'assets':{
        'type':'static',
        'module':{},
        'restrict':false //适用于type=static的路由类型（对静态资源请求），当该设置为false时，不会校验当前请求的module是否在module列表中
    }
}

/*
    1.http://127.0.0.1:8086/
    2.http://127.0.0.1:8086/helloworld/
*/