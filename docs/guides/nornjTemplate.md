# NornJ前端模板

`NornJ`模板引擎(以下简称`nj`)在`React`开发中是`JSX`的一个很好的替代或辅助工具，本节我们将介绍一下`NornJ`模板结合`React`的使用方法。

## nj与JSX使用场景的区别

每个`React`组件都须要在render返回组件的标签代码，如在`HelloWorld`组件中渲染一个下拉框，用`JSX`和`nj`的语法分别实现：

* JSX

```js
export default class HelloWorld extends Component {
  render() {
    return (
      <div className="hello">
        <select>
          {[1, 2, 3].map(i => i > 1
            ? <option>{i + 1}</option>
            : <option>{i}</option>
          )}
        </select>
      </div>
    );
  }
}
```

* nj

```js
import nj from 'nornj';

export default class HelloWorld extends Component {
  render() {
    return nj`
      <div class="hello">
        <select>
          <#each {[1, 2, 3]}>
            <#if {this > 1}>
              <option>{this + 1}</option>
              <#else><option>{this}</option></#else>
            </#if>
          </#each>
        </select>
      </div>
    `();
  }
}
```

从上例可以看出，`nj`语法在处理逻辑时的结构比`JSX`更加易读，且语法和html更为接近。

除了这种用法之外，`nj`还可以将标签代码编写在独立的`html`文件中，用来做组件(或页面)展现层与结构层的分离。例如编写一个`helloWorld.t.html`文件：

```html
<template name="helloWorld">
  <div class={styles.hello}>
    <select>
      <#each {[1, 2, 3]}>
        <#if {this > 1}>
          <option>{this + 1}</option>
          <#else><option>{this}</option></#else>
        </#if>
      </#each>
    </select>
  </div>
</template>
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

## nj模板语法简介

## nj模板函数

## React-mst项目模板中nj的使用场景

## 将React组件的各种属性对象传入nj模板函数

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/guides/overview.md"><b>返回总览</b></a></p>