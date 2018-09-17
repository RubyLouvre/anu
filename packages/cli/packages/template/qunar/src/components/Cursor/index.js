import React from '@react';

class Cursor extends React.Component {
    render() {
        return (
            <div
                src="https://www.baidu.com/img/baidu_jgylogo3.gif"
                style={{
                    position: 'absolute',
                    color: "red",
                    left: this.props.mouse.x +"rpx",
                    top:  this.props.mouse.y  +"rpx"
                }}
            >cursor</div>
        );
    }
}
export default Cursor;
