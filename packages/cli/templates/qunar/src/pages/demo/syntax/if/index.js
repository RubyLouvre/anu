import React from '@react';

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
        if (this.state.condition1) {
            if (this.state.condition2) {
                return (
                    <div>
                        <div>Condition1 active</div>
                        <button onTap={this.toggleCondition1.bind(this)}>
                            Inactive Condition1
                        </button>
                        <div>Condition2 active</div>
                        <button onTap={this.toggleCondition2.bind(this)}>
                            Inactive Condition2
                        </button>
                    </div>
                );
            } else {
                return (
                    <div>
                        <div>Condition1 active</div>
                        <button onTap={this.toggleCondition1.bind(this)}>
                            Inactive Condition1
                        </button>
                        <div>Condition2 inactive</div>
                        <button onTap={this.toggleCondition2.bind(this)}>
                            Active Condition2
                        </button>
                    </div>
                );
            }
        } else {
            if (this.state.condition2) {
                return (
                    <div>
                        <div>Condition1 inactive</div>
                        <button onTap={this.toggleCondition1.bind(this)}>
                            Active Condition1
                        </button>
                        <div>Condition2 active</div>
                        <button onTap={this.toggleCondition2.bind(this)}>
                            Inactive Condition2
                        </button>
                    </div>
                );
            } else {
                return (
                    <div>
                        <div>Condition1 inactive</div>
                        <button onTap={this.toggleCondition1.bind(this)}>
                            Active Condition1
                        </button>
                        <div>Condition2 inactive</div>
                        <button onTap={this.toggleCondition2.bind(this)}>
                            Active Condition2
                        </button>
                    </div>
                );
            }
        }
    }
}

export default P;
