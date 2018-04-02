# NornJ-cli

The CLI for scaffolding NornJ template projects, and do more things.

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
> react-mst
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

# 请选择要生成的页面类型
What type of page do you want to generate ?
> default  # 增删改查
  chart    # 图表
  form     # 表单
  empty    # 空页面

# 输入新创建的页面名称
Page Name: pageName
```

#### 选择项目模板

| 名称           | 描述                      |
|:---------------|:-------------------------|
| react-mst      | 基于React+Mobx-state-tree的单页面项目 |
| react-mobx     | 基于React+Mobx的多页面项目 |
| Y-Dept/template-saas | 基于React+Mobx-state-tree的SAAS化平台单页面项目 |
| Y-Dept/react-mobx-ls | 基于React+Mobx的多页面项目(接入零智平台) |

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