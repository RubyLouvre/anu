import React, {Component} from '@react';
import Compute from '@components/Compute/index';

import { observer, inject } from 'mobx-react';
import './index.scss';

@inject(
    state => ({
        num: state.store.num,
        add: state.store.add,
        minus: state.store.minus
    })
)
@observer
class P extends Component {
    render() {
        return (<div class="page" >
                <text>{this.props.num}</text>
                <button onClick={()=> {this.props.add()}}>+</button>
                <button onClick={()=> {this.props.minus()}}>-</button>
                <div><Compute></Compute></div> 
        </div>
        );
    }
}

export default P;