//http server start

/*  
    新node环境下需要先安装以下插件
    npm install mime
    npm install art-template
    npm install formidable
    npm install cookies
*/

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require("querystring");
//开发工具类
var mime = require('mime');
var Cookies = require('cookies');
var dirpathHelper = require('path');

//虚拟host配置
var domains = require('./configs/virtualHost.js').domains;

var port = 8086;

var cluster = require('cluster');
var cpuCounts = require('os').cpus().length;

//子进程死亡计数器，如果死亡次数过多，则需要停止创建，并提示服务管理员检查程序
var clusterDeathCount = 0;

var createHttpServers = function on(){
    if (cluster.isMaster) {
        //创建工作进程
        for (var i = 0; i < cpuCounts; i++) {
            cluster.fork();
        };
        //出现死亡进程后
        cluster.on('death', function(worker) {
            console.log('worker ' + worker.pid + ' died');
            if (clusterDeathCount > 30) {
                console.log('too more death,please check Code');
                return;
            }
            clusterDeathCount++;
            cluster.fork();//重新开启新的进程
        });
    } else {
        // 创建服务器
        var httpServer = http.createServer();
        httpServer.on('request',requestHandle);
        httpServer.listen(port);
        // 控制台会输出以下信息
        console.log('JazzNode HTTP Server running at http://127.0.0.1:' + port);
    }
}

var requestHandle = function on(request, response) {
    console.log('HOST:' + request.headers.host);
    console.log('METHOD:' + request.method);
    // 解析请求，包括文件名
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    //如果没有命中指定的域名，则使用默认域名设置反馈 HTTP 1.0可能没有header，需要做处理
    var domainInfo = domains[request.headers.host] ? domains[request.headers.host] : domains['localhost'];
    // console.log('./' + domainInfo.dir + domainInfo.route);
    var routeInfo = getRouteInfo(pathname, require('./' + domainInfo.dir + domainInfo.route).routes);
    // console.log(routeInfo);
    switch(routeInfo.type){
        case 'error':
            var errInfo = require('./sys/httpErrorEntity.js').entity;
            errInfo.code = 1003;
            errInfo.errMsg = routeInfo.msg;
            errInfo.content = routeInfo;
            responseErr(errInfo,response);
        break;
        case 'static':
            //静态资源使用的fs.readFile，需要磁盘绝对地址，所以require path 库
            staticResponser(dirpathHelper.join(__dirname,domainInfo.dir + routeInfo.target), response);
        break;
        case 'cgi':
            cgiResponser('./' + domainInfo.dir + routeInfo.target, request, response);
        break;
    }
}

var getRouteInfo = function on(pathname,routeMap) {

    var getRouteInfoFromMap = function on(controllerName,actionName) {
        var routeInfo = {'type':'','target':'','msg':''};
        var subRoute = routeMap[controllerName];
        if (!subRoute) {  
            routeInfo = {'type':'error','target':'','msg':'Unavaliable Module'};
            return routeInfo;
        }
        //如果restrict == false,当前module不做action的exist校验，target直接设置为pathname
        var action = subRoute.restrict == false ? pathname : subRoute.actions[actionName];
        if (!action) {  
            routeInfo = {'type':'error','target':'','msg':'Unavaliable Action'};
            return routeInfo;
        }
        routeInfo.type = subRoute.type;
        routeInfo.target = action;
        return routeInfo;
    };

    var oriArray = pathname.split('/');
    var array = [];
    for (var i in oriArray) {
        if (oriArray[i] && oriArray[i] != '') { array.push(oriArray[i]); }   
    }

    if (!array) {
        return {'type':'error','target':'','msg':'Unavaliable Module'};
    }
    //array=0表示当前请求访问站点根目录默认地址
    if (array.length == 0) {
        return getRouteInfoFromMap('','default');
    }
    //array=1有两种情况，1是访问根目录下指定事件，2是访问指定目录下默认事件
    if (array.length == 1) {
        var info = getRouteInfoFromMap('',array[0]);
        if (info.type != 'error' ) { return info; }
        return getRouteInfoFromMap(array[0],'default');
    }

    return getRouteInfoFromMap(array[0],array[1]);
};

//返回200状态结果
var responseOK = function on (respText,response,pathname) {
    // HTTP 状态码: 200 : OK
    // Content Type: text/plain
    response.writeHead(200, {
        'Content-Type': pathname ? mime.lookup(pathname) : 'text/html;charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    response.write(respText);
    response.end();

// res.writeHead(200, {
//   'Content-Type': mimeType,
//   'Content-Length': contents.length,
//   'Accept-Ranges': 'bytes',
//   'Cache-Control': 'no-cache'
// });
};

//返回404异常状态结果
var responseErr = function on(err,response) {
    // exports.modal = {
    //     code:0,       //错误号
    //     content:null,  //内部错误信息透传
    //     errMsg:null   //错误信息
    // };
    var html = require('art-template')(dirpathHelper.join(__dirname,'sys/httperrorpage'),{ code:err.code, errMsg:err.errMsg, content:JSON.stringify(err.content) });
    // HTTP 状态码: 404 : NOT FOUND
    response.writeHead(err.code, { 'Content-Type' : 'text/html;charset=utf-8' });
    response.write(html);
    response.end();
};

//静态资源请求响应器
var staticResponser = function on(target,response) {
    // 从文件系统中读取请求的文件内容
    fs.readFile(target, function (err, data) {
        if (err) {
            var errInfo = require('./sys/httpErrorEntity.js').entity;
            errInfo.code = 404;
            errInfo.errMsg = 'HTTP NOT FOUND';
            errInfo.content = err;
            responseErr(errInfo,response);
        }else{
            responseOK(data,response,target);
        }
    });
};

//cgi请求响应器
var cgiResponser = function on(target,request,response) {
    //内部子函数放在最顶部
    var excuteModule = function on() {
        action.excute(function on(result,code,err){
            if (result) {
                responseOK(result,response);
            } else {
                var errInfo = require('./sys/httpErrorEntity.js').entity;
                errInfo.code = 500;
                errInfo.errMsg = 'UNKNOWN SERVER ERROR';
                errInfo.content = err;
                responseErr(errInfo,response);
            }
        })
    };

    var action = require(target).getInstance();
    action.query = getQueryString(request);
    action.cookies = new Cookies(request,response);
    action.request = request;
    action.response = response;

    if (request.method == "POST") {
        receiveFormData(request,function on(postData){
            action.postData = postData;
            excuteModule();
        });
    } else {
        excuteModule();
    }
};

var receiveFormData = function on(request,callback) {
    var postData = '';
    //如果当前请求的content-type是multipart/form-data ，则表示当前POST请求要上传文件,使用formidable插件来接收当前表单
    if (request.headers['content-type'] && request.headers['content-type'].indexOf('multipart/form-data;') > -1) {
        var formidable = require('formidable');
        var mutiform = new formidable.IncomingForm();
        // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.
        mutiform.parse(request, function(err, fields, files) {
            if (err) {
                // Check for and handle any errors here.
                console.error(err.message);
                if (callback) { callback(querystring.parse(postData)); };
                return;
            }
            if (callback) { callback(files); }
        });
        return;
    }
    
    //开始POST数据接收
    request.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    //结束POST数据接收
    request.addListener("end", function() {
        if (callback) { callback(querystring.parse(postData)); };
    });
};

var getQueryString = function on(request){
    var query = {};
    var url_parts = url.parse(request.url, true);
    for (var i in url_parts.query) {
        query[i] = url_parts.query[i];
    }
    return query;
};

//最后一行执行创建过程
createHttpServers();
