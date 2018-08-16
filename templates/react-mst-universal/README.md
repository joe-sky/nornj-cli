nornj-react-mst-boilerplate
====

> `NornJ`+`React`+`Mobx-state-tree`项目模板，可以此项目为模板快速创建新项目。

## 构建命令

```sh
npm run dev 或 npm start  #启动webpack-dev-server本地调试，接口使用本地mock server，然后使用http://localhost:8080/dist/web访问页面
npm run dev-remote        #启动webpack-dev-server本地调试，接口使用后端server，然后使用http://localhost:8080/dist/web访问页面
npm run build             #构建生产代码到dist目录
npm run build-test        #构建生产代码到dist目录，使用测试环境配置
npm run build-local       #构建生产代码到dist目录，可以本地离线访问
```

## 使用后端server联调

可在`webpack.config.js`中[配置devServer.proxy参数](https://github.com/joe-sky/nornj-cli/blob/master/templates/react-mst-universal/webpack.config.js#L49)，来设置一个或多个代理去访问后端部署的server数据接口，[关于webpack代理设置可看下这篇文章](https://www.cnblogs.com/liuchuanfeng/p/6802598.html)。

然后使用`npm run dev-remote`启动调试，然后在项目源码中的`__Remote`变量会设置为`true`。可使用它来切换使用`后端服务器接口`或`本地mock server`，[具体代码可看这里](https://github.com/joe-sky/nornj-cli/blob/master/templates/react-mst-universal/src/stores/pages/page1Store.js#L171)。

#{learningGuide}#