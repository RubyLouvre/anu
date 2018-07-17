
import React,{Component} from '../../reactWX'

class Dog extends Component {
   state = {
     sex: "男"
   }
  
  render(){
    return <div>{this.props.name}-{this.props.children}</div>
  } 
}

export default Dog;
