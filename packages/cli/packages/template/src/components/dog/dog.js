import React from "../../ReactWX";

class Dog extends React.Component {
    constructor(props, context) {
        this.state = {
            name: props.name,
            age: props.age
        };
    }
    componentWillReceiveProps(props) {
        this.setState(props);
    }
    static defaultProps = {
        age: 77
    };
    changeAge(e) {
        console.log("changeAge",e);
        this.setState({
            age: 111
        });
    }

    render() {
        return (
            <div catchTap={this.changeAge.bind(this)}>
                {this.props.name}-{this.props.age}
            </div>
        );
    }
}

export default Dog;
