// eslint-disable-next-line
import React from '@react';
/* eslint no-console: 0 */

class Label extends React.Component {
    constructor(props) {
        super(props);
        console.log('label', props);
        this.state = {
            value: props.children
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        this.setState({
            value: nextProps.children
        });
    }
    click(e) {
        var props = this.props;
        Array('onTap', 'catchTap', 'onClick', 'catchClick').forEach(function (
            name
        ) {
            var fn = props[name];
            if (fn) {
                fn(e);
                if (name == 'catchTap' || name == '"catchClick"') {
                    e.stopPropagation();
                }
            }
        });
    }
    render() {
        return ( 
            <div onClick={this.click.bind(this)}>
                <text>{this.state.value}</text>
            </div>
        );
    }
}
export default Label;