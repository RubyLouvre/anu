import React from '@react';
class P extends React.Component {
    constructor() {
        super();
        this.bind();
    }

    bind() {
        for (let i = 1; i < 5; i++) {
            let index = i + 1;
            this['slider' + index + 'change'] = function(e) {
                // eslint-disable-next-line
                console.log(
                    'slider' + 'index' + '发生 change 事件，携带值为',
                    e.value
                );
            };
        }
    }

    switch1Change(e) {
        // eslint-disable-next-line
        console.log('switch1 发生 change 事件，携带值为', e.value);
    }

    switch2Change(e) {
        // eslint-disable-next-line
        console.log('switch2 发生 change 事件，携带值为', e.value);
    }

    render() {
        return (
            <div class="container">
                <div class="section section_gap">
                    <text class="section__title">设置step</text>
                    <div class="body-div">
                        <slider onChange={this.slider2change} step="5" />
                    </div>
                </div>
                <div class="section section_gap">
                    <text class="section__title">显示当前value</text>
                    <div class="body-div">
                        <slider onChange={this.slider3change} show-value />
                    </div>
                </div>

                <div class="section section_gap">
                    <text class="section__title">设置最小/最大值</text>
                    <div class="body-div">
                        <slider
                            onChange={this.slider4change}
                            min="50"
                            max="200"
                            show-value
                        />
                    </div>
                </div>
                <div class="section section_gap">
                    <switch checked onChange={this.switch1Change} />
                    <switch onChange={this.switch2Change} />
                </div>
            </div>
        );
    }
}

export default P;
