
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
    return <div onTap={this.onTap} style={{font:111, xxx:333}} onClick={this.onClick.bind(this)} 
          className="xxx">3333{
           this.props.children
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