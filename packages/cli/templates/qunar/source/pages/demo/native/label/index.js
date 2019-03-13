import React from '@react';
import './index.scss';
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
        var checked = e.detail.value || e.target.value;
        var state = this.state;
        for (var i = 0; i < state.checkboxItems.length; i++) {
            if (checked.indexOf(state.checkboxItems[i].name) !== -1) {
                state.checkboxItems[i].checked = true;
            } else {
                state.checkboxItems[i].checked = false;
            }
        }
        // eslint-disable-next-line
        this.setState(state);
    }

    radioChange(e) {
        var checked = e.detail.value || e.target.value;
        var state = this.state;
        for (var i = 0; i < state.radioItems.length; i++) {
            if (checked.indexOf(state.radioItems[i].name) !== -1) {
                state.radioItems[i].checked = true;
            } else {
                state.radioItems[i].checked = false;
            }
        }
        // eslint-disable-next-line
        this.setState(state);
    }
    render() {
        return (
            <div class="column-layout">
                <view className="section section_gap column-layout">
                    <view className="section__title">表单组件在label内</view>
                    <checkbox-group
                        className="group column-layout"
                        onChange={this.checkboxChange}
                    >
                        {this.state.checkboxItems.map(function(item, index) {
                            return (
                                <view className="label-1" key={index}>
                                    <label>
                                        {/* <text className="label-1__text">
                                            {item.value}
                                        </text> */}
                                        <checkbox
                                            value={item.name}
                                            checked={item.checked}
                                            text={item.value}
                                            isRight={true}
                                        />
                                    </label>
                                </view>
                            );
                        })}
                    </checkbox-group>
                </view>

                <view className="section section_gap column-layout">
                    <view className="section__title">label用for标识表单组件</view>
                    <radio-group className="group column-layout" onChange={this.radioChange}>
                        {this.state.radioItems.map(function(item, index) {
                            return (
                                <view className="label-2" key={index}>
                                    {/* <div className="label-2__text">
                                        <label for={item.name}>
                                            <text>{item.name}</text>
                                        </label>
                                    </div> */}
                                    <radio
                                        id={item.name}
                                        value={item.name}
                                        checked={item.checked}
                                        text={item.value}
                                        isRight={true}
                                    />
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
