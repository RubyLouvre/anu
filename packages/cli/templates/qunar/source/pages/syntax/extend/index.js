import React from "@react";
import "./index.scss";
import Dog from "@syntaxComponents/Dog/index";

class P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            age: 12
        };
    }
    changeAge(e) {
        this.setState({
            age: Number(e.target.value)
        });
    }
    render() {
        return (
            <div class="anu-block">
                <div>类继承的演示</div>
                <p>
                    <input
                        onChange={this.changeAge.bind(this)}
                        value={this.state.age}
                    />
                </p>
                <Dog name={"ruby"} age={this.state.age} />
            </div>
        );
    }
}

export default P;
