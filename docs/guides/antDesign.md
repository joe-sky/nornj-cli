# 使用Ant Design组件

[`Ant Design`](https://ant.design/docs/react/introduce-cn)是基于`React`实现的一套企业级UI组件库。[FlareJ](https://github.com/joe-sky/flarej)库将`Ant Design`与`NornJ`模板结合，做了一下简单封装。

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

## 表单组件使用方法

表单组件示例页面[请点这里](https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mst/src/web/pages/formExample)：

![form example](images/antd1.png?raw=true)

### 支持表单控件双向数据绑定

上述表单示例页面使用`NornJ`的`#mobx-model`语法实现了mobx变量与表单组件的双向数据绑定，关于`#mobx-model`语法的介绍及文档[请点这里](https://joe-sky.github.io/nornj-guide/templateSyntax/inlineExtensionTag.html#mobx-model)。

### 表单验证组件使用方法

`Ant Design`的`Form`组件提供了完善的表单验证方案，文档[请点这里](https://ant.design/components/form-cn/#Form.create(options))。如上述表单示例，在`react-mst`模板中对它原生的使用方法进行了一些针对`NornJ`模板的适配，可使逻辑与展现层代码分离看起来更加清晰，推荐使用。

* 用装饰器语法使用Form.create创建表单高阶组件

```js
import Form from 'flarej/lib/components/antd/form';

@registerTmpl('AntForm')
@inject('store')
@observer
@Form.create()  //这里的使用方法和官方文档在组件class下面使用Form.create()(AntForm)的效果是一样的
@observer
class AntForm extends Component {
  ...
}
```

* 将getFieldDecorator方法放到组件的方法中编写

```html
<template name="antForm">
  <div class="{styles.formExample}">
    <h2>Ant Design 表单验证示例</h2>
    <ant-Form>
      <!-- formItemParams是自定义的nornj全局过滤器，用于初始化FormItem组件的默认样式等，是在utils/nj.configs.js里定义的 -->
      <ant-Form.Item label="表单元素1" {...formItemParams()}>
        <!-- 这里可以写getFieldDecorator方法的各参数，比如用initialValue设置初始值 -->
        <#formEl1 initialValue={formExample.antInputValue}>
          <ant-Input />
        </#formEl1>
      </ant-Form.Item>
      <ant-Form.Item label="表单元素2" {...formItemParams()}>
        <#formEl2 initialValue={formExample.antSelectValue}>
          <ant-Select placeholder="请选择">
            <ant-Option value="1">测试数据1</ant-Option>
            <ant-Option value="2">测试数据2</ant-Option>
            <ant-Option value="3">测试数据3</ant-Option>
          </ant-Select>
        </#formEl2>
      </ant-Form.Item>
      <div class={styles.btnArea}>
        <ant-Button htmlType="submit" onClick={onAntSubmit}>提交</ant-Button>
        <ant-Button onClick={onAntReset}>重置</ant-Button>
      </div>
    </ant-Form>
  </div>
</template>
```

```js
@registerTmpl('AntForm')
@inject('store')
@observer
@Form.create()
@observer
class AntForm extends Component {

  /*
   (1)name参数为<#formEl1>的标签名，即formEl1
   (2)props参数为<#formEl1>的各行内属性，类型为对象
   (3)result参数为<#formEl1>的子标签，类型为函数。执行它可获取<#formEl1>的子标签
   */
  formEl1({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素1不能为空！' }]
    }, ...props})(result());
  },

  formEl2({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素2不能为空！' }]
    }, ...props})(result());
  }

  ...
}
```

上述表单的完整示例代码[请参考这里](https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mst/src/web/pages/formExample)。

## 可能会遇到的问题

1. 如果`Ant Design`的版本升级后增加了一个新组件`NewComponent`，`FlareJ`中还没有封装时该怎么做？

如下，可以在自己的项目里，使用`Ant Design`官方的方式引入`NewComponent`组件，并将它按以下这种方式置入模板中(具体方法请查看[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/api/renderReact.html#%E7%9B%B4%E6%8E%A5%E5%9C%A8%E6%A8%A1%E6%9D%BF%E5%87%BD%E6%95%B0%E4%B8%AD%E4%BC%A0%E5%85%A5react%E7%BB%84%E4%BB%B6))：

```js
import { NewComponent } from 'antd';

export default class Demo extends Component {
  render() {
    return templates.demoTable({
      components: {
        'ant-NewComponent': NewComponent
      }
    }, this.state, this.props, this, {
      styles
    });
  }
}
```

2. `ReactNode`类型的参数如何在`NornJ`模板中使用？

可以将这个`ReactNode`对象放入组件的`<@param>`子标签内，详见[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/templateSyntax/built-inExtensionTag.html#props%E4%B8%8Eprop)，示例如下：

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

3. `Mobx`的变量传给`Ant Design`组件后没按照预期展示数据

此种情况通常需要使用Mobx的`toJS`方法转换数据后再传给`Ant Design`组件，`NornJ`模板中已默认集成了`toJS`方法：

```html
<ant-Table dataSource={toJS(page1.tableData)} ... />
```

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="echarts.md"><b>使用Echarts图表组件</b></a> →</p>