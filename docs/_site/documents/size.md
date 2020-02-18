
# 包大小限制

| 平台           | 主包与分包     | 总size                  |
|----------------|----------------|-------------------------|
| 微信小程序     | 2M             | 8MB                     |
| QQ小程序       | 2M             | 16MB                    |
| 支付宝小程序   | 1M             | 4M                      |
| 百度智能小程序 | 2M             | 8M                      |
| 字节跳动小程序 | 4MB,不支持分包                          |
| 快应用         | 1M             | 4MB（华为没分包，10MB） |


## 微信小程序

整个小程序所有分包大小不能超过8M； 单个分包、主包大小不能超过2M

开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小


## 支付宝小程序的大小查看

[https://docs.alipay.com/mini/framework/subpackages](https://docs.alipay.com/mini/framework/subpackages)

降级的整包产物大小限制为 4M，每个分包的大小限制为 2M

[体积检测](https://docs.alipay.com/mini/ide/upload)

## 百度智能小程序

整个小程序所有分包大小不超过 8M，单个分包/主包大小不能超过 2M。
[https://smartprogram.baidu.com/docs/develop/framework/subpackages/](https://smartprogram.baidu.com/docs/develop/framework/subpackages/)

开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小

## QQ小程序

整个小程序所有分包大小不能超过24M； 单个分包、主包大小不能超过2M

开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小

## 快应用的大小查看

[https://doc.quickapp.cn/framework/subpackage.html](https://doc.quickapp.cn/framework/subpackage.html)

整个快应用的所有分包大小不超过 4M
单个分包/基础包大小不能超过 1M

如果项目中没有配置subpackages，那么打包最终仅生成rpk后缀的文件，称为整包，拥有全部的页面与资源(即没有启用分包功能)。

如果项目中正确配置了subpackages，并且该版本的编译工具支持分包功能，那么打包最终会生成rpks后缀的文件，文件内部包含一个整包，以及所有的分包。分包文件后缀名为srpk。

为了做到开发时兼容老版本调试平台，生成rpks文件的同时，也会生成rpk整包文件。

快应用还有专门的发布命令

> npm run release

查看rpk的大小

## 字节跳动小程序的大小查看

代码不能超过4M，不支持分包

开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小
