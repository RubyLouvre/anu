# 小程序组件规范


## 兼容性

   * 微信小程序: 6.7.2 及以上能支持分包的版本
   * QQ小程序: 能支持分包的版本
   * 支付宝小程序： 10.1.60 能支持分包的版本
   * 百度小程序： 2.2.3 能支持分包的版本
   * 快应用：小米等厂商1030， 华为1040
   * 字节跳动小程序：1.6(目前它不支持分包)

针对小程序的Size限制，挑选各小程序的客户端版本时，以最先支持分包的版本为基准线。


## 升级

如果小程序平台出现新的规范，经TC/业务线TL商议确认，对其中必须的功能，nanachi-cli需要在半个月内完成兼容。
nanachi完成兼容之后，需周知业务线在半个月之内做对应的更新调整。
需要特殊周期的业务线，需提前与所有相关团队达成一致。根据目前小程序的现状，最长不应该超过一个月。

如果有紧急bug，nanachi需一天之内进行修复，并周知业务线。相关业务线需配合上线。
日常升级，根据目前的情况，最短一个月升级一个版本。

## 目录规则

* 如果你的组件想打包到主包中，那么它应该在pages目录的同级文件夹components中
* 如果你的组件想打包到分包中，那么它应该放在pages/xxxx/components中，xxxx为业务线的名字，如hotel, flight, vacation
* 如果你的组件不包含JSX中，只是普通的工具方法，并且打包到主包中，那么它应该在pages目录的同级文件夹common中
* 如果你的组件不包含JSX中，只是普通的工具方法，并且打包到分包中，那么它应该在pages/xxxx/common中


## 组件编写规范

组件本身如果是用nanachi来写，请必须引入`@react`  及以React方式编写（因为@react可能编译成ReactWX.js, ReactQuick.js, ReactBu.js, ReactAli.js）。下面是一个经典的组件

```jsx
import React from '@react';
import './index.scss';

class TrainOrderFillRobFooterView extends React.Component {
    constructor() {
        super();
    }

    static defaultProps = {
        footerData: {}
    };

    render() {
        return (
            <div>
                <div class="footer-container-iphoneX">
                    <div className="footer-content-container-iphoneX">
                        {this.props.footerData.priceDetailModalData && !this.props.footerData.priceDetailModalData.priceDetailAnimation && <div class="separator__line"/>}
                        <div style="display: flex; height: 50px;">
                            <div className="total-price-container">
                                <div class="rate-success-rate-container">
                                    <text class="rate-success-rate-title">抢票成功率</text>
                                    <text class="rate-success-rate-text">{this.props.footerData.robSuccessRate ? this.props.footerData.robSuccessRate : '- -'}</text>
                                </div>
                            </div>
                            <div className="commit-order-btn-iphoneX" onTap={this.props.goToRobOrderFillConfirm}>下一步</div>
                        </div>
                    </div>
                </div> 
            </div>
        );
    }
}

export default TrainOrderFillRobFooterView;
```

如果以非nanachi编写，希望在命名上符合其他规则。

1. 有关组件的编写请见[这里](./component.md)  

2. 有关JSX的注意事项请见[这里](./jsx.md)


为了确保组件不应该混杂其他小程序的专有代码，我们提供了 `process.env.ANU_ENV`  变量用于编译时打包平台相关的逻辑。这个变量只能用于JS，不能用于JSX。详见[这里](./import_js.md)


## 样式规范
为了良好地兼容快应用，小程序都必须使用flexbox布局，不要使用绝对定位与浮动。所有不支持的样式写法都会在nanachi 编译时发出警告。
详见[这里](./style.md)



## 文件引用规范

页面不能超级引用组件的样式文件。

组件也产能超级引用页面的样式文件。


## 代码规范

- 使用驼峰命名规范
- 业务线带上标识自己业务线的前缀
- 符合eslint规范
- 编译0 error

