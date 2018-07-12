import { Page } from "../wechat";
import "./page.css";
import Dog from "../components/dog/dog";

const e = "e";

class P extends Page {
  constructor(props) {
    super(props);
    this.state = {
      items: ["hello"],
      name: {
        a: {}
      }
    };
  }

  onClick() {
    console.log("test click1" + e);
    var _this = this;
    setTimeout(function() {
      _this.setState({});
    });

    this.setState({
      arr: [
        [{ id: 3 }, { id: 4 }],
        [{ id: 3 }, { id: 4 }],
        [{ id: 3 }, { id: 4 }]
      ]
    });
  }
  render() {
    return (
      <view>
        <view>
          {this.state.array.map(function(el) {
            return <Dog key={xxx} />;
          })}
        </view>
        <Dog sex={this.props.dogsex} />
      </view>
    );
  }
}
export default P;
