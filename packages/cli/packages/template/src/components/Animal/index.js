import React from '../../ReactWX';

class Animal extends React.Component {
    constructor(props) {
        this.state = {
            name: props.name,
            age: props.age
        };
    }

    static defaultProps = {
        age: 1,
        name: 'animal'
    };

    changeAge() {
        this.setState({
            age: ~~(Math.random() * 10)
        });
    }

    componentDidMount() {
        console.log('componentDidMount')
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

export default Animal;
