# Webpack配置文件

本节简介下`NornJ-cli`的`react-mst`模板中的Webpack配置文件中的各配置项，该文件存放在项目根目录下的`webpack.config.js`。

## 配置nornj-loader

webpack.config.js中有两处地方配置了[nornj-loader](https://github.com/joe-sky/nornj-loader)，用来解析相应的`NornJ`模板文件。

### 解析*.t.html文件

在`src`目录内的js代码中，以下这种场景会经过`nornj-loader`解析：

```js
import tmpls from './helloWorld.t.html';
```

Webpack配置项：

```js
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.t.html(\?[\s\S]+)*$/,
        use: [{
          loader: 'nornj-loader',
          options: {  //options中指定react相关配置项
            outputH: true,
            delimiters: 'react'
          }
        }]
      }
    ]
  }
}
```

### 解析index.template-web.html文件

项目根目录下的`index.template-web.html`是入口页面文件，它也会经过`nornj-loader`解析。注意此文件中使用的是[`NornJ`渲染html字符串时的语法](https://joe-sky.gitbooks.io/nornj-guide/templateSyntax/variable.html)，即`双花括号`：

```html
<#with {{ htmlWebpackPlugin.options }}>
<!DOCTYPE html>
<html>
<head>
  <title>react-mst-boilerplate</title>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="format-detection" content="telephone=no" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,initial-scale=1.0" />-->
  <script src="{{ path }}js/es6-promise.auto.min.js"></script>
</head>
<body>
  <div id="app" style="position:relative"></div>
  <script src="{{ path }}js/jquery-3.1.1.min.js"></script>
  <script src="{{ path }}js/babelHelpers.min.js"></script>
</body>
</html>
</#with>
```

其中使用了`NornJ`的with标签，作用是为了减少获取path参数的属性层级。上面的模板文件经过`nornj-loader`解析后，会填充各变量并生成生产代码存放在`dist/web/index.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>
      react-mst-boilerplate
    </title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="format-detection" content="telephone=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,initial-scale=1.0" />
    -->
    <script src="web/js/es6-promise.auto.min.js"></script>
    <link href="web/css/20171218/app.css" rel="stylesheet" />
  </head>
  <body>
    <div id="app" style="position:relative"></div>
    <script src="web/js/jquery-3.1.1.min.js"></script>
    <script src="web/js/babelHelpers.min.js"></script>
    <script type="text/javascript" src="web/20171218/vendors.min.js"></script>
    <script type="text/javascript" src="web/20171218/app.js"></script>
  </body>
</html>
```

Webpack配置项：

```js
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.template(-[\s\S]+)*.html(\?[\s\S]+)*$/,
        use: [{
          loader: 'nornj-loader'
        }]
      },
    ]
  }
}
```

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>