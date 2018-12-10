import React from '@react';
import './index.scss';


function randomHexColor() {
    let colorArray = [
        '#FFF68F',
        '#FFEFD5',
        '#FFE4E1',
        '#FFDEAD',
        '#FFC1C1',
        '#FFB90F',
        '#FFA54F',
        '#FF8C00',
        '#FF7F50',
        '#FF6EB4',
        '#FAF0E6',
        '#F7F7F7',
        '#F0FFFF',
        '#F08080',
        '#FF6A6A',
        '#FFFACD',
        '#FFE1FF',
        '#FFBBFF',
        '#EED8AE',
        '#EE9A00'

    ];
    let key = parseInt(Math.random() * 20, 10);
    return colorArray[key];
}

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            array1: [
                {
                    name: '动物1'
                },
                {
                    name: '动物2'
                },
                {
                    name: '动物3'
                }
            ],
            array2: [
                {
                    name: '猫1'
                },
                {
                    name: '狗2'
                },
                {
                    name: '兔3'
                }
            ],
            array3: [
                {
                    name: '小猫1'
                },
                {
                    name: '小狗2'
                },
                {
                    name: '小兔子3'
                }
            ]
        };
    }
    changeNumbers() {
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
            <div onTap={this.changeNumbers.bind(this)} class="anu-block">
                {this.state.array1.map(function(el) {
                    return (
                        <div key={el.name} class="anu-block">
                            <div class="index-item-1" style={{ backgroundColor: randomHexColor() }}>
                                {el.name}
                            </div>
                            {this.state.array2.map(function(item) {
                                return (
                                    <div key={item.name} class="anu-block">
                                        <div class="index-item-2" style={{ backgroundColor: randomHexColor() }}>
                                            {item.name}
                      =======
                                        </div>
                                        {this.state.array3.map(function(key) {
                                            return (
                                                <div
                                                    key={key.name}
                                                    class="index-item-3"
                                                    style={{ backgroundColor: randomHexColor() }}
                                                >
                                                    {key.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default P;
