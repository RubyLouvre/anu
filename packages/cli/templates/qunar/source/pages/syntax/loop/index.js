import React from '@react';
import Dog from '@syntaxComponents/Dog/index';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            array: [
                {
                    name: '狗1'
                },
                {
                    name: '狗2'
                },
                {
                    name: '狗3'
                },
                {
                    name: '狗4'
                }
            ]
        };
    }

    changeNumbers() {
        // eslint-disable-next-line
        var array = this.state.array.concat();
        array.push({
            name: '狗' + (new Date - 0)
        });
        this.setState({ array: array });
    }

    render() {
        return (
            <div class='anu-block'>
                <div onTap={this.changeNumbers.bind(this)}>
                    演示单重循环，点这里改变数组的个数
                </div>
                <div class='anu-block'>
                    {this.state.array.map(el => 
                        <Dog name={el.name} key={el.name} />
                    )}
                </div>
            </div>
        );
    }
}

export default P;
