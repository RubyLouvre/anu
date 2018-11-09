/* eslint-disable*/
import React from '@react';
class Radio extends React.Component {
    constructor(props) {
        super(props);
        console.log('props',props);
    
    }
    render() {
        return (
            <input type="radio" checked={this.props.checked} disabled={this.props.disabled} value={this.props.value}>
            </input>
        );
    }
}

Radio.defaultProps = {
    disabled: false,
    checked: false,
    value: ''
};


export default Radio;
