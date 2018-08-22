import React from '../../../../ReactWX';
import './index.less';

class P extends React.Component {
    constructor() {
        this.state = {
            focus: false
        };
    }

    bindTextAreaBlur(e) {
        console.log(e.value);
    }

    render() {
        return (
            <view class="page-body">
                <view class="page-section">
                    <view class="page-section-title">
                        输入区域高度自适应，不会出现滚动条
                    </view>
                    <view class="textarea-wrp">
                        <textarea onBlur={this.bindTextAreaBlur} auto-height />
                    </view>
                </view>

                <view class="page-section">
                    <view class="page-section-title">
                        这是一个可以自动聚焦的textarea
                    </view>
                    <view class="textarea-wrp">
                        <textarea auto-focus="true" style="height: 3em" />
                    </view>
                </view>
            </view>
        );
    }
}

export default P;
