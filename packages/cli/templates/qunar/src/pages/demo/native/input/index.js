import React from '@react';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            focus: false,
            inputValue: ''
        };
    }

    bindButtonTap() {
        this.setState({
            focus: true
        });
    }

    bindKeyInput(e) {
        this.setState({
            inputValue: e.value.trim()
        });
    }

    bindReplaceInput(e) {
        // eslint-disable-next-line
        console.log(e);
        var value = e.value;
        var pos = e.cursor;
        if (pos != -1) {
            //光标在中间
            var left = e.value.slice(0, pos);
            //计算光标的位置
            pos = left;
        }

        // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        // issues: input无法接受函数handler返回值？
        return {
            value: value.replace(/11/g, '2'),
            cursor: pos
        };
    }

    render() {
        return (
            <div>
                <view class="page-body">
                    <view class="page-section">
                        <view class="weui-cells__title">
                            可以自动聚焦的input
                        </view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    auto-focus
                                    placeholder="将会获取焦点"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">
                            控制最大输入长度的input
                        </view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    maxlength="10"
                                    placeholder="最大输入长度为10"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">
                            实时获取输入值：
                            {this.state.inputValue}
                        </view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    maxlength="10"
                                    onInput={this.bindKeyInput}
                                    placeholder="输入同步到view中"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">控制输入的input</view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    onInput={this.bindReplaceInput}
                                    placeholder="连续的两个1会变成2"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">控制键盘的input</view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    onInput={this.bindHideKeyboard}
                                    placeholder="输入123自动收起键盘"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">数字输入的input</view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    type="number"
                                    placeholder="这是一个数字输入框"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">密码输入的input</view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    password
                                    type="text"
                                    placeholder="这是一个密码输入框"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">带小数点的input</view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    type="digit"
                                    placeholder="带小数点的数字键盘"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">身份证输入的input</view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    type="idcard"
                                    placeholder="身份证输入键盘"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells__title">
                            控制占位符颜色的input
                        </view>
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_input">
                                <input
                                    class="weui-input"
                                    placeholder-style="color:#F76260"
                                    placeholder="占位符字体是红色的"
                                />
                            </view>
                        </view>
                    </view>
                </view>
            </div>
        );
    }
}

P.defaultProps = {
    name: 'zhangsan'
};

export default P;
