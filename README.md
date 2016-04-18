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

最后在终端或者控制台用node命令运行server_run.js

`xxxxxxxxMac-mini:~ xxxxxxx$ node github/jazznode/server_run.js`

控制台输出 `JazzNode HTTP Server running at http://127.0.0.1:8086` 表示服务已经启动，可以访问该地址，项目内置demo，访问站点首页可看到产品介绍页

### 路由设置

config/route.js是JazzNode的路由配置表，其格式如下

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

     'source':{

         'type':'static',

         'module':{},

         'restrict':false

     },

     'assets':{

         'type':'static',

         'module':{},

         'restrict':false

     }

}

我们约定一级目录为“模块”，二级目录为“方法”（如果是访问静态文件则为资源）

如果访问 127.0.0.1/users/info  则对应路由表模块users下的info方法，并执行 modules/users/getuserinfo.js 的相关代码

访问 127.0.0.1  则对应路由表根模块下的default资源，并加载static/index.html，如果想给某模块设置默认方法或者资源，就在模块信息下设置default为指定的方法对应代码文件地址或静态资源地址

支持设置模块的响应类型：静态资源，cgi服务（static，cgi），JazzNode根据不同类型，做出不同处理并返回

若不需要对某模块下的资源做白名单校验或指定映射，则模块信息中增加 'restrict':false ，则请求到当前模块的request将直接搜寻模块同名目录下的资源，如果资源不存在，直接返回404，该节点主要用于对拥有大量静态资源，如图片，css样式等文件的目录做访问权限的开放

***

### v20160415---
* 功能聚合，不再支持RESTful API原生支持（json格式数据返回）,统一为cgi模式，返回json格式交由方法内部实现即可
* cgi 支持get set cookies（采用第三方库cookies，https://github.com/pillarjs/cookies）

### v20160414---
* 基本http web server功能（GET,POST请求响应，multipart/form-data表单已支持）；
* 二级URI路由支持，自定义路由表；
* serverpage支持（采用art-template模板渲染），RESTful API原生支持（json格式数据返回），静态资源 的访问支持；
* 可自定义UI的HTTP Error Page

