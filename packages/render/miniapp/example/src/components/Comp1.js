
import {Component} from '../wechat'
import {Stateless} from './Stateless'

class Comp extends Component {
  static defaultProps = {
    aaa: 1121,
    bbb: null,
    ccc: "xxx",
    a: true,
    f: [],
    ee: {}
  }
  constructor(props){
    super(props)
    this.state = {
      a1:1,
      a2: 11
    }
  }
  
  render(){
    return <div onTap={this.onTap} style={{font: aa(), xxx:333}}
          onClick={this.onClick.bind(this)} 
          className="xxx">{
          [11,222,333].map(function(el){
             return el
          })
          }
          <p><Stateless aaa="1" xxx={this.state.a1} /></p>
          <p><Stateless aaa="2" xxx={this.state.a2} /></p>
          </div>
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