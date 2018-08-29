import React from '@react';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            loop: true,
            condition: true,
            brands: ['BMW', 'Audi', 'Volkswagen', 'Lamborghini']
        };
    }

    toggleLoop() {
        this.setState({
            loop: !this.state.loop
        });
    }

    toggleCondition() {
        this.setState({
            condition: !this.state.condition
        });
    }

    render() {
        return (
            <div>
                <div>
                    列表：
                    {this.state.loop}
                </div>
                <button onTap={this.toggleLoop.bind(this)}>切换</button>
                <div>
                    条件：
                    {this.state.condition}
                </div>
                <button onTap={this.toggleCondition.bind(this)}>切换</button>
                <div>
                    {this.state.loop ? (
                        this.state.brands.map(function(brand, index) {
                            if (this.state.condition) {
                                return (
                                    <div>
                                        {index}. if: {brand}
                                    </div>
                                );
                            } else {
                                return <div>{index}. else</div>;
                            }
                        })
                    ) : (
                        <div>列表已关闭</div>
                    )}
                </div>
            </div>
        );
    }
}

export default P;
