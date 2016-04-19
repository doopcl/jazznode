exports.utils = {
    //根据pathname获得js文件物理地址
    getDirectoryPath : function on (pathname) {
       var path = require('path');
       return path.join(__dirname, pathname);
    },
    //根据传入的sql语句查询数据库，并返回结果
    excuteMySqlQuery : function on (query,callback) {
        var mysql = require('mysql');
        //创建一个connection
        var connection = mysql.createConnection({     
            host     : 'localhost',     //主机
            user     : 'doopcl',        //MySQL认证用户名
            password : '123123',        //MySQL认证用户密码
            port: '3306',               //端口号
            database: 'nodejs',
        });

        connection.connect(function(err){
            if (err) { callback(err,null); return;}
            console.log('[connection connect]  succeed!');
        });
        //执行SQL语句
        connection.query(query, function(err, result) {
            if (err) { callback(err,null); return;}

            callback(err,result);
        });
        //关闭connection
        connection.end(function(err){
            if (err) { 
                console.log('[connection end] error!'); 
                console.log(err); 
                return;
            }
            console.log('[connection end] succeed!');
        });
    },
    //从指定文件中读取字符串
    getStrFromFile : function on(pathname,callback) {
        var str = '';
        var fs = require('fs');
        fs.readFile(this.getDirectoryPath(pathname), function on(err, buffer) {
            if (err) {
                if (callback) { callback(null, err); };
                return;
            }
            str = buffer.toString('utf8', 0, buffer.length);
            if (callback) { callback(str, err); };
        });
    },
    templateRender : function on(tempName,renderData) {
        var artT = require('art-template');
        return artT(this.getDirectoryPath(tempName),renderData);
    }
};




