import React from "@react"
import Aaa from '@components/Aaa/index'
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            a: 111
        };
    }
    changeAaa(){
        this.setState({
            a: ~~ (Math.random() * 100)
        })
    }
    render() {
        return (
            <div onTap={this.changeAaa.bind(this)}>
                <div>无狀态组件(点这里改变)</div>
                <div>
                    <Aaa aaa={this.state.a} />
                </div>
            </div>
        );
    }
}

export default P;
