//http server start

/*  
    新node环境下需要先安装以下插件
    npm install mime
    npm install mysql
    npm install art-template
    npm install formidable
*/

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require("querystring");
//开发工具类
var utils = require('./utils.js').utils;
var mime = require('mime');

//route map
var routeMap = require('./configs/routes.js').routes;

var port = 8086;

// 创建服务器
http.createServer( function (request, response) {  
    console.log('METHOD:' + request.method);
    // 解析请求，包括文件名
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    var routeInfo = getRouteInfo(pathname);
    console.log(routeInfo);

    switch(routeInfo.type){
        case 'error':
            var errInfo = require('./modals/responseErrModal.js').modal;
            errInfo.code = 1003;
            errInfo.errMsg = routeInfo.msg;
            errInfo.content = routeInfo;
            responseErr(errInfo,response);
        break;
        case 'static':
            staticResponser(utils.getDirectoryPath(routeInfo.target),response);
        break;
        case 'serverpage':
            serverPageResponser(utils.getDirectoryPath(routeInfo.target),request,response);
        break;
        case 'cgi':
            moduleResponser(utils.getDirectoryPath(routeInfo.target),request,response);
        break;
    }
}).listen(port);

// 控制台会输出以下信息
console.log('JazzNode HTTP Server running at http://127.0.0.1:' + port);

var getRouteInfo = function on(pathname) {

    var getRouteInfoFromMap = function on(moduleName,actionName) {
        var routeInfo = {'type':'','target':'','msg':''};
        var subRoute = routeMap[moduleName];
        if (!subRoute) {  
            routeInfo = {'type':'error','target':'','msg':'Unavaliable Module'};
            return routeInfo;
        }
        //如果restrict == false,当前module不做action的exist校验，target直接设置为pathname
        var targetModule = subRoute.restrict == false ? pathname : subRoute.module[actionName];
        if (!targetModule) {  
            routeInfo = {'type':'error','target':'','msg':'Unavaliable Action'};
            return routeInfo;
        }
        routeInfo.type = subRoute.type;
        routeInfo.target = targetModule;
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
    // console.log(err);

    var html = utils.templateRender('/httperrorpage',{ code:err.code, errMsg:err.errMsg, content:JSON.stringify(err.content) });
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
            var errInfo = require('./modals/responseErrModal.js').modal;
            errInfo.code = 404;
            errInfo.errMsg = 'HTTP NOT FOUND';
            errInfo.content = err;
            responseErr(errInfo,response);
        }else{
            responseOK(data,response,target);
        }
    });
};

//RESTful API请求响应器
var moduleResponser = function on(target,request,response) {
    //内部子函数放在最顶部
    var excuteModule = function on() {
        action.module.excute(function on(result, code, err) {
            var responseModal = require('./modals/responseModal.js').modal;
            responseModal.code = 0;
            responseModal.data = [];
            responseModal.errMsg = null;

            if (result) {
                if (code) { responseModal.code = code; }
                if (err) {responseModal.errMsg = err; }
                responseModal.data = result;
                responseOK(JSON.stringify(responseModal),response);
            } else {
                var errInfo = require('./modals/responseErrModal.js').modal;
                errInfo.code = 500;
                errInfo.errMsg = 'UNKNOWN SERVER ERROR';
                errInfo.content = err;
                responseErr(errInfo,response);
            }
        });
    };

    var action = require(target);
    action.module.query = getQueryString(request);

    if (request.method == "POST") {
         receiveFormData(request,function on(postData){
            action.module.postData = postData;
            excuteModule();
        });
    } else {
        excuteModule();
    }
};

//动态页面请求响应器
var serverPageResponser = function on(target,request,response) {
    //内部子函数放在最顶部
    var excuteModule = function on() {
        action.module.excute(function on(result, code, err) {
            if (result) {
                responseOK(result,response);
            } else {
                var errInfo = require('./modals/responseErrModal.js').modal;
                errInfo.code = 500;
                errInfo.errMsg = 'UNKNOWN SERVER ERROR';
                errInfo.content = err;
                responseErr(errInfo,response);
            }
        });
    };

    var action = require(target);
    action.module.query = getQueryString(request);

    if (request.method == "POST") {
        receiveFormData(request,function on(postData){
            action.module.postData = postData;
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

