# 请求服务端数据

通过fetchData方法，实现和服务端的通讯。前后端通过JSON来交流。

## fetchData方法-原理

fetchData底层依靠`fetch`，并对其进行了封装，实现了参数可配置、异常处理、支持`Callback`等功能。

* 核心功能

```js
function fetchData(url, callback, params, cfgs) {
  var configs = babelHelpers.extends({
    method: 'get',
    credentials: 'include',
    mode: 'cors',
    cache: 'reload'
  }, cfgs);

  configs.method = configs.method.toLowerCase();
  if (params) {
    if (configs.method === 'get' || configs.method === 'delete') {
      url += '?' + _querystring2.default.encode(params);
    } else if (configs.method === 'post' || configs.method === 'put') {
      configs.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      configs.body = JSON.stringify(params);
    }
  }

  return fetch(url, customHeaders(configs)).then(handleErrors).then(function (response) {
    return response.json();
  }).then(callback);
}
```

* 异常处理

```js
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

```

## fetchData方法-使用

* 首先引入该方法

```js
import { fetchData } from 'vic-common/lib/common/fetchConfig';
```

然后可以在js文件中引入后使用：

```js
import tmpls from './helloWorld.t.html';

export default class HelloWorld extends Component {
  render() {
    return tmpls.helloWorld();  //执行模板函数生成标签
  }
}
```

如上，每个`*.t.html`文件内都可以定义一个或多个`template`标签。

这些`template`标签会在引用它的js文件中通过[nornj-loader](https://github.com/joe-sky/nornj-loader)进行解析，生成一个以`template`标签的`name`属性为key的模板函数集合对象，在各个组件的render中调用它们就会生成相应的标签。

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/overview.md"><b>返回总览</b></a></p>