import React from '@react';
import './index.scss';
class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text
        };
    }
    onClick(e) {
        console.log(e.target, 'onClick');
    }
    render() {
        return (
            <h2 class='welcome-text' onClick={this.onClick}>Hello, {this.state.text}.</h2>
        );
    }
}

export default Welcome;