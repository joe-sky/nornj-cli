# 使用Ant Design组件

`Ant Design`是基于`React`实现的一套企业级UI组件库。[FlareJ](https://github.com/joe-sky/flarej)库将`Ant Design`与`NornJ`模板结合，做了一个简单封装

## 使用方法

1. 在JSX中按"flarej/lib/components/antd/组件名"引入组件：
```js
import { Component } from 'react';
import { registerTmpl } from 'nornj-react';
import 'flarej/lib/components/antd/table'; // 引入ant design组件
import styles from './demo.scss';
import templates from './demo.t.html';

	export default class Demo extends Component {
  	render() {
    	return templates.demoTable(this.state, this.props, this, {
      	styles
    	});
  	}
	}
```
2. 在`NornJ`模板中用"ant-*"作为组件名使用即可。各组件的用法请参考Ant design官网
```js
<template name="demoTable">
    <ant-Table columns={tableColumns}
               dataSource={demoData}
               pagination={false}
               rowKey={getTableRowKey}
               bordered/>
</template>
```


也可以直接在JSX中使用`NornJ`模板
```js
import { Component } from 'react';
import 'flarej/lib/components/antd/table'; // 引入ant design组件
import styles from './demo.scss';

export default class Demo extends Component {
  render() {
    return nj`
      <ant-Table columns={tableColumns}
               dataSource={demoData}
               pagination={false}
               rowKey={getTableRowKey}
               bordered/>
    `();
  }
}
```

和ant design官网组件示例不同之处，一是组件名前需要加"ant-"，二是组件的传参使用`NornJ`模板语法，比如下面style属性使用与html相同的语法，使用each标签遍历数组

```js
    <ant-Select style="width:60%" value={value} onChange={onSelectChange(@index)} placeholder="请选择">
      <#each {data}>
        <ant-Option value="{value +('')}" key={@index}>{label}</ant-Option>
      </#each>
    </ant-Select>
```
## 可能会遇到的问题

1. `FlareJ`只是封装了一些常用的ant design组件，如果要用到某个没有被封装的该怎么做？
如下，可以在自己的项目里，用`NornJ`的`registerComponent`将该ant design的组件进行注册封装：
```js
import { registerComponent } from 'nornj';
import Button from 'antd/lib/button'; // 要使用的组件
import 'antd/lib/button/style/index';

	registerComponent({
	  'ant-Button': Button
	});

	export {
	  Button
	};
	
	export default Button;
```

2. ReactNode类型的参数如何在`NornJ`模板中使用？
可以使用props标签，详见[NornJ模板语法](https://github.com/joe-sky/nornj/blob/master/docs/模板语法.md)
示例如下：
```js
    <ant-Modal
      width={960}
      visible={modalVisible}
      footer={null}
      onCancel={onModalCancel}>
      <@title>
        <div class={styles.modalTitle}>dialog</div>
      </@title>
      <div>
        content
      </div>
    </ant-Modal>
```




<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/overview.md"><b>返回总览</b></a></p>