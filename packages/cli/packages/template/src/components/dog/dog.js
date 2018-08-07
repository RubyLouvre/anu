import React from "../../ReactWX";

class Dog extends React.Component {
    state = {
        name: "xxx"
    };
    static defaultProps = {
        age: 77
    };
    render() {
        return (
            <div>
                {this.props.name}-{this.props.age}
            </div>
        );
    }
}

export default Dog;
