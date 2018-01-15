# 使用Ant Design组件

`Ant Design`是基于`React`实现的一套企业级UI组件库。[FlareJ](https://github.com/joe-sky/flarej)库将`Ant Design`与`NornJ`模板结合，做了一下简单封装。

## 使用方法

1. 在js中按`flarej/lib/components/antd/组件名`引入组件：

```js
import { Component } from 'react';
import { registerTmpl } from 'nornj-react';
import 'flarej/lib/components/antd/table';  //引入ant design组件
import styles from './demo.m.scss';
import templates from './demo.t.html';

export default class Demo extends Component {
  render() {
    return templates.demoTable(this.state, this.props, this, {
      styles
    });
  }
}
```

2. 在`*.t.html`模板文件中用`ant-*`作为组件名使用即可(各组件的具体用法请参考[Ant Design官网](https://ant.design/docs/react/introduce-cn))：

```html
<template name="demoTable">
  <ant-Table columns={tableColumns}
             dataSource={demoData}
             pagination={false}
             rowKey={getTableRowKey}
             bordered />
</template>
```

* 也可以直接在js文件中使用`NornJ`模板，效果和写在`*.t.html`中相同：

```js
import { Component } from 'react';
import Table from 'flarej/lib/components/antd/table'; // 引入ant design组件
import styles from './demo.m.scss';

export default class Demo extends Component {
  render() {
    return nj`
      <${Table} columns={tableColumns}
                dataSource={demoData}
                pagination={false}
                rowKey={getTableRowKey}
                bordered />
    `(this.state, this.props, this, {
      styles
    });
  }
}
```

* 和`Ant Design`官网组件示例的不同之处：

1. 组件名前需要加`ant-`前缀;
2. 组件的传参使用`NornJ`模板语法，比如下面style属性可使用与html相同的语法，以及使用each标签遍历数组：

```html
<ant-Select style="width:60%;margin-left:5px;" value={value} onChange={onSelectChange('testParam')} placeholder="请选择">
  <#each {data}>
    <ant-Option value="{value + ''}" key={@index}>{label}</ant-Option>
  </#each>
</ant-Select>
```

## 可能会遇到的问题

1. 如果`Ant Design`的版本升级后增加了一个新组件`NewComponent`，`FlareJ`中还没有封装时该怎么做？

如下，可以在自己的项目里，使用`Ant Design`官方的方式引入`NewComponent`组件，并将它按以下这种方式置入模板中(具体方法请查看[NornJ文档](https://joe-sky.gitbooks.io/nornj-guide/api/renderReact.html#%E7%9B%B4%E6%8E%A5%E5%9C%A8%E6%A8%A1%E6%9D%BF%E5%87%BD%E6%95%B0%E4%B8%AD%E4%BC%A0%E5%85%A5react%E7%BB%84%E4%BB%B6))：

```js
import { NewComponent } from 'antd';

export default class Demo extends Component {
  render() {
    return templates.demoTable({
      components: {
        'ant-Steps': Steps
      }
    }, this.state, this.props, this, {
      styles
    });
  }
}
```

2. `ReactNode`类型的参数如何在`NornJ`模板中使用？

可以将这个`ReactNode`对象放入组件的`<@param>`子标签内，详见[NornJ文档](https://joe-sky.gitbooks.io/nornj-guide/templateSyntax/built-inExtensionTag.html#props%E4%B8%8Eprop)，示例如下：

```html
<ant-Modal width={960}
           visible={modalVisible}
           footer={null}
           onCancel={onModalCancel}>
  <@title>
    <div class={styles.modalTitle}>dialog</div>  <!-- 此处的div标签即为ReactNode类型 -->
  </@title>
  <div>
    content
  </div>
</ant-Modal>
```

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/overview.md"><b>返回总览</b></a></p>