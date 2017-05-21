var React=require("../../dist/React");
class Test extends React.Component{
      click(){
          console.log('=========')
      }
      render(){
          return <h1>{this.props.name}
          <p onClick={this.click.bind(this)}>事件</p>
          </h1>;
      }
  }
 module.exports =  Test