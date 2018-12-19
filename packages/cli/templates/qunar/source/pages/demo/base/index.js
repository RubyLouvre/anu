import React from '@react';
/*eslint-disable*/
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            iconSize: [20, 30, 40, 50, 60, 70],
            iconColor: [
                'red',
                'orange',
                'yellow',
                'green',
                'rgb(0,255,255)',
                'blue',
                'purple'
            ],
            iconType: [
                'success',
                'success_no_circle',
                'info',
                'warn',
                'waiting',
                'cancel',
                'download',
                'search',
                'clear'
            ],
            text: 'this is first line\nthis is second line'
        };
    }

    add() {
        this.setState({
            text: this.state.text + '\nthis is new line'
        });
    }

    remove() {
        var textAry = this.state.text.split('\n');
        if (!textAry.length) return;
        textAry.pop();

        this.setState({
            text: textAry.join('\n')
        });
    }
    componentWillMount(){
        // eslint-disable-next-line
        console.log('base componentWillMount');
    }
    componentDidMount(){
        // eslint-disable-next-line
        console.log('base componentDidMount');
    }
    render() {
        return (
            <div>
                <div class="item-list">
                    <h2 class="item-list-hd">Icon</h2>
                    <div class="group">
                        {this.state.iconSize.map(function(item) {
                            return <icon type="success" size={item} />;
                        })}
                    </div>

                    <div class="group">
                        {this.state.iconType.map(function(item) {
                            return <icon type={item} size="40" />;
                        })}
                    </div>

                    <div class="group">
                        {this.state.iconColor.map(function(item) {
                            return (
                                <icon type="success" size="40" color={item} style={{margin:'1rpx', border:'1px solid ' +item }}  />
                            );
                        })}
                    </div>
                </div>

                <div class="item">
                    <h2 class="item-list-hd">text</h2>
                    <div class="btn-area">
                        <div class="body-div">
                            <text>{this.state.text}</text>
                            <button onTap={this.add}>add line</button>
                            <button onTap={this.remove}>remove line</button>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <h2 class="item-list-hd">progress</h2>
                    <div class="btn-area">
                        <progress percent="20" show-info />
                        <progress percent="40" show-info stroke-width="12" />
                        <progress percent="60" show-info color="pink" />
                        <progress percent="80" show-info active />
                    </div>
                </div>
            </div>
        );
    }
}

export default P;
