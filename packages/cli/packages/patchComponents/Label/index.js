// eslint-disable-next-line
import React from '@react';
class Label extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}


export default Label;
