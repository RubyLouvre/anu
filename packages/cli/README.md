# 娜娜奇脚手架

> 以React方式高效开发小程序

这只是anu的一个扩展，通过实现不同的render，以支持在微信小程序，百度小程序，支付宝小程，快应用，H5， hybird上运行。

## 安装

npm
```sh
npm install nanachi-cli -g
```

yarn
```sh
yarn global add nanachi-cli
```

## 使用方式
1. nanachi init `<project-name> ` 创建工程<br />
2. `cd <project-name> && npm i ` 安装依赖<br />
3. `nanachi watch:[wx|bu|ali|quick]` 监听构建小程序<br />
4. `nanachi build:[wx|bu|ali|quick]` 构建小程序<br />
5. 用微信开发工具打开当中的dist目录，自己在source目录中进行开发<br />

注意：快应用下构建结束后，需要执行以下三步骤
1. npm install <br />
2. npm run build <br />
3. npm run server <br />
详情请见快应用文档

## nanachi api
```javascript
const nanachi = require('nanachi-cli');
nanachi({
    /**
     * @Boolean
     * 是否使用watch模式，默认值：false
     */
    watch,
    /**
     * @Enum ['wx', 'ali', 'bu', 'tt', 'quick']
     * 平台，默认值：wx
     */
    platform,
    /**
     * @Boolean
     * 是否使用线上beta核心库，默认值：false
     */
    beta,
    /**
     * @Boolean
     * 是否使用最新schnee-ui，默认值：false
     */
    betaUi,
    /**
     * @Boolean
     * 是否使用压缩模式，默认值：false
     */
    compress,
    /**
     * @Boolean
     * 是否是huawei平台，默认值：false
     */
    huawei,
    /**
     * @Array
     * 自定义预处理loaders，默认值：[]
     */
    preLoaders,
    /**
     * @Array
     * 自定义后处理loaders，默认值：[]
     */
    postloaders,
    /**
     * @Array
     * 自定义添加webpack module.rules规则，默认值：[]
     */
    rules,
    /**
     * @Array
     * 自定义webpack插件，默认值：[]
     */
    plugins,
    /**
     * @function complete
     * 解析完成回调
     * (err, result) => { }
     * err: 错误
     * result: webpack打包信息
     */ 
    complete
});
```

详见 https://rubylouvre.github.io/nanachi/index.html 或  https://github.com/RubyLouvre/anu/tree/master/packages/render/miniapp


![image](https://user-images.githubusercontent.com/190846/45038189-53f44a80-b093-11e8-9ecb-a4080f21b262.png)

## 开发者交流群
![411547729622_ pic](https://user-images.githubusercontent.com/16398401/52927213-5cf08400-3374-11e9-9f54-ccbad8b61ea7.jpeg)
