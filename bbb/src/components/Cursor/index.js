import React from '@react';

class Cursor extends React.Component {
    render() {
        return (
            <div
                src="https://www.baidu.com/img/baidu_jgylogo3.gif"
                style={{
                    position: 'absolute',
                    left: this.props.mouse.x,
                    top: this.props.mouse.y
                }}
            >cursor</div>
        );
    }
}
export default Cursor;
