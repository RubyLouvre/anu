
import React from '../../reactWX'

class Dog extends React.Component {
   state = {
     sex: "男"
   }
  
  render(){
    return <div>{this.props.name}-{this.props.children}</div>
  } 
}

export default Dog;
