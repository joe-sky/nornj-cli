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

* send a `get` request (ES6)

'get'是默认的传输方式，所以fetchData方法的最后参数无需指定。

```js
import { fetchData } from 'vic-common/lib/common/fetchConfig';

export default class Demo {

  list = null;

  getData() {
    return fetchData(`http://www.demo.com/getApi`, result => {
      transaction(() => {
        if (result.success) {
          this.list = result.data;
        } else {
          this.list = [];
        }
      });
    }).catch((ex) => {
      console.log('获取数据接口出错，错误是:' + ex);
    });
  }

}

const demo = new Demo;
demo.getData();
```

* send a `post` request (ES6)

'post'不是默认的传输方式，所以需要在fetchData方法的最后参数中指定。

```js
import { fetchData } from 'vic-common/lib/common/fetchConfig';

export default class Demo {

  list = null;

  getData() {
    return fetchData(`http://www.demo.com/getApi`, result => {
      transaction(() => {
        if (result.success) {
          this.list = result.data;
        } else {
          this.list = [];
        }
      });
    },{},{ method: 'post' }).catch((ex) => {
      console.log('获取数据接口出错，错误是:' + ex);
    });
  }

}

const demo = new Demo;
demo.getData();
```

## Parameters

fetchData方法接受四个参数：url, callback, params, cfgs

* url(必填)
```
请求的地址。可以是绝对路径，也可以是相对路径。
例：
http://www.site.com/api
/api/getData
...
```
* callback(可选)
```
请求返回后执行。
例：
fetchData(`http://www.demo.com/getApi`, result => {
  this.list = result.success ? result.data : [];
  //....
});
```
* params(可选)
```
请求需要的参数。
入参会根据请求的方式（如post或get等）自动做处理。
例1：
{ foo:1, bar:'2018-1-12' }
例2：
const params = 'a,b,c,1';
fetchData(`http://www.demo.com/getApi`, result => {
  this.list = result.success ? result.data : [];
  //....
},{params});
...
```
* cfgs(可选)
```
请求需要的一些配置。
如果未传，则默认配置为：
{
  method: 'get',
  credentials: 'include',
  mode: 'cors',
  cache: 'reload'
}
可以重置这些配置，适应不同的项目需求。
例：
{ method: 'post' }
```

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/overview.md"><b>返回总览</b></a></p>