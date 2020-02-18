# 拆库开发

拆库开发亦称分仓库开发。

## 拆库开发能解决哪些问题？

想象一下，如果一个小程序非常大，涉及多条业务线，每条业务线有自己的开发一个频道。 如果没有拆库功能，本地开发时，需要将整个工程全量 clone 到本地然后进行开发。

一旦项目体量大起来（业务线多起来），上面这种方式很容易不小心误触别业务线的代码，并且全量编译的时间更长，效率低。

在开发时：
1. <font color="red">如何能让自己业务线代码保持独立，只专注于本业务线代码？</font>
2. <font color="red">如何自由安装在开发中所依赖的其他业务线代码呢？</font>
<br>

这，就是 nanachi 拆库开发所要解决的问题。


## 如何对代码进行拆库？

要使用 nanachi 拆库功能，首先要把各业务线拆分成“拆库工程”。

我们允许每个业务线都独立建一个github/gitlab仓库进行独立开发，**<font color="red">每个仓库需要保持 nanachi 工程所必须的目录结构（这是必须的）</font>**。


1. **建立自己业务线的 git 工程。**
2. **将自己的业务线代码抽成符合 nanachi 规范的目录结构**。


**<font color="red">
注意事项：应该拆库出一个“主包拆库工程”，主包中必须含有app.js。这是开发依赖，当用户开发自己的项目时，必须先要安装含有app.js的主包
</font>**

举个栗子：比如我们 qunar 有的**火车票业务线**和**酒店业务线**，如何针对这两个业务线进行拆库呢？


### 一：拆库主包工程（包含app.js）
1. 工程地址：yourAddress/nanachi_app_home.git
2. 工程结构：
![json](./chaika_home_module_dir.jpg)


### 二：酒店业务线拆库工程
1. 工程地址：yourAddress/nanachi_app_hotel.git
2. 工程结构：
![json](./chaika_hotel_module_dir.jpg)


### 三：火车票业务线拆库工程
1. 工程地址：yourAddress/nanachi_app_train.git
2. 工程结构：
![json](./chaika_train_module_dir.jpg)


### 四：在业务线的 package.json 需要进行简单配置
```json
{
  "nanachi": {
    "chaika": true //这是告诉 nanachi，当前快发模式为“拆库”模式。
  }
}
```

## 拆库关键文件说明
**app.json**：注意上面的拆库目录结构都有一个**app.json**，内容为：

```json
{
    "pages": [
        "pages/plat/pageA/index",
        "pages/plat/pageB/index"
    ],
    "nanachi":{
        "alias": {
            "@hotel/common": "source/common/hotel"
        }
    },
    "order": 100
}
```
- pages 字段为数组，pages 里面的路由将会被注入到 app.js 中，用以被 nanachi 编译。
- nanachi 字段即为 package.json 中的 nanachi 的配置，会被合并到 package.json 中。
- order 字段为路由排序标识，order值越大，最后打包到app.json中的这些路由排序越靠前。

## 如何使用 nanachi 拆库
1. clone 你自己的业务线代码: `git clone git@xxx.git`.
   
2. 安装你的项目依赖的其他业务线拆卡工程：`nanachi install git@otherProject.git -b branchName`（跟git   clone一回事）。
   <br><font color="red">注意：首先要安装“拆库主包工程”，即包含 app.js 的拆卡工程，这是所有业务线的开发，运行依赖。再根据实际场景决定是否需要安装其他拆卡工程。</font>

3. nanachi watch

相比之前的普通模式开发，其实就多了步骤2。

## 自定义 install 拆库工程

nanachi默认只支持install git 工程（nanachi install xx@yyy.git --branch yourBranch)。

但 nanachi 支持用户可以自定义安装方式，比如 install 压缩包。

命令行：`nanachi install tarName@version`

但需要一些额外配置。在你的项目工程跟目录中新建一个 `nanachi.config.js` 配置文件。
```
module.exports = {
    chaikaConfig: {
        onInstallTarball: function(tarName, version){
            let preUrl = 'http://xxx/yyy';
            let tarUrl = `${preUrl}/${version}/${version}/${tarName}-${version}.zip`;
            return tarUrl;
        }
    }
}
```
在该配置中生命周期 `onInstallTarball` 有两个参数。分别代表压缩包名，已经压缩包版本。该函数返回值就是压缩包的远程地址。

当执行命令`nanachi install tarName@version`时候，配置中的  `onInstallTarball`函数会劫持命令行中 `tarName` 和 `version`, 并作为函数的参数。你只需要在该函数中返回一个压缩包的远程地址，nanachi 就会帮你下载。

## 批量 install 拆库工程。
此功能需在你当前项目的package.json中配置`modules`字段
```
{
   "modules": {
    "yourModuleName": "yourBranch",
    "yourModuleName": "yourTag"
  }
}
```
然后命令行执行 `nanachi install`, 则会批量安装`modules`字段里面配置的所有拆卡工程。


## 之前使用 "chaika" 工具的同学如何迁移？
1. 安装依赖拆库工程的方式变为：`nanachi install ...`
2. 在自己业务线拆库工程`package.json`中配置字段。
   ```json
      {
        "nanachi": {
          "chaika": true //这是告诉 nanachi，当前快发模式为“拆库”模式。
        }

   ```
## 注意事项
1. 配置文件，如wxConfig.json，aliConfig.json, ..., app.json需要放在拆库工程的**source**目录下, project.config.json, package.json等需要放在拆库工程**根目录下**。
2. nanachi拆卡模式对各配置文件合并时，nanachi会将冲突暴露。如果遇到配置冲突，需用户自行解决冲突。
   ![json](./chaka_confict.jpg)


