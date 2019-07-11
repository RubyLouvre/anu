import React from '@react';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
            indicatorDots: true,
            vertical: false,
            autoplay: false,
            circular: false,
            interval: 2000,
            duration: 500,
            previousMargin: 0,
            nextMargin: 0
        };
    }

    changeProperty(e) {
        var propertyName = e.currentTarget.dataset.propertyName;

        var newData = {};
        newData[propertyName] = e.value;
        this.setState(newData);
    }

    changeIndicatorDots() {
        this.setState({
            indicatorDots: !this.state.indicatorDots
        });
    }

    changeAutoplay() {
        this.setState({
            autoplay: !this.state.autoplay
        });
    }

    intervalChange(e) {
        this.setState({
            interval: e.value
        });
    }

    durationChange(e) {
        this.setState({
            duration: e.value
        });
    }

    render() {
        return (
            <view>
                <view class="page-body">
                    <view class="page-section page-section-spacing swiper">
                        <swiper
                            indicator-dots={this.state.indicatorDots}
                            autoplay={this.state.autoplay}
                            circular={this.state.circular}
                            vertical={this.state.vertical}
                            interval={this.state.interval}
                            duration={this.state.duration}
                            previous-margin={this.state.previousMargin + 'px'}
                            next-margin={this.state.nextMargin + 'px'}
                        >
                            {this.state.background.map(function(item) {
                                return (
                                    <swiper-item>
                                        <view class={'swiper-item ' + item} />
                                    </swiper-item>
                                );
                            })}
                        </swiper>
                    </view>
                    <view class="page-section">
                        <view class="weui-cells weui-cells_after-title">
                            <view class="weui-cell weui-cell_switch">
                                <view class="weui-cell__bd">指示点</view>
                                <view class="weui-cell__ft">
                                    <switch
                                        checked={this.state.indicatorDots}
                                        onChange={this.changeProperty}
                                        data-property-name="indicatorDots"
                                    />
                                </view>
                            </view>
                            <view class="weui-cell weui-cell_switch">
                                <view class="weui-cell__bd">自动播放</view>
                                <view class="weui-cell__ft">
                                    <switch
                                        checked={this.state.autoplay}
                                        onChange={this.changeProperty}
                                        data-property-name="autoplay"
                                    />
                                </view>
                            </view>
                            <view class="weui-cell weui-cell_switch">
                                <view class="weui-cell__bd">衔接滑动</view>
                                <view class="weui-cell__ft">
                                    <switch
                                        checked={this.state.circular}
                                        onChange={this.changeProperty}
                                        data-property-name="circular"
                                    />
                                </view>
                            </view>
                            <view class="weui-cell weui-cell_switch">
                                <view class="weui-cell__bd">竖向</view>
                                <view class="weui-cell__ft">
                                    <switch
                                        checked={this.state.vertical}
                                        onChange={this.changeProperty}
                                        data-property-name="vertical"
                                    />
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="page-section page-section-spacing">
                        <view class="page-section-title">
                            <text>幻灯片切换时长(ms)</text>
                            <text class="info">{this.state.duration}</text>
                        </view>
                        <slider
                            value={this.state.duration}
                            min="500"
                            max="2000"
                            onChange={this.changeProperty}
                            data-property-name="duration"
                        />
                        <view class="page-section-title">
                            <text>自动播放间隔时长(ms)</text>
                            <text class="info">{this.state.interval}</text>
                        </view>
                        <slider
                            value={this.state.interval}
                            min="2000"
                            max="10000"
                            onChange={this.changeProperty}
                            data-property-name="interval"
                        />
                        <view class="page-section-title">
                            <text>前边距(px)</text>
                            <text class="info">
                                {this.state.changeProperty}
                            </text>
                        </view>
                        <slider
                            value={this.state.previousMargin}
                            min="0"
                            max="50"
                            onChange={this.changeProperty}
                            data-property-name="previousMargin"
                        />
                        <view class="page-section-title">
                            <text>后边距(px)</text>
                            <text class="info">{this.state.nextMargin}</text>
                        </view>
                        <slider
                            value={this.state.nextMargin}
                            min="0"
                            max="50"
                            onChange={this.changeProperty}
                            data-property-name="nextMargin"
                        />
                    </view>
                </view>
            </view>
        );
    }
}

export default P;
