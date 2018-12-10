import React from '@react';
import XButton from '@components/XButton/index';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            condition1: true,
            condition2: true
        };
    }

    toggleCondition2() {
        this.setState({
            condition2: !this.state.condition2
        });
    }

    toggleCondition1() {
        this.setState({
            condition1: !this.state.condition1
        });
    }

    render() {
        return (
            <div>
                {
                    this.state.condition1 ? (
                        this.state.condition2 ? (
                            <div class='anu-block'>
                                <div>Condition1 active</div>
                                <XButton onTap={this.toggleCondition1.bind(this)}>
                                    Inactive Condition1
                                </XButton>
                                <div>Condition2 active</div>
                                <XButton onTap={this.toggleCondition2.bind(this)}>
                                    Inactive Condition2
                                </XButton>
                            </div> 
                        ) : (
                            <div class='anu-block'>
                                <div>Condition1 active</div>
                                <XButton onTap={this.toggleCondition1.bind(this)}>
                                    Inactive Condition1
                                </XButton>
                                <div>Condition2 inactive</div>
                                <XButton onTap={this.toggleCondition2.bind(this)}>
                                    Active Condition2
                                </XButton>
                            </div>
                        )
                    ) : (
                        this.state.condition2 ? (
                            <div class='anu-block'>
                                <div>Condition1 inactive</div>
                                <XButton onTap={this.toggleCondition1.bind(this)}>
                                    Active Condition1
                                </XButton>
                                <div>Condition2 active</div>
                                <XButton onTap={this.toggleCondition2.bind(this)}>
                                    Inactive Condition2
                                </XButton>
                            </div>
                        ) : (
                            <div class='anu-block'>
                                <div>Condition1 inactive</div>
                                <XButton onTap={this.toggleCondition1.bind(this)}>
                                    Active Condition1
                                </XButton>
                                <div>Condition2 inactive</div>
                                <XButton onTap={this.toggleCondition2.bind(this)}>
                                    Active Condition2
                                </XButton>
                            </div>
                        )
                    )
                }
            </div>
        );
    }
}

export default P;
