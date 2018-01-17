# 使用css modules开发局部样式

不同于`Vue`，`React`较为推崇`css in js`方案，即将css直接写在js中。社区也有很多优秀的先关开源组件，如`styled-components`等。

但`css modules`并不属于`css in js`范畴，它用几乎与css相同的API来实现常规css不具备的`局部样式`等功能，特别在`React`技术栈中也很常用，可作为`NornJ-cli`在浏览器端开发的首选css方案。

## 在独立的样式文件中编写css modules样式

`css modules`功能已默认集成至webpack的`css-loader`内。在`react-mst`项目模板中，我们将通过`css modules`规则解析的样式文件的loader规则设置为`*.m.scss`文件。

* 例如我们创建一个`helloWorld.m.scss`文件：

```css
.hello {
  font-weight: normal;
}

.links {
  color: blue;
}
```

上面的css类`.hello`和`.links`，最终会被`css modules`解析为带有自动生成后缀的类名。这样`.hello`和`.links`就只在引用到它们的组件内有效，而不会污染全局样式，如此就可以随意地命名css类名了。

* 也可以在`*.m.scss`文件内创建全局样式，使用`:global`：

```css
.hello {
  font-weight: normal;
}

:global {
  .links {
    color: blue;
  }
}
```

如上，`:global`内的`.links`类名在解析的时候不会添加后缀，就可以像正常写css那样应用于全局了。

关于更多`css modules`语法及特性可[参考这篇文章](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)。

## 将css modules样式放入nj模板中运行

<p align="left">← <a href="overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="mobx.md"><b>使用Mobx管理React组件状态</b></a> →</p>