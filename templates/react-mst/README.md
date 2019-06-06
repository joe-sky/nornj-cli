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
npm test                  #运行单元测试
npm run coverage          #生成单元测试覆盖率报告
npm e2e                   #运行e2e测试
```

## 使用后端server联调

可在`webpack.config.js`中[配置devServer.proxy参数](https://github.com/joe-sky/nornj-cli/blob/master/templates/react-mst-universal/webpack.config.js#L49)，来设置一个或多个代理去访问后端部署的server数据接口，[关于webpack代理设置可看下这篇文章](https://www.cnblogs.com/liuchuanfeng/p/6802598.html)。

然后使用`npm run dev-remote`启动调试，然后在项目源码中的`__Remote`变量会设置为`true`。可使用它来切换使用`后端服务器接口`或`本地mock server`，[具体代码可看这里](https://github.com/joe-sky/nornj-cli/blob/master/templates/react-mst-universal/src/stores/pages/page1Store.js#L171)。

## React + Mobx + NornJ的相关技术学习资料

`React + Mobx + NornJ`开发模式快速上手教程[请点这里](https://github.com/joe-sky/nornj-cli/blob/master/docs/guides/overview.md)。

### 开发环境

本脚手架基于`ES6 + babel`环境，并使用`Webpack`进行打包。

* [ES6 + babel](#es6--babel)
* [webpack](#webpack)

#### ES6 + Babel

`ES6(ES2015)`(以及更新的版本ES2016、ES2017等)提供了很多之前js版本没有的功能，比如`class`、`解构赋值`、`模块系统`、`for of循环`、`异步操作API Promise`等等，可显著提升开发效率及代码规范性。配合js代码编译器`Babel`，我们现在就可以放心地使用下一代js语法。

* [ECMAScript 6 入门](http://es6.ruanyifeng.com/)
* [ES6 学习笔记](https://segmentfault.com/a/1190000002904199)
* [全面解析ECMAScript 6模块系统](http://www.csdn.net/article/2015-04-30/2824595-Modules-in-ES6)
* [大白话讲解Promise(一)](http://www.cnblogs.com/lvdabao/p/es6-promise-1.html)
* [深入理解fetch](http://www.jianshu.com/p/35123b048e5e)
* [Babel 中文文档](https://babeljs.cn/)

#### Webpack

`Webpack`是现今最流行的前端模块打包工具，可配合`Babel`转换`ES6`代码，对当前各种主流前端框架均有非常完善的生态支持。

* [Webpack 中文文档](https://doc.webpack-china.org/concepts/)
* [入门Webpack，看这篇就够了](http://www.jianshu.com/p/42e11515c10f)
* [Webpack3.X版 成神之路](http://jspang.com/2017/09/16/webpack3-2/)

### 技术与框架列表

脚手架中使用的技术与框架列表如下：

* [React](#react)
* [Mobx](#mobx)
* [NornJ](#nornj)
* [CSS Modules](#css-modules)
* [styled-jsx](#styled-jsx)
* [Ant Design](#ant-design)
* [Echarts](#echarts)
* [FlareJ](#flarej)
* [Font Awesome](#font-awesome)

#### React

`React`是当前最流行的前端组件化框架之一，有非常丰富的社区贡献第三方工具与组件。

* [React 中文文档](https://doc.react-china.org/)
* [React 官方文档](https://facebook.github.io/react/)
* [React 中文论坛](http://react-china.org/)
* [React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)
* [React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html)
* [React 技术栈系列教程](http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html)

#### Mobx

`MobX`是一个可提供响应式编程的状态管理库，`React`和`MobX`是一对强力组合。而`Mobx-state-tree`是`MobX`官方提供的状态容器方案，可编写更规范的`MobX`代码。

* [MobX 中文文档](http://cn.mobx.js.org/)
* [10分钟极速入门 MobX 与 React](http://www.tuicool.com/articles/yYnmi26)
* [我为什么从Redux迁移到了Mobx](https://tech.youzan.com/mobx_vs_redux/)
* [Mobx-state-tree github文档](https://github.com/mobxjs/mobx-state-tree)
&lt;!-- * [Mobx-state-tree github文档(v0.9.5)](https://github.com/mobxjs/mobx-state-tree/tree/0.9.5) --&gt;

#### NornJ

`NornJ`是可同时支持渲染字符串和`React`组件的前端模板引擎，可覆盖很多`JSX`做不到的使用场景，也可配合`JSX`使用(babel-plugin-nornj-in-jsx)。

* [github地址](https://github.com/joe-sky/nornj)
* [NornJ指南](https://joe-sky.gitbooks.io/nornj-guide)
* [babel-plugin-nornj-in-jsx插件文档](https://github.com/joe-sky/nornj/blob/master/packages/babel-plugin-nornj-in-jsx/README.md)

#### CSS Modules

`CSS Modules`是一种可以提供局部css样式的解决方案。

* [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

#### styled-jsx

`styled-jsx`是一种可以直接在JSX标签中编写css样式的解决方案。

* [github文档](https://github.com/zeit/styled-jsx)
* [React拾遗：从10种现在流行的 CSS 解决方案谈谈我的最爱 （下）](https://juejin.im/post/5b3dd2d25188251b193d2d7e)

#### Ant Design

`Ant Design`是蚂蚁金服开发的基于`React`的开源ui组件库，提供了几十个可直接使用的高质量组件。

* [Ant Design 官方文档](https://ant.design/docs/react/introduce-cn)

#### Echarts

`Echarts`是百度开发的前端图表库。

* [Echarts 官方文档](http://echarts.baidu.com/index.html)

#### FlareJ

`FlareJ`是一个基于`React`和`NornJ`的UI组件库，包含一些易于配合`NornJ`使用的常用组件。

* [github文档](https://github.com/joe-sky/flarej)

#### Font Awesome

`Font Awesome`是流行的字体图标库。

* [官方文档](http://fontawesome.io/icons/)

### 一些常用工具

* [Moment.js](#momentjs)
* [storejs](#storejs)
* [js-cookie](#js-cookie)
* [querystring](#querystring)

#### Moment.js

`Moment.js`是非常流行的处理日期时间操作库。

* [官方文档](http://momentjs.com/)

#### storejs

`storejs`可以用来处理本地存储localstorage操作。

* [github文档](https://github.com/jaywcjlove/store.js)
* [项目中使用实例](http://source.jd.com/app/ai_category_manager/blob/master/end-delimiter/aicm%2Dui/src/components/queryForm/queryForm.js)

#### js-cookie

`js-cookie`可以用来处理各种cookie操作。

* [github文档](https://github.com/js-cookie/js-cookie)

#### querystring

`querystring`可以用来处理url参数操作。

* [github文档](https://github.com/Gozala/querystring)