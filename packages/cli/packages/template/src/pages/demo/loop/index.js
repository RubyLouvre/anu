import React from "../../../ReactWX";
import Dog from "../../../components/Dog/index";
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            array: [
                {
                    name: "狗1"
                },
                {
                    name: "狗2"
                },
                {
                    name: "狗3"
                }
            ]
        };
    }
    changeNumbers() {
        console.log("change");
        this.setState({
            array: [
                {
                    name: "狗1"
                },
                {
                    name: "狗3"
                },
                {
                    name: "狗4"
                },
                {
                    name: "狗5"
                }
            ]
        });
    }
    render() {
        return (
            <div onTap={this.changeNumbers.bind(this)}>
                {this.state.array.map(function(el) {
                    return <Dog name={el.name} key={el.name} />;
                }, this)}
            </div>
        );
    }
}

export default P;
