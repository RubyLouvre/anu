import React from "@react";
class P extends React.Component {
    constructor() {
        this.state = {
            items: [
                { name: 'USA', value: '美国' },
                { name: 'CHN', value: '中国', checked: 'true' },
                { name: 'BRA', value: '巴西' },
                { name: 'JPN', value: '日本' },
                { name: 'ENG', value: '英国' },
                { name: 'TUR', value: '法国' }
            ]
        };
    }

    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.value);
    }

    render() {
        return (
            <div class="container">
                <radio-group class="radio-group" onChange={this.radioChange}>
                    {this.state.items.map(function(item) {
                        return (
                            <label class="radio">
                                <radio
                                    value={item.name}
                                    checked={item.checked}
                                />
                                {item.value}
                            </label>
                        );
                    })}
                </radio-group>
            </div>
        );
    }
}

export default P;
