## 榫-脚手架（Tenon-Scaffold）

**榫-脚手架**是一个用于帮助您快速创建使用了脚本API的Minecraft基岩版附加包项目的工具。通过这个小玩意儿，您可以使用命令一键搭建起可用的项目模板。

### 使用

首先您需要通过以下命令安装榫-脚手架

```
npm i tenonffold -g
```

安装成功后，您就可以使用`tenonffold`命令进行项目的初始化了

我们使用以下命令进行项目的初始化：

```
tenonffold init <项目名称>
```

之后根据提示进行选择相应的模板进行创建并键入项目相关信息即可。

以下是大致创建流程展示：

```
> tenonffold init TestAddon
现有的可选模板：
[1] 1.19.5x_原生
[2] 1.19.5x_原生_Webpack
请选择需要创建的模板版本(输入对应序号数字即可)： 1
? 请输入包名称： 测试包
? 请输入包描述文本： 脚手架测试包
? 请输入包版本： 1.0.0
? 请输入作者名称： QianShanyao
开始克隆模板...
√ 模板克隆成功
安装node模块...
√ 项目初始化成功
```

### 贡献

目前该项目还是非常简陋的一个项目，还在不断更新中，之后计划支持的功能：

- [ ] 更多不同场景的模板

- [ ] 自动打包功能

  ......

当然如果您发现了问题，欢迎给我们提issue，或者您是有经验的开发者，也欢迎您通过Pull Request对本仓库进行贡献~