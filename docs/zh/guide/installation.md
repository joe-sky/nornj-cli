# 安装

::: warning 关于旧版本
NornJ CLI 从 `v0.5.0` latest 版开始将不兼容 `v0.4.x` 及以前的版本。
如果你已经全局安装了旧版本的 `nornj-cli` ，你需要先通过 `npm uninstall nornj-cli -g` 或 `yarn global remove nornj-cli` 卸载它。
:::

::: tip Node 版本要求
NornJ CLI 需要 [Node.js](https://nodejs.org/) 8.9 或更高版本 (推荐 8.11.0+)。你可以使用 [nvm](https://github.com/creationix/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在同一台电脑中管理多个 Node 版本。
:::

可以使用下列任一命令安装这个新的包：

``` bash
npm install -g nornj-cli
# OR
yarn global add nornj-cli
```

安装之后，你就可以在命令行中访问 `nj` 命令。你可以通过简单运行 `nj`，看看是否展示出了一份所有可用命令的帮助信息，来验证它是否安装成功。

你还可以用这个命令来检查其版本是否正确：

```bash
nj -v
```
