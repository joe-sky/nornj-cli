# 请求服务端数据

默认通过fetchData方法，实现和服务端的通讯。前后端通过JSON来交流。
> 可以替换成任意方式的异步请求方法或库。

## Introduction

fetchData底层依赖`fetch`，并对其进行了封装，实现了参数可配置、异常处理、支持`Callback`等功能。

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

## Usage


* 首先 引入fetchData(ES6)

```js
import { fetchData } from 'vic-common/lib/common/fetchConfig';
```

* 然后可以在js文件中使用：

```js
fetchData(`http://www.google.com/searchModelPageList`, result => {
  this.list = result.success ? result.data : [];
  //...
});
```

## Example

Performing a `post` request in `React`(ES6)

```js
import { fetchData } from 'vic-common/lib/common/fetchConfig';

export default class Demo {

  list = null;

  getData(params) {
    return fetchData(`http://www.demo.com/getApi`, result => {
      transaction(() => {
        if (result.success) {
          this.list = result.data;
        } else {
          this.list = [];
        }
      });
    }, params, { method: 'post' }).catch((ex) => {
      console.log('获取数据接口出错，错误是:' + ex);
    });
  }

}

const demo = new Demo;
this.getData({ id:1, type:2, foo:3, bar:4});

```

## Parameters

fetchData方法接受四个参数：url, callback, params, cfgs

* url：必填
```
请求的地址。可以是绝对路径，也可以是相对路径。
如：
http://www.site.com/api
/api/getData
...
```
* callback: 可选
```
请求返回后执行。
```
* params：可选
```
请求需要的参数。
```
* cfgs
```
请求需要的一些配置。
```

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/overview.md"><b>返回总览</b></a></p>