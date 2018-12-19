import React from '@react';
import './index.scss';

class P extends React.Component {
    config = {
        'navigationBarTextStyle': '#fff',
        'navigationBarBackgroundColor': '#0088a4',
        'navigationBarTitleText': 'view demo',
        'backgroundColor': '#eeeeee',
        'backgroundTextStyle': 'light'
    }
    render() {
        return (
            <view class="col">
                <view class="section">
                    <view class="section__title">flex-direction: row</view>
                    <view class="flex-wrp" style="flex-direction:row;">
                        <view class="flex-item bc_green">1</view>
                        <view class="flex-item bc_red">2</view>
                        <view class="flex-item bc_blue">3</view>
                    </view>
                </view>
                <view class="section">
                    <view class="section__title">flex-direction: column</view>
                    <view
                        class="flex-wrp"
                        style="height: 300px;flex-direction:column;"
                    >
                        <view class="flex-item bc_green">1</view>
                        <view class="flex-item bc_red">2</view>
                        <view class="flex-item bc_blue">3</view>
                    </view>
                </view>
            </view>
        );
    }
}

export default P;
