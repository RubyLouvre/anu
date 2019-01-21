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

详见 https://rubylouvre.github.io/nanachi/index.html 或  https://github.com/RubyLouvre/anu/tree/master/packages/render/miniapp


![image](https://user-images.githubusercontent.com/190846/45038189-53f44a80-b093-11e8-9ecb-a4080f21b262.png)

## 开发者交流群
![411547729622_ pic](https://user-images.githubusercontent.com/8794029/51320198-0dc7e280-1a9a-11e9-8c03-cfbd661c84d6.jpg)
