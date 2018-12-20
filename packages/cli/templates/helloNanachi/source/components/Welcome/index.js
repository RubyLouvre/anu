import React from '@react';
import './index.scss';
class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text
        };
    }
    render() {
        return (
            <h2 class='welcome-text'>Hello, {this.state.text}.</h2>
        );
    }
}

export default Welcome;
