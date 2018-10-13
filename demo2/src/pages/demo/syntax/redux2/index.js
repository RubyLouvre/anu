import React from '@react';


class P extends React.Component {
    render(){
        return <div>
            <p>查看store里面的数据</p>
            <p>{this.props.count}</p>
        </div>;
    }
}

// eslint-disable-next-line
export default P;