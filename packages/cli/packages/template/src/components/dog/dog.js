import React from "../../ReactWX";

class Dog extends React.Component {
    constructor(props){
        //this.props = props;
        console.log(this.props.eventTapHandler, '----');
      
    }
    state = {
        name: "xxx"
    };
    static defaultProps = {
        age: 77
    };
    render() {
        return (
            <div onTap = {this.props.eventTapHandler}>
                {this.props.name}-{this.props.age}
            </div>
        );
    }
}

export default Dog;
