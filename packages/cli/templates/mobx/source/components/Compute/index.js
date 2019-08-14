// eslint-disable-next-line
import React from '@react';
import { inject, observer } from 'mobx-react';

@inject(state => ({
    num: state.store.num,
    inputVal: state.store.inputVal,
    result: state.store.result,
    change: state.store.change
}))
@observer
class Compute extends React.Component {
    render() {
        console.log('mobx:::', this.props.inputVal,this.props.num, this.props.result)
        return <div style={{display: 'flex', justifyContent: 'center'}}>
        {this.props.num} + 
        <input 
            style={{margin: '0 50rpx',border: 'solid black 1px'}} 
            onChange={(e) => {this.props.change(+e.target.value)}} 
            value={this.props.inputVal}
        />
         = {this.props.result}</div>
    }
}
export default Compute;
