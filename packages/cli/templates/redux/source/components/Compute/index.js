// eslint-disable-next-line
import React from '@react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../store/component';
class Compute extends React.Component {
    render() {
        return <div style={{display: 'flex', justifyContent: 'center'}}>
        {this.props.num} + 
        <input 
            style={{margin: '0 50rpx',border: 'solid black 1px'}} 
            onChange={(e) => {this.props.change(+e.target.value)}} 
            value={this.props.inputVal}
        />
         = {this.props.num + this.props.inputVal}</div>
    }
}

Compute = connect(mapStateToProps, mapDispatchToProps)(Compute);
export default Compute;
