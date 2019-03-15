import React from '@react';
class P extends React.Component {
    constructor() {
        super();
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
        // eslint-disable-next-line
        console.log('radio发生change事件，携带value值为：', e.value);
    }

    render() {
        return (
            <div>
                <radio-group class="radio-group" onChange={this.radioChange}>
                    {this.state.items.map(function(item) {
                        return (
                            <label class="radio">
                                <radio
                                    value={item.name}
                                    checked={item.checked}
                                    text={item.value}
                                    isRight={true}
                                />
                                {/* <text>{item.value}</text> */}
                            </label>
                        );
                    })}
                </radio-group>
            </div>
        );
    }
}

export default P;
