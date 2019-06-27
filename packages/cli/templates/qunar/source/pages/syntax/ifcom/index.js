import React from '@react';
import Label from '@syntaxComponents/Label/index';
import './index.scss';

/* eslint no-console: 0 */

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            condition1: true,
            condition2: true
        };
    }

    toggleCondition2() {
        console.log('Condition2');
        this.setState({
            condition2: !this.state.condition2
        });
    }

    toggleCondition1() {
        console.log('Condition1');
        this.setState({
            condition1: !this.state.condition1
        });
    }

    render() {
        return (
            <div class="anu-block">
                <div>改动React源码的onBeforeRender相关部分</div>
                <div>
                    {this.state.condition2 ? (
                        <Label onTap={this.toggleCondition2.bind(this)} class="btn">Inactive Condition2</Label>
                    ) : (
                        <Label onTap={this.toggleCondition2.bind(this)} class="btn">Active Condition2</Label>
                    )}
                </div>
            </div>
        );
    
    }
}

export default P;