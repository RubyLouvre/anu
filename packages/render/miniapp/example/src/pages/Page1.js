import {Page} from "../wechat";
import Comp from "../components/Comp1";
import "./page.css";

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
    // this.state.name = { a: {}}
    this.state.name.a.b = "s"; // fine
    this.state.name.ab = "me"; // bug1
    this.state.n = "n"; // bug2
  }
  
  onClick() {
    console.log("test click1" + e);
    var _this = this;
    setTimeout(function(){
      _this.setState({});
    })
   

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
      <div
        className="app"
        onClick={this.onClick}
        style={{ posistion: "relative" }}
      >
        威武
        {this.state.arr.map(function(item, index) {
          return item.map(function(item2, index2) {
            return <div>{item2.id}</div>;
          });
        })}
        <p>其他元素</p>
      </div>
    );
  }
}


/*

class P extends Page {
  constructor(props) {
    this.state = {
    };
    // this.state.name = { a: {}}
    this.state.name.a.b = "s"; // fine
    this.state.name.ab = "me"; // bug1
    this.state.n = "n"; // bug2
  }
}

function onInit(config){
  if(config.hasOwnProperty("constructor")){
    config.constructor.call(config)
  }
  config.data = obj.state;
  return config;
}

Page(onInit({}))

*/