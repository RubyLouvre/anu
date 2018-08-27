import React from '@react';
import Dog from '@components/Dog/index';

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
                }
            ]
        };
    }

    changeNumbers() {
        // eslint-disable-next-line
        console.log('change');
        this.setState({
            array: [
                {
                    name: '狗1'
                },
                {
                    name: '狗3'
                },
                {
                    name: '狗4'
                },
                {
                    name: '狗5'
                }
            ]
        });
    }

    render() {
        return (
            <div>
                <div onTap={this.changeNumbers.bind(this)}>
                    演示单重循环，点这里改变数组的个数
                </div>
                <div>
                    {this.state.array.map(function(el) {
                        return <Dog name={el.name} key={el.name} />;
                    })}
                </div>
            </div>
        );
    }
}

export default P;
