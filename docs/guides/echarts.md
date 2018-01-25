# 使用Echarts图表组件

[`Echarts`](http://echarts.baidu.com/index.html)是常用的开源图表库之一。[FlareJ](https://github.com/joe-sky/flarej)库将`Echarts`与`NornJ`模板结合，可以以分模块引用的方式在`NornJ`模板中使用`Echarts`图表。

## 使用方法

1. 在js中按`flarej/lib/components/ECharts/图表组件名`引入组件：

```js
import { Component } from 'react';
import { registerTmpl } from 'nornj-react';
import BarChart from 'flarej/lib/components/ECharts/barChart';  //引入Echarts组件
import styles from './demo.m.scss';
import templates from './demo.t.html';
```

2. 配置echarts参数：

```js
export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      option: {  //配置项，具体参考echarts图表的option如何配置
        grid: {
          y: 20,
          x: 40,
          y2: 25,
          x2: 30
        }
      },
      data: [  //数据，相当于series参数，具体参考echarts图表的series如何配置
        ...
      ]
    };
  }

  render() {
    return templates.demoTable(this.state, this.props, this, {
      styles
    });
  }
}
```

3. 在`NornJ`模板中用`ec-*`作为组件名使用即可。各图表的用法请参考[Echarts官网](http://echarts.baidu.com/index.html)。

```html
<template name="demoTable">
  <ec-BarChart width={500} height={300} {option} {data} />
</template>
```

* 也可以直接在js文件中使用`NornJ`模板，效果和写在`*.t.html`中相同：

```js
export default class Demo extends Component {
  ...

  render() {
    return nj`
      <ec-BarChart width=${500} height=${300} {option} {data} />
    `(this.state, this.props, this, {
      styles
    });
  }
}
```

* 和`Echarts`官方用法的不同之处：

在官方用法中，图表的`option`参数中须要包含`series`参数；而使用`ec-*`组件时需要将`series`参数单独作为`data`属性传入图表组件中。

## 可能会遇到的问题

1. 项目中需要插件类图表(比如`liquidFill`、`wordCloud`)时，需要在自己的项目中手动安装相关的依赖包。

package.json：

```js
"echarts-liquidfill": "^1.0.3",
"echarts-wordcloud": "^1.0.3",
```

2. 如果发现某些功能不生效，可能需要从`echarts`库引入相关js，比如markArea：

```js
import 'echarts/lib/component/markArea';
```

更多echarts的js模块[可点这里查看](https://github.com/ecomfe/echarts/blob/master/index.js)。

3. 如果需要在一个图表上既有折线又有柱状图，该用什么组件？

用`<ec-LineChart />`或`<ec-BarChart>`都是可以的，只要`data`属性数据配置相应的`type`值即可。

4. `Mobx`的变量传给`Echarts`组件后没按照预期展示数据

此种情况通常需要使用Mobx的`toJS`方法转换数据后再传给`Echarts`组件，`NornJ`模板中已默认集成了`toJS`方法：

```html
<ec-BarChart data={toJS(page1.chartData)} ... />
```

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="webpackConfig.md"><b>Webpack配置文件</b></a> →</p>