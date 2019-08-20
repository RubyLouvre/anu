import React, {Component} from '@react';
import Compute from '@components/Compute/index';

import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../store/page';
import './index.scss';

class P extends Component {
    render() {
        return (<div class="page" >
                <text>{this.props.value}</text>
                <button onClick={()=> {this.props.add()}}>+</button>
                <button onClick={()=> {this.props.minus()}}>-</button>
                <div><Compute></Compute></div> 
        </div>
        );
    }
}

P = connect(mapStateToProps, mapDispatchToProps)(P);

export default P;