// eslint-disable-next-line
import React from '@react';
import './index.scss';
import Animal from '@components/Animal/index';

class Dog extends Animal {
    componentWillMount() {
        // eslint-disable-next-line
        console.log('Dog componentWillMount');
    }
    render() {
        return (
            <div style={{border: '1px solid #333'}} class='anu-block'>
                <text>名字：{this.state.name} 年龄：{this.state.age} 岁</text>
                <button catchTap={this.changeAge.bind(this)}>换一个年龄</button>
            </div>
        );
    }
}

export default Dog;
