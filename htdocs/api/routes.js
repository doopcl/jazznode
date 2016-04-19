exports.routes = {
    'users':{
        'type':'cgi',
        'actions':{
            'info':'controllers/users/getuserinfo.js',
            'list':'controllers/users/getuserlist.js'
        }
    }
}

/*
    1.http://127.0.0.1:8086/
    2.http://127.0.0.1:8086/helloworld/
*/