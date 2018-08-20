import React from "../../../ReactWX"
import Aaa from "../../../components/Aaa/index"
class PPP extends React.Component {
    constructor(props) {
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
                <Aaa aaa={this.state.a} />
            </div>
        );
    }
}

Page(React.createPage(PPP, "pages/demo/stateless/aaa"));
export default PPP;
