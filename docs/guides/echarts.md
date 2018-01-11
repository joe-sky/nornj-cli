# 使用Echarts图表组件

`Echarts`是常用的开源图表库之一。[FlareJ](https://github.com/joe-sky/flarej)库将`Echarts`与`NornJ`模板结合，使开发者可以分模块引用，并在`NornJ`模板中使用图表

## 使用方法

1. 在JSX中按"flarej/lib/components/ECharts/组件名"引入组件：
```js
import { Component } from 'react';
import { registerTmpl } from 'nornj-react';
import 'flarej/lib/components/ECharts/lineChart'; // 引入Echarts组件
import styles from './demo.scss';
import templates from './demo.t.html';
```

2. 配置echarts参数
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
3. 在`NornJ`模板中用"ec-*"作为组件名使用即可。各图表的用法请参考Echarts官网
```js
<template name="demoTable">
    <ec-BarChart {option} {data} />
</template>
```

也可以直接在JSX中使用`NornJ`模板
```js
render() {
    return nj`
      <ec-BarChart {option} {data} />
    `(this.state);
  }
```

和Echarts官网用法不同之处
* 组件名前需要加"ec-"
* 组件的传参使用`NornJ`模板语法
* series参数通过data属性传值


## 可能会遇到的问题
1. 项目中需要插件类图表，比如liquidFill、wordCloud
`FlareJ`将echarts及其相关的库以devDependencies的方式安装的，nornj-cli生成的package.json中可以看到dependencies中只有echarts, 因此需要自己手动安装引用相关js库
```js
    "echarts-liquidfill": "^1.0.3",
    "echarts-wordcloud": "^1.0.3",
```

2. 如果发现某些功能不生效，可能需要从echarts库引入相关js，比如markArea
```js
import 'echarts/lib/component/markArea';
```
3. 如果需要在一个图表上既有折线又有柱状图，该用什么组件？用`<ec-LineChart />`或`<ec-BarChart>`都是可以的。只要data数据配置相应的type值即可。

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/overview.md"><b>返回总览</b></a></p>