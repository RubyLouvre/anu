import React from "../../ReactWX";
import Animal from '../Animal/index';

class Dog extends Animal {
    componentWillMount() {
        console.log('Dog componentWillMount')
    }
    render() {
        return (
            <div style={{border: '1px solid #333'}}>
                名字：{this.state.name} 年龄：{this.state.age} 岁
                <button catchTap={this.changeAge.bind(this)}>换一个年龄</button>
            </div>
        );
    }
}

export default Dog;
