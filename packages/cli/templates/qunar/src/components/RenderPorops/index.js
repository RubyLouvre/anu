import React from  '@react';
class RenderProps extends React.Component{
   
    goPage(){
       
    }
    render(){
        return <div>{this.props.children}</div>;
    }

}


export default RenderProps;