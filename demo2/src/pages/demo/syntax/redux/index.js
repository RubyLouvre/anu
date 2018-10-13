import React from '@react';
//import { connect } from 'react-redux';
//import store from '../../../../store/index';
/*
const mapState = state => ({
    count: state.count
});
  
const mapDispatch = ({ count: { increment, incrementAsync }}) => ({
    increment: () => increment(1),
    incrementAsync: () => incrementAsync(1)
});
*/
class P extends React.Component {
    constructor(props) {
        super(props);
        this.increment = props.increment || function(){};
        
        this.incrementAsync = props.incrementAsync;
    }
    render(){
        return <div>
            <p>请先安装@rematch/core redux react-redux</p>
            <p>{this.props.count}</p>
            <button onClick={this.increment} >+1</button>
        </div>;
    }
}

// eslint-disable-next-line
//P = connect(mapState, mapDispatch)(P);
export default P;