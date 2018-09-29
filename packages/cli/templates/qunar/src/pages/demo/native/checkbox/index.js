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

    config = {
        navigationBarTextStyle: '#fff',
        navigationBarBackgroundColor: '#0088a4',
        navigationBarTitleText: 'checkbox demo',
        backgroundColor: '#eeeeee',
        backgroundTextStyle: 'light'
    };

    checkboxChange(e) {
        // eslint-disable-next-line
        console.log('checkbox发生change事件，携带value值为：', e.target.value);
        React.api.showModal({
            title: '提示',
            content: JSON.stringify(e.target.value)
        });
    }

    render() {
        return (
            <div class="container">
                <checkbox-group onChange={this.checkboxChange}>
                    {this.state.items.map(function(item) {
                        return (
                            <label>
                                <checkbox
                                    value={item.name}
                                    checked={item.checked}
                                />
                                {item.value}
                            </label>
                        );
                    })}
                </checkbox-group>
            </div>
        );
    }
}

export default P;
