import React from "../../ReactWX";

class Dog extends React.Component {
    constructor(props){
       this.state = {
           name: props.name,
           age: props.age
       }
    }

    static defaultProps = {
        age: 77
    };
    changeAge(e){
        this.setState({
            age: ~~(Math.random() * 10)
        })
    }
    
    render() {
        return (
            <div catchTap={this.changeAge.bind(this)}>
                {this.state.name}-{this.state.age}
            </div>
        );
    }
}

export default Dog;
