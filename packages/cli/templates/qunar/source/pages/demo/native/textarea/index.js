import React from '@react';
import './index.scss';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            focus: false
        };
    }

    bindTextAreaBlur(e) {
        // eslint-disable-next-line
        console.log(e.value);
    }

    render() {
        return (
            <view class="page-body column-layout">
                <view class="page-section column-layout">
                    <view class="page-section-title">
                        输入区域高度自适应，不会出现滚动条
                    </view>
                    <view class="textarea-wrp">
                        <textarea onBlur={this.bindTextAreaBlur} autoHeight={true} />
                    </view>
                </view>

                <view class="page-section column-layout">
                    <view class="page-section-title">
                        这是一个可以自动聚焦的textarea
                    </view>
                    <view class="textarea-wrp">
                        <textarea autoFocus={true} style="height: 200rpx" />
                    </view>
                </view>
            </view>
        );
    }
}

export default P;
