// eslint-disable-next-line
import React from '@react';
import { inject, observer } from 'mobx-react';

@inject(state => ({
        num: state.store.num,
        result: state.store.result
}))
@observer
class Compute extends React.Component {
    render() {
        console.log('mobx:::', this.props.num, this.props.result)
        return <div>{this.props.num} + 100 = {this.props.result}</div>
    }
}

export default Compute;
