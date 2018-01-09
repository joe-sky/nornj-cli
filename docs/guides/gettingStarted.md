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

```bash
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

然后会开始运行`webpack`构建过程，构建成功后请在浏览器输入地址：`localhost:8080/dist/web`即可运行页面：

![run page](images/started2.png?raw=true)

<p align="left">← <a href="https://github.com/joe-sky/nornj-cli/blob/master/docs/overview.md"><b>返回总览</b></a></p>
<p align="right"><a href="#"><b>NornJ前端模板</b></a> →</p>