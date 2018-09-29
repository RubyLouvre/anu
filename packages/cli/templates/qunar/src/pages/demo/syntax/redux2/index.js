import React from '@react';
import { connect } from 'react-redux';
//import store from '../../../../store/index';

const mapState = state => ({
    count: state.count
});


class P extends React.Component {
    render(){
        return <div>
            <p>查看store里面的数据</p>
            <p>{this.props.count}</p>
        </div>;
    }
}

// eslint-disable-next-line
P = connect(mapState)(P);
export default P;