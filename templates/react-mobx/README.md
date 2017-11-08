vic-react-mobx-boilerplate
====

> `React`+`Mobx`项目模板，可以此项目为模板快速创建新项目。

## 安装依赖包

```sh
npm install
```

## 构建命令

```sh
npm run dev             #启动node端本地调试server，然后使用http://localhost:5004访问页面
npm run dev-web         #启动java端本地调试server，然后使用http://aicm.dev.jd.com:5004访问页面
npm run build           #构建全部代码到node端本地server目录
npm run build-web-dev   #构建全部代码到java端web项目目录，使用开发环境配置
npm run build-web       #构建全部代码到java端web项目目录，使用生产环境配置
npm run lint            #执行代码规范检测
```

> 注：部署测试环境或上线生产环境代码时，请使用`npm run build-web`命令将ui代码构建到web项目的src目录下。

* 生成发布版js代码

```sh
npm run lib             #将es6代码转换为es5后，以与src模板相同的结构保存在lib目录
```