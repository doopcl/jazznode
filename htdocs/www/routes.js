exports.routes = {
    '':{
        'type':'static',
        'actions':{
            'default':'static/index.html',//保留字段
            'index':'static/index.html',
            'favicon.ico':'static/favicon.ico'
        }
    },
    'cgipage':{
        'type':'cgi',
        'actions':{
            'default':'controllers/cgipage/samples.js',
            'samples':'controllers/cgipage/samples.js',
            'samples2':'controllers/cgipage/samples2.js'
        }
    },
    'users':{
        'type':'cgi',
        'actions':{
            'info':'controllers/users/getuserinfo.js',
            'list':'controllers/users/getuserlist.js'
        }
    },
    'assets':{
        'type':'static',
        'actions':{},
        'restrict':false //适用于type=static的路由类型（对静态资源请求），当该设置为false时，不会校验当前请求的action是否在actions列表中
    }
}

/*
    1.http://127.0.0.1:8086/
    2.http://127.0.0.1:8086/helloworld/
*/