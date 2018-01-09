# 总览

`NornJ-cli`是一个基于js模板引擎`NornJ`的命令行工具，目前它主要做的事请就是生成项目初始化脚手架，以及为接下来的开发流程增添更多便捷的功能。

> `NornJ`模板引擎是什么?

`NornJ`是一款同时支持渲染`html字符串`和`React vdom`的js模板引擎，[详细介绍请点击这里](https://github.com/joe-sky/nornj)。

## 目录

* [总览]()
  * [快速起步]()
  * [NornJ前端模板]()
  * [使用css modules开发局部样式]()
  * [Mobx状态管理]()
  * [使用Ant Design组件]()
  * [使用Echarts图表组件]()
  * [使用其他React第三方组件]()
  * [请求服务端数据]()

## 开发模式

`NornJ-cli`的重点目标之一在于推广我们公司内部已大规模使用的`React + Mobx + NornJ`开发模式，特点如下：

* 使用现今生态最完善的前端框架`React`，可任意搭配使用它的各种强大生态如`Ant Design`、`React-dnd`、`styled-components`等等。

* 使用`Mobx`作为首选状态管理库，与上手难度较高的`Redux`相比，它能提供更易上手的`响应式编程`开发体验，且`无需进行额外的性能优化`。

* 使用前端模板`NornJ`作为模板代码编写的首选方案，与`React`的官方模板`JSX`相比，`NornJ`的语法`和html更为接近`，且拥有许多`JSX`无法实现的功能。

* 使用`css modules`作为局部样式解决方案。

> 看过以上几点，我们不难想到，这个开发模式是不是很像`Vue`?

确实，`React`如果配合`响应式状态管理`、`前端模板`以及`局部css`等生态后确实和`Vue`的开发模式有些类似，且也能同时拥有`Vue`易上手、开发快速等方面的优势。但是，由于它使用`React`技术栈，故也会和`Vue`有很大区别，在一些细节处理方面也各有千秋。

## 特色

在`Vue`开发中，有一种代码组织结构给人感觉非常清晰，就是结合`vue-loader`的单文件组件模式：

```html
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 class="links">Essential Links</h2>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<style scoped>
  .hello {
    font-weight: normal;
  }

  .links {
    color: blue;
  }
</style>
```

上面的代码会统一放到一个名为*.vue的单个文件中。

然而在`NornJ-cli`中并不是模仿`Vue`，我们为`React`提供了一种新的代码组织结构，它和传统的前端开发模式比较近似，分三个模块文件放在同一目录下：

```bash
├── helloWorld
    ├── helloWorld.js      # 代码文件
    ├── helloWorld.m.scss  # 样式文件
    └── helloWorld.t.html  # 模板文件
```

1. 模板文件，命名一般为`*.t.html`：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <h1>{msg}</h1>
    <EssentialLinks />
  </div>
</template>

<template name="essentialLinks">
  <h2 class={styles.links}>Essential Links</h2>
</template>
```

2. 样式文件，命名一般为`*.m.less`或`*.m.scss`：

```css
.hello {
  font-weight: normal;
}

.links {
  color: blue;
}
```

3. 代码文件，命名一般为`*.js`：

```js
import { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import tmpls from './helloWorld.t.html';
import styles from './helloWorld.m.scss';

@registerTmpl('HelloWorld')
@observer
export default class HelloWorld extends Component {
  @observable msg = 'Welcome to Your React.js App';

  render() {
    return tmpls.helloWorld(this, {
      styles
    });
  }
}

@registerTmpl('EssentialLinks')
@observer
class EssentialLinks extends Component {
  render() {
    return tmpls.essentialLinks({
      styles
    });
  }
}
```

如上所示，`HelloWorld`可以是一个组件，或者是一个包含多个组件的页面。这样实际上比单纯地以组件作为单位的开发方式更加灵活：

* 组件一般应是可复用的元素，但是实际项目中可复用的业务组件往往很少，每个页面都有自己特定的模块，它们一般并不会被复用。这个时候，`以页面作为单元管理多个组件`的模式，就会变得非常有用。

* 在`NornJ-cli`推荐的开发模式中，每个组件或页面，都可以由上述三个文件构成。每个文件中都包含各个组件的`模板`、`样式`与`逻辑`，且它们之间还可以相互引用或复用。

* `NornJ`模板也可以支持在同一html文件内定义多个`<template>`元素，然后分别让它们服务于页面上各特定模块的组件使用。

## 准备好了吗？

我们刚才简单介绍了`React + Mobx + NornJ`开发模式的基本特点与代码组织结构，后面还有更加详细的简明教程，使您能快速掌握`NornJ-cli`的使用方法。

<p align="right"><a href="#"><b>快速起步</b></a> →</p>