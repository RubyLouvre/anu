import React from "../../ReactWX";
import Animal from '../Animal/index';

class Dog extends React.Component {
    componentWillMount() {
        console.log('componentWillMount')
    }
    render() {
        return <Animal name="Dog" />
    }
}

export default Dog;
