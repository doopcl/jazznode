# jazznode
Node.js平台Web Server开(wan)发(ju)框架，轻量级的,开源的,使用简单的,可自定义的

***

### 如何部署？

运行环境必须安装Node.js组件（详情请点击：https://nodejs.org/en/）

新安装的node.js环境下需要先安装以下插件（npm包管理工具安装）

> npm install mime

> npm install mysql

> npm install art-template

> npm install formidable

> npm install cookies

最后在终端或者控制台用node命令运行server_run.js

`xxxxxxxxMac-mini:~ xxxxxxx$ node github/jazznode/server_run.js`

控制台输出 `JazzNode HTTP Server running at http://127.0.0.1:8086` 表示服务已经启动，可以访问该地址，项目内置demo，访问站点首页可看到产品介绍页

### 路由设置

项目内置demo中的 htdocs/www/route.js 是JazzNode内置demo站点的路由配置表，其格式如下

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


我们约定一级目录为“Controller”，二级目录为“Action”（如果是访问静态文件则为资源）

如果访问 127.0.0.1/users/info  则对应路由表Controller users下的Action info，并执行 modules/users/getuserinfo.js 的相关代码

访问 127.0.0.1  则对应路由表根Controller下的Action default，并加载static/index.html，如果想给某Controller设置默认Action或者资源，就在Controller信息下设置default为指定的Action对应代码文件地址或静态资源地址

支持设置Controller的响应类型：静态资源，cgi服务（static，cgi），JazzNode根据不同类型，做出不同处理并返回

若不需要对某Controller下的资源做白名单校验或指定映射，则模块信息中增加 'restrict':false ，则请求到当前Controller的request将直接搜寻Controller同名目录下的资源，如果资源不存在，直接返回404，该节点主要用于对拥有大量静态资源，如图片，css样式等文件的目录做访问权限的开放

### virtual host 支持

JazzNode最新版已支持virtual host功能，支持单IP同时创建多个域名的独立站点，项目内置demo已包含virtual host特性的体验，体验方式如下：

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

测试建议使用80端口，友情提示：使用80端口需要在node server_run.js时使用管理员身份运行（命令前加sudo）

***

### v20160419---
* Web Server支持virtual host特性
* 代码重构，Web Server功能模块和项目内置演示demo站点解耦
* 加入了virtual host的测试demo，具体测试方法在virtualhost.js配置文件中说明


### v20160415---
* 功能聚合，不再支持RESTful API原生支持（json格式数据返回）,统一为cgi模式，返回json格式交由方法内部实现即可
* cgi 支持get set cookies（采用第三方库cookies，https://github.com/pillarjs/cookies）

### v20160414---
* 基本http web server功能（GET,POST请求响应，multipart/form-data表单已支持）；
* 二级URI路由支持，自定义路由表；
* serverpage支持（采用art-template模板渲染），RESTful API原生支持（json格式数据返回），静态资源 的访问支持；
* 可自定义UI的HTTP Error Page

