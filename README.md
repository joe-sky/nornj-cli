# NornJ-cli

The CLI for scaffolding [NornJ](https://github.com/joe-sky/nornj) template projects, and do more things.

### 安装

```sh
npm install -g nornj-cli
```

### 使用方法

#### 创建项目初始代码

* 在当前目录下创建新项目目录：

```sh
nj init

# 请按上下键选择项目模板
Please select a project template:
> react-mst-universal
  react-mst
  react-mobx
  Y-Dept/template-saas
  Y-Dept/react-mobx-ls
  other

# 如果选择了other，则可输入任意模板名称
Template Name: anyTemplateName

# 输入新建的项目目录名称
Project Name: projectName
```

#### 在已有代码中增加新页面

* 进入已有项目目录后，输入如下命令创建新页面：

```sh
nj add-page [pageName]  # 或nj ap

# 请选择生成时要使用的页面模板
Which page template do you want to use?
> default  # 增删改查
  chart    # 图表
  form     # 表单
  empty    # 空页面

# 输入新创建的页面名称
Page Name: pageName
```

#### 在已有代码中增加新组件

* 进入已有项目目录后，输入如下命令创建新组件：

```sh
nj add-component [componentName]  # 或nj ac

# 请选择生成时要使用的组件模板
Which component template do you want to use?
> default       # 默认
  stateless     # 无状态组件
  higher-order  # 高阶组件

# 输入新创建的组件名称
Component Name: componentName
```

#### 在已有代码中增加新Store

* 进入已有项目目录后，输入如下命令创建新Store：

```sh
nj add-store [storeName]  # 或nj as

# 请选择生成时要使用的Store模板
Which store template do you want to use?
> default       # 默认使用axios
  default-fetch # 使用fetch

# 输入新创建的Store名称
Store Name: storeName
```

#### 选择项目模板

| 名称           | 描述                      | 模板源码地址                |
|:---------------|:-------------------------|:--------------------------|
| react-mst-universal      | 基于React+Mobx-state-tree的单页面项目<br><ul><li>组件开发规范默认使用`JSX`</li><li>样式开发默认集成了`styled-jsx`和`css-modules`</li><li>请求数据使用`axios`</li><li>echarts组件使用`echarts-for-react`</li><li>集成了可增强JSX开发的插件[babel-plugin-nornj-in-jsx](https://github.com/joe-sky/nornj/tree/master/packages/babel-plugin-nornj-in-jsx)</li></ul> | https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mst-universal |
| react-mst      | 基于React+Mobx-state-tree的单页面项目<br><ul><li>组件开发规范默认使用`NornJ`</li></ul> | https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mst |
| react-mobx     | 基于React+Mobx的多页面项目 | https://github.com/joe-sky/nornj-cli/tree/master/templates/react-mobx |
| Y-Dept/template-saas | 基于React+Mobx-state-tree的SAAS化平台单页面项目 | https://github.com/Y-Dept/template-saas |
| Y-Dept/react-mobx-ls | 基于React+Mobx的多页面项目(接入零智平台) | https://github.com/Y-Dept/react-mobx-ls |

#### 使用自定义模板

1. 在github上创建一个新的模板项目即可，结构类似于[Y-Dept/template-saas(单页)](https://github.com/Y-Dept/template-saas)或[Y-Dept/react-mobx-ls(多页)](https://github.com/Y-Dept/react-mobx-ls)。

2. 然后使用以下命令即可下载并初始化：

```sh
nj init

# 请按上下键选择项目模板
Please select a project template:
  react-mst-universal
  react-mst
  react-mobx
  Y-Dept/template-saas
  Y-Dept/react-mobx-ls
> other

# 选择other，然后按照github地址输入"用户(或组织)名/项目名"，例如"https://github.com/Y-Dept/template-saas"中的"Y-Dept/template-saas"
Template Name: UserName/ProjectName
```

#### 查看cli当前版本

```sh
nj -v
```

#### cli版本更新

```sh
nj upgrade  # 更新cli版本到最新版
```

#### 安装npm包

与`npm install`相同，区别在于部署在私服上的包会自动从私服安装：

```sh
nj install  # 或nj i
```

#### 更新npm包

与`npm update`相同，区别在于部署在私服上的包会自动从私服更新：

```sh
nj update  # 或nj up
```

### 可选择使用npm国内镜像

当网络访问npm比较慢时，可选择使用`npm国内镜像`来安装。方法为在各命令后添加`--cnpm`参数：

```sh
nj init --cnpm
nj upgrade --cnpm
nj install --cnpm
nj update --cnpm
```

### React + Mobx + 前端模板相关技术学习资料

* [学习资料汇总](https://github.com/joe-sky/nornj-cli/blob/master/docs/learningGuide.md)
* [快速上手文档](https://github.com/joe-sky/nornj-cli/blob/master/docs/guides/overview.md)

## License

MIT