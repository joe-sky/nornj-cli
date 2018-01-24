# 使用Mobx管理React组件状态

`React`技术栈中最常用的状态管理库是`Redux`，相关的技术生态也非常完善。但是`Redux`遵循严格的函数式编程规范，需要学习的相关技术很多上手较为困难，且在很多场景下需要进行额外的性能优化。

`Mobx`与`Vue`同样基于`响应式编程`设计，可作为`Redux`的首选替代方案。其API简单容易理解，更可让开发人员享受`响应式编程`的便捷开发体验，通常无需优化也可保证高性能，故可作为`NornJ-cli`的首选`React`状态管理库。

## 使用@observable装饰器创建可观察对象

`Mobx`为React开发提供的最核心的部分就是`observable`变量，使用它基本可以完全替代`setState`函数，用非常便捷的方式为React组件更新状态。

* 在React组件的class中使用observable变量更新数据

1. 在helloWorld.js中定义observable变量：

```js
import { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import tmpls from './helloWorld.t.html';
import styles from './helloWorld.m.scss';

@registerTmpl('HelloWorld')
@observer  //需要为React组件observer装饰器
export default class HelloWorld extends Component {
  @observable msg = 'Welcome to Your React.js App';

  @autobind
  onInputChange(e) {
    //在文本框内容变化事件中修改observable变量msg的值后，会自动触发模板中的渲染内容更新
    this.msg = e.target.value;
  }

  render() {
    return tmpls.helloWorld(this, {
      styles
    });
  }
}
```

2. 在helloWorld.t.html使用observable变量展示数据：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <input value={msg} onChange={onInputChange} />
  </div>
</template>
```

## 使用@computed装饰器创建计算属性

## 使用Mobx-state-tree构建store

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="httpRequest.md"><b>使用fetch请求服务端数据</b></a> →</p>