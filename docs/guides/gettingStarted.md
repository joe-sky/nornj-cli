# 快速起步

本节我们将使用`NornJ-cli`快速创建一个可以在浏览器中运行的项目脚手架。

## 安装CLI脚手架

输入命令：

```sh
npm install -g nornj-cli      # mac下需要在前面加sudo命令
```

## 使用CLI脚手架初始化react + mobx-state-tree的前端项目

输入以下命令，会在当前目录创建新项目初始代码：

```sh
nj init

Template Name: react-mst               # 项目模板名称
Project Name: react-mst-test           # 新创建的项目名称
Do you want to npm install(Y/N)?       # 选择是否安装npm包
```

输入`y`后，按回车键就会自动安装项目依赖的各npm包，大概等几分钟就可以装好：

![npm install](images/started1.png?raw=true)

## 生成的项目文件结构

```
.
├── dist                              # 打包后的生产文件
├── server                            # 本地mock server
    ├── routes                          # 各页面mock接口
        ├── page1.js                      # 页面1接口
        ├── page2.js                      # 页面2接口
        ...       
    └── app.js                          # mock server入口
├── src                               # 源代码
    ├── stores                          # 数据集
        ├── pages                         # 功能页面Store
            ├── page1Store.js              # 页面1Store
            ├── page2Store.js              # 页面2Store
            ...       
        ├── commonStore.js                # 通用Store
        ├── headerStore.js                # 头部Store
        ├── siderStore.js                 # 侧边栏Store
        └── rootStore.js                  # 根Store
    ├── utils                           # 通用工具
    ├── vendor                          # 第三方工具包
    └── web                             # 页面代码
        ├── components                    # 通用组件
            ├── header                      # 头部组件
                ├── header.js                 # 头部组件逻辑
                ├── header.scss               # 头部组件样式
                └── header.t.html             # 头部组件模板
            ├── sider                       # 侧边栏组件
                ├── sider.js                  # 侧边栏组件逻辑
                ├── sider.scss                # 侧边栏组件样式
                └── sider.t.html              # 侧边栏组件模板
            ...       
        ├── css                           # 通用样式
            ├── app.scss                    # 全局样式
            └── common.scss                 # 全局通用sass工具函数
        ├── images                        # 图片
        ├── misc                          # 杂项
        └── pages                         # 页面目录
            ├── page1                       # 功能页面1
                ├── page1.js                  # 页面1逻辑
                ├── page1.m.scss              # 页面1样式
                └── page1.t.html              # 页面1模板
            ├── page2                       # 功能页面2
                ├── page2.js                  # 页面2逻辑
                ├── page2.m.scss              # 页面2样式
                └── page2.t.html              # 页面2模板
            ...       
├── templates                         # 模板文件目录，供CLI脚手架创建页面等功能用
├── .babelrc                          # Babel config
├── .eslintrc                         # Eslint config
├── .gitignore       
├── app-web.js                        # 主页入口
├── Bundle.js                         # 配合bunder-loader的React组件
├── index.template-web.html           # 主页面html
├── routes-web.js                     # 路由配置
├── webpack.config.js                 # webpack配置文件
└── package.json       
```

## 运行项目

用`cd react-mst-test`命令进入我们刚创建好的项目目录，然后输入命令：

```sh
npm run dev-web
```

然后会开始运行`webpack`构建过程，构建成功后请在浏览器输入地址：`localhost:8080/dist/web`即可查看页面：

![run page](images/started2.png?raw=true)

## 添加新页面

在`react-mst-test`目录下输入如下命令：

```sh
nj ap
Page Name: newChartPage                   # 新创建的页面名称
Do you want to generate chart page(Y/N)?  # 是否生成图表页面
```

输入`y`后，按回车键就会立即创建好一个新建的图表页面，且各子目录下的`newChartPage`文件都已创建好了：

![run page](images/started3.png?raw=true)

## 运行新添加的页面

打开`react-mst-test/src/stores/rootStore.js`文件，将这里的第一个菜单中的第一个页面名称`Page1_1`改为`NewChartPage`：

```js
sider: types.optional(SiderStore, {
  isOpen: false,
  current: 'page1',
  menuData: [{
    type: 'group',
    index: 'Menu1_1',
    name: '一级菜单1',
    expanded: false,
    children: [{
      type: 'group',
      index: 'Menu2_1',
      name: '二级菜单1',
      expanded: false,
      children: [
        { type: 'item', level: 3, link: '/NewChartPage', index: 'NewChartPage', name: '页面1-1' },
        { type: 'item', level: 3, link: '/Page1_2', index: 'Page1_2', name: '页面1-2' },
      ]
    }, 
    ...
  }, 
  ...]
}),
```

再次运行命令进行构建：

```sh
npm run dev-web
```

然后在浏览器输入地址：`localhost:8080/dist/web`查看页面，新创建的图表页已展示出来了：

![run page](images/started4.png?raw=true)

## 下一步

至此，我们已创建好了一个基于`React + Mobx + NornJ`的前端项目，下一步我们将逐个为项目中使用的技术做一个详实的介绍。

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/guides/overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/guides/nornjTemplate.md"><b>NornJ前端模板</b></a> →</p>
