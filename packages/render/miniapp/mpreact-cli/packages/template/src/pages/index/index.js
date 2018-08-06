import React  from "../../ReactWX";
import Dog from '../../components/dog/dog';
import './index.scss';
const e = 'e';
class P extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      welcome: "Welcome to mpreact",
    };
  }
  onClick() {
    console.log("test click1" + e);
  }
  onKeyDown() {
    console.log("test keydown");
  }
  render() {
    return (
      <div onTap = {this.onClick} onKeyDown={this.onKeyDown}>
        <div class='welcome'>
           <div class='welcome-text'>{this.state.welcome}</div>
        </div>
       
      </div>
    );
  }
}
Page(React.createPage(P, "pages/index/index"))
export default P;
