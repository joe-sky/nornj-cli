# 总览

`NornJ-cli`是一个基于js模板引擎`NornJ`的命令行工具，目前它主要做的事请就是生成项目初始化脚手架，以及为接下来的开发流程增添更多便捷的功能。

> `NornJ`模板引擎是什么?

`NornJ`是一款同时支持渲染`html字符串`和`React vdom`的js模板引擎，[详细介绍请点击这里](https://github.com/joe-sky/nornj)。它也可以直接配合`JSX`运行，为`JSX`增添更多实用语法。

## 目录

* [总览](overview.md)
  * [快速起步](gettingStarted.md)
  * [使用NornJ前端模板结合React开发](nornjTemplate.md)
  * [使用css modules开发局部样式](cssModules.md)
  * [使用Mobx管理React组件状态](mobx.md)
  * [使用fetch请求服务端数据](httpRequest.md)
  * [使用Ant Design组件](antDesign.md)
  * [使用Echarts图表组件](echarts.md)
  * [Webpack配置文件](webpackConfig.md)

## 开发模式

本文假定您已经了解开发`React`组件的相关知识。如果您从未接触过`React`开发，可以看下[官方文档中文版的快速开始教程](https://react.docschina.org/docs/hello-world.html)。

`NornJ-cli`的重点目标之一在于推广我们公司内部已大量使用的`React + Mobx + NornJ`开发模式，特点如下：

* 使用现今生态最完善的前端框架`React`，可任意搭配使用它的各种强大生态如`Ant Design`、`React-dnd`、`styled-components`等等。

* 使用`Mobx`作为首选状态管理库，与上手难度较高的`Redux`相比，它能提供更易上手的`响应式编程`开发体验，且`无需进行额外的性能优化`。

* 使用前端模板`NornJ`作为`JSX`的替代或辅助方案，可为`React`的模板开发部分提供如`条件渲染`、`循环`语句、`双向数据绑定`等等新增实用功能。

* 使用`css modules`或`styled-jsx`作为局部样式解决方案。

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

然而在`NornJ-cli`中，目前有两种模式可供开发者选择：

### 类似Angular的代码组织结构

与[Angular的代码组织结构](https://angular.cn/guide/attribute-directives#summary-1)较为类似，即传统的页面`逻辑`、`样式`、`结构`分离的前端开发模式，分三个模块文件放在同一目录下：

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

* 在`NornJ-cli`推荐的开发模式中，每个组件或页面，都可以由上述三个文件构成。每个文件中都包含各个子组件的`模板`、`样式`与`逻辑`，且它们之间还可以相互引用或复用。

* `NornJ`模板也可以支持在同一html文件内定义多个`<template>`元素，然后分别让它们服务于页面上各特定模块的组件使用。

* 在使用`NornJ`模板的同时其实也可以使用`JSX`，这两者并不会发生冲突。

### React原生的JSX代码组织结构

`React`从一诞生起就开始推崇以组件为单位来开发单页应用，而每个组件就是一个`JSX`文件。在`NornJ-cli`中则也支持这种规范，如上例可改写为：

```js
/* helloWorld.jsx */
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
  @observable visible = false;

  render() {
    return (
      <div className="hello">
        <style jsx>`{
          .hello {
            color: blue;
          }
        }`</style>
        <h1>{this.msg}</h1>
        <EssentialLinks visible={this.visible} />
      </div>
    );
  }
}

@registerTmpl('EssentialLinks')
@observer
class EssentialLinks extends Component {
  render() {
    return (
      <h2>
        <style jsx>`{
          h2 {
            color: blue;
          }
        }`</style>
        <i n-show={this.props.visible}>Essential Links</i>
      </h2>
    );
  }
}
```

如上所示，我们在`NornJ-cli`的项目模板中预置了`styled-jsx`插件，可在`JSX`文件中方便地编写样式；还有`babel-plugin-nornj-in-jsx`插件，它可提供一些实用的`JSX`扩展语法，例如编写条件判断、循环等等。

对于上述两种开发模式，用户可以根据自己的喜好来进行选择。<!--然而在`NornJ`的下一步开发计划中，我们也会考虑将`Vue`的单文件组件模式加入到`NornJ-cli`的备选方案，敬请期待。-->

## 准备好了吗？

我们刚才简单介绍了`React + Mobx + NornJ`开发模式的基本特点与代码组织结构，后面还有更加详细的简明教程，使您能快速掌握`NornJ-cli`的使用方法。

<p align="right"><a href="gettingStarted.md"><b>快速起步</b></a> →</p>