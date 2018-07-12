
import {Component} from '../../wechat'

class Dog extends Component {
   state = {
     sex: "男"
   }
  
  render(){
    return <div>{this.state.sex}</div>
  } 
}

export default Dog;
