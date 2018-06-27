
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
    return <div>组件</div>
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