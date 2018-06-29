
import {Component} from '../wechat'

class Comp extends Component {
  static defaultProps = {
    aaa: 1121,
    bbb: null,
    ccc: "xxx",
    a: true,
    f: [],
    ee: {}
  }
  
  render(){
    return <div onTap={this.onTap} style={{font: aa(), xxx:333}}
          onClick={this.onClick.bind(this)} 
          className="xxx">{
          [11,222,333].map(function(el){
             return el
          })
          }</div>
  }
}
/*
Comp.defaultProps = {
  aaa: 1121,
  bbb: null,
  ccc: "xxx",
  a: true,
  f: [],
  ee: {}
}
*/