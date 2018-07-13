import { Page } from "../wechat";
import "./page.css";
import Dog from "../components/dog/dog";
const e = "e";
class P extends Page {
  constructor(props) {
    super(props);
    this.state = {
      name: 'hehe',
      array: [
        {name: "dog1",text: "text1"},
        {name: "dog2",text: "text2"},
        {name: "dog3",text: "text3"},
      ]
    };
  }
  onClick() {
    console.log("test click1" + e);
  }
  render() {
    return (
      <div>
        <div>
          {this.state.array.map(function(el) {
            return <Dog key={el.name} name={el.name}>{el.text}</Dog>;
          })}
        </div>
        <Dog name={this.state.name} />
      </div>
    );
  }
}
export default P;
