# 在React开发中使用NornJ前端模板

`NornJ`模板引擎(以下简称`nj`)在React开发中是`JSX`的一个很好的替代或辅助工具，本节我们将介绍一下`NornJ`模板结合React的使用方法。

## nj与JSX使用场景的区别

每个React组件都须要在render返回组件的标签代码，如在`HelloWorld`组件中渲染一个下拉框，用`JSX`和`nj`的语法分别实现：

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

除了这种用法之外，`nj`还可以将标签代码编写在独立的`html`文件中，用来做组件(或页面)展现层与结构层的分离(具体请参考[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/api/webpack.html))。例如编写一个`helloWorld.t.html`文件：

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

## nj模板语法

`nj`模板的语法在React开发中和`JSX`较为类似，模板内也可支持`各种逻辑与表达式`，但有的地方也有明显区别。具体请查看[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/templateSyntax/)。

## nj模板函数

* `nj`在渲染标签时是以模板函数为单元的，什么是模板函数？

1. 比如，我们在`helloWorld.t.html`文件中定义一个名为`helloWorld`的模板：

```html
<template name="helloWorld">
  <div>
    <select>
      <#each {list}>
        <option value="{id}">{value}</option>
      </#each>
    </select>
  </div>
</template>
```

2. 然后，在js文件中引用它：

```js
import tmpls from './helloWorld.t.html';

//这里的tmpls是一个对象结构，每个在helloWorld.t.html中定义的template标签都会以其name属性为key，而在这个对象中创建一个模板函数，用tmpls.helloWorld()即可调用。
```

3. 调用模板函数渲染React组件：

```js
export default class HelloWorld extends Component {
  state = {
    list: [
      { id: 1, value: '选项1' },
      { id: 2, value: '选项2' }
    ]
  };

  render() {
    return tmpls.helloWorld(this.state);
    
    /* 
      传入各参数(对象格式)到模板函数中，并执行模板函数生成标签，渲染结果为：
      <div>
        <select>
          <option value="1">选项1</option>
          <option value="2">选项2</option>
        </select>
      </div>
    */
  }
}
```

* 除了上述方式外，`nj`也可以在js文件中创建模板函数并执行：

```js
import nj from 'nornj';

const tmplFn = nj`
  <div>
    <select>
      <#each {list}>
        <option value="{id}">{value}</option>
      </#each>
    </select>
  </div>
`;

export default class HelloWorld extends Component {
  state = {
    list: [
      { id: 1, value: '选项1' },
      { id: 2, value: '选项2' }
    ]
  };

  render() {
    return tmplFn(this.state);
  }
}
```

* 直接放入React组件的render方法中也可以：

```js
import nj from 'nornj';

export default class HelloWorld extends Component {
  state = {
    list: [
      { id: 1, value: '选项1' },
      { id: 2, value: '选项2' }
    ]
  };

  render() {
    return nj`
      <div>
        <select>
          <#each {list}>
            <option value="{id}">{value}</option>
          </#each>
        </select>
      </div>
    `(this.state);
  }
}
```

* 模板函数的传入参数

每个`nj`模板函数在渲染时可以传入一个或多个参数，具体请参考[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/api/renderReact.html)。

## 使用nj模板函数渲染React组件

在这里介绍几种在`react-mst`项目模板中常用的在`nj`模板中使用React组件的方式(更多详细文档请参考[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/api/renderReact.html))：

* 使用在`nj`模板中全局注册的React组件：

在js中注册ant-Steps组件：

```js
import { Steps } from 'antd';
import nj from 'nornj';
import tmpls from './helloWorld.t.html';

nj.registerComponent({
  'ant-Steps': Steps
});

export default class HelloWorld extends Component {
  render() {
    return tmpls.helloWorld();
  }
}
```

然后就可以在模板中直接使用：

```html
<template name="helloWorld">
  <div>
    <ant-Steps>
      <ant-Steps.Step title="1 资料提交" description="" />
      <ant-Steps.Step title="2 人工审核" description="" />
      <ant-Steps.Step title="3 审核结果" description="" />
    </ant-Steps>
  </div>
</template>
```

* 将React组件对象放入某个`nj`模板函数中执行：

在js中将Steps组件对象放到模板函数的第一个参数内的components对象中：

```js
import { Steps } from 'antd';
import tmpls from './helloWorld.t.html';

export default class HelloWorld extends Component {
  render() {
    return tmpls.helloWorld({
      components: {
        'ant-Steps': Steps
      }
    });
  }
}
```

然后就可以在模板中使用了：

```html
<template name="helloWorld">
  <div>
    <ant-Steps>
      ...
    </ant-Steps>
  </div>
</template>
```

但这样使用的ant-Steps组件不是全局的，而是只在上述这次模板函数调用中有效。

* 在js文件中将React组件对象直接用`${}`参数的形式放入`nj`模板函数中执行，示例如下(详情请见[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/api/renderReact.html#%E7%9B%B4%E6%8E%A5%E5%9C%A8%E6%A8%A1%E6%9D%BF%E5%87%BD%E6%95%B0%E4%B8%AD%E4%BC%A0%E5%85%A5react%E7%BB%84%E4%BB%B6))：

```js
import { Button } from 'antd';

nj`
<${Button} type="primary" size="small" inline>
  <ant-Icon name="rocket" size={30} color="#900" />small
</${Button}>`;
```

## 使用@registerTmpl装饰器注册nj模板

上例中的HelloWorld组件如果需要在其他`nj`模板中调用，那么就可以添加@registerTmpl(具体请参考[NornJ官方文档](https://joe-sky.gitbooks.io/nornj-guide/api/renderReact.html#registertmpl))来进行注册，效果与使用`nj.registerComponent`相同：

```js
import { registerTmpl } from 'nornj-react';
import tmpls from './helloWorld.t.html';

@registerTmpl('HelloWorld')
export default class HelloWorld extends Component {
  render() {
    return tmpls.helloWorld(
      ...
    );
  }
}
```

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="cssModules.md"><b>使用css modules开发局部样式</b></a> →</p>