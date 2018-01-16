# 使用fetch请求服务端数据

推荐使用`fetch API`来请求后端数据，[FlareJ](https://github.com/joe-sky/flarej)库提供了一个`fetchData`方法，将`fetch`做了下简单封装。

> 用户可根据自身需求，将`FlareJ`的`fetchData`方法替换成任意方式的异步请求方法或库，如`axios`。

## 使用方法

* 引入`fetchData`并调用：

```js
import { fetchData } from 'flarej/lib/utils/fetchConfig';

fetchData(`http://www.google.com/searchModelPageList`, result => {
  ...
});
```

* `fetchData`方法的返回值为`Promise`，可用`then`继续添加回调函数：

```js
fetchData(`http://www.google.com/searchModelPageList`, result => {
  return 'success';
}).then(ret => {
  console.log(ret);  //输出"success"
});
```

## 参数

`fetchData`方法接受四个参数，依次为：`url`, `callback`, `params`, `configs`。

* url(必填)

`fetch`请求的地址。

* callback(可选)

发送`fetch`请求后的回调函数，后端返回结果(数据格式默认为JSON)会放在回调函数的`result`参数中，例：

```js
fetchData(`http://www.demo.com/getApi`, result => {
  this.list = result.success ? result.data : [];
  ...
});
```

* params(可选)

`fetch`请求需要传入的参数，格式为对象，例：

```js
fetchData(`http://www.demo.com/getApi`, result => {
  this.list = result.success ? result.data : [];
  ...
}, { foo:1, bar:'2018-1-12' });
```

* configs(可选)

`fetch`请求需要的一些配置，例：

```js
fetchData(`http://www.demo.com/getApi`, result => {
  this.list = result.success ? result.data : [];
  ...
}, { foo:1, bar:'2018-1-12' }, { method: 'post' });
```

如果未传，则默认配置为：

```js
{
  method: 'get',
  credentials: 'include',
  mode: 'cors',
  cache: 'reload'
}
```

## 在react-mst项目模板中的使用方式

1. 在store文件中引入并使用`fetchData`：

```js
import { types } from "mobx-state-tree";
import { observable, toJS } from 'mobx';
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import Notification from '../../utils/notification';

...
.actions(self => {
  return {
    ...

    initTree() {
      self.expandedKeys = self.getExpandedKeys(toJS(self.menuData));
      self.checkedKeys = self.getDefaultCheckedKeys();
    },

    getData(params) {
      return fetchData(`${__HOST}/page1_1/getRoleMenuTree`,
        self.setRoleMenuTree,
        params, { method: 'get' }).catch((ex) => {
        Notification.error({
          description: '获取角色权限数据异常:' + ex,
          duration: null
        });
      });
    },

    setRoleMenuTree(result) {
      if (result.success) {
        self.menuData = result.data;
      } else {
        Notification.error({
          description: '获取角色权限数据错误:' + result.message,
          duration: null
        });
      }
    }
  }
})
```

2. 在业务页面的js文件中使用：

```js
import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
...

@registerTmpl('Page1_1')
@inject('store')
@observer
export default class Page1_1 extends Component {
  ...

  componentDidMount() {
    const { store: { page1_1 } } = this.props;

    const closeLoading = Message.loading('正在获取数据...', 0);
    Promise.all([
      ...
      page1_1.getRoleMenuTree().then(() => page1_1.initTree())
    ]).then(() => {
      closeLoading();
    });
  }

  ...
}
```

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="antDesign.md"><b>使用Ant Design组件</b></a> →</p>