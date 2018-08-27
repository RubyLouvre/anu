import React from '@react';
import './index.less';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            checkboxItems: [
                { name: 'USA', value: '美国' },
                { name: 'CHN', value: '中国', checked: 'true' },
                { name: 'BRA', value: '巴西' },
                { name: 'JPN', value: '日本', checked: 'true' },
                { name: 'ENG', value: '英国' },
                { name: 'TUR', value: '法国' }
            ],
            radioItems: [
                { name: 'USA', value: '美国' },
                { name: 'CHN', value: '中国', checked: 'true' },
                { name: 'BRA', value: '巴西' },
                { name: 'JPN', value: '日本' },
                { name: 'ENG', value: '英国' },
                { name: 'TUR', value: '法国' }
            ],
            hidden: false
        };
    }

    checkboxChange(e) {
        //待调试
        var checked = e.value;
        var changed = {};
        for (var i = 0; i < this.state.checkboxItems.length; i++) {
            if (checked.indexOf(this.state.checkboxItems[i].name) !== -1) {
                changed['checkboxItems[' + i + '].checked'] = true;
            } else {
                changed['checkboxItems[' + i + '].checked'] = false;
            }
        }
        // eslint-disable-next-line
        console.log(changed);
        this.setState(changed);
    }

    radioChange(e) {
        var checked = e.value;
        var changed = {};
        for (var i = 0; i < this.state.radioItems.length; i++) {
            if (checked.indexOf(this.state.radioItems[i].name) !== -1) {
                changed['radioItems[' + i + '].checked'] = true;
            } else {
                changed['radioItems[' + i + '].checked'] = false;
            }
        }
        // eslint-disable-next-line
        console.log(changed);
        this.setState(changed);
    }
    render() {
        return (
            <div class="container">
                {this.a}
                <view class="section section_gap">
                    <view class="section__title">表单组件在label内</view>
                    <checkbox-group
                        class="group"
                        onChange={this.checkboxChange}
                    >
                        {this.state.checkboxItems.map(function(item) {
                            return (
                                <view class="label-1">
                                    <label>
                                        <checkbox
                                            hidden
                                            value={item.name}
                                            checked={item.checked}
                                        />
                                        <view class="label-1__icon">
                                            <view
                                                class="label-1__icon-checked"
                                                style={{
                                                    opacity: item.checked
                                                        ? 1
                                                        : 0
                                                }}
                                            />
                                        </view>
                                        <text class="label-1__text">
                                            {item.value}
                                        </text>
                                    </label>
                                </view>
                            );
                        })}
                    </checkbox-group>
                </view>

                <view class="section section_gap">
                    <view class="section__title">label用for标识表单组件</view>
                    <radio-group class="group" onChange={this.radioChange}>
                        {this.state.radioItems.map(function(item) {
                            return (
                                <view class="label-2">
                                    <radio
                                        id={item.name}
                                        hidden
                                        value={item.name}
                                        checked={item.checked}
                                    />
                                    <view class="label-2__icon">
                                        <view
                                            class="label-2__icon-checked"
                                            style={{
                                                opacity: item.checked ? 1 : 0
                                            }}
                                        />
                                    </view>
                                    <label
                                        class="label-2__text"
                                        for={item.name}
                                    >
                                        <text>{item.name}</text>
                                    </label>
                                </view>
                            );
                        })}
                    </radio-group>
                </view>
            </div>
        );
    }
}

export default P;
