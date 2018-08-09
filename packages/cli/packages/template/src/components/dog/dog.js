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
    componentWillMount(){
        console.log("dog will mount")
    }
    componentDidMount(){
        console.log("dog did mount")
    }
    componentWillUpdate(){
        console.log("dog will update")
    }
    componentDidUpdate(){
        console.log("dog did update")
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
