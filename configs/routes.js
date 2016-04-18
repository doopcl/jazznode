exports.routes = {
    '':{
        'type':'static',
        'module':{
            'default':'demo/static/index.html',//保留字段
            'index':'demo/static/index.html',
            'favicon.ico':'demo/static/favicon.ico'
        }
    },
    'cgipage':{
        'type':'cgi',
        'module':{
            'default':'demo/modules/cgipage/samples.js',
            'samples':'demo/modules/cgipage/samples.js',
            'samples2':'demo/modules/cgipage/samples2.js'
        }
    },
    'users':{
        'type':'cgi',
        'module':{
            'info':'demo/modules/users/getuserinfo.js',
            'list':'demo/modules/users/getuserlist.js'
        }
    },
    'demo_assets':{
        'type':'static',
        'module':{},
        'restrict':false //适用于type=static的路由类型（对静态资源请求），当该设置为false时，不会校验当前请求的module是否在module列表中
    }
}

/*
    1.http://127.0.0.1:8086/
    2.http://127.0.0.1:8086/helloworld/
*/