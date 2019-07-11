import React from '@react';
import YButton from '@syntaxComponents/YButton/index';
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
            <div class='anu-block xxx'>
                {
                    this.state.condition1 ? (
                        this.state.condition2 ? (
                            <div class='anu-block'>
                                <div>Condition1 active</div>
                                <YButton onTap={this.toggleCondition1.bind(this)}>
                                    Inactive Condition1
                                </YButton>
                                <div>Condition2 active</div>
                                <YButton onTap={this.toggleCondition2.bind(this)}>
                                    Inactive Condition2
                                </YButton>
                            </div> 
                        ) : (
                            <div class='anu-block'>
                                <div>Condition1 active</div>
                                <YButton onTap={this.toggleCondition1.bind(this)}>
                                    Inactive Condition1
                                </YButton>
                                <div>Condition2 inactive</div>
                                <YButton onTap={this.toggleCondition2.bind(this)}>
                                    Active Condition2
                                </YButton>
                            </div>
                        )
                    ) : (
                        this.state.condition2 ? (
                            <div class='anu-block'>
                                <div>Condition1 inactive</div>
                                <YButton onTap={this.toggleCondition1.bind(this)}>
                                    Active Condition1
                                </YButton>
                                <div>Condition2 active</div>
                                <YButton onTap={this.toggleCondition2.bind(this)}>
                                    Inactive Condition2
                                </YButton>
                            </div>
                        ) : (
                            <div class='anu-block'>
                                <div>Condition1 inactive</div>
                                <YButton onTap={this.toggleCondition1.bind(this)}>
                                    Active Condition1
                                </YButton>
                                <div>Condition2 inactive</div>
                                <YButton onTap={this.toggleCondition2.bind(this)}>
                                    Active Condition2
                                </YButton>
                            </div>
                        )
                    )
                }
            </div>
        );
    }
}

export default P;
