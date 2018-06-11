
import React from 'react';
import { connect } from 'react-redux';

const Count = props => (
    <div>
        <h1>The count is: {props.count}</h1>
        <button onClick={props.addByOne}>Add 1</button>
        <button onClick={props.addByOneAsync}>Add 1 Async</button>
    </div>
);
//将vm.count访问器定义使出来
const mapState = state => ({
    count: state.count,
});
//将vm中的count的setter拿出来，作为事件回调的内部方法（相当于ms-duplex的回调）
const mapDispatch = ({ count: { addBy, addByAsync }}) => ({
    addByOne: () => addBy(1),
    addByOneAsync: () => addByAsync(1)
});
/*
function mapDispatch(vm){
   var count = vm.count
   return {
        addByOne: function(){
           count.addBy(1)
        }
        addByOneAsync:  function(){
            count.addByAsync(1)
        } 
   }
}
*/
//创建一个HOC
export default connect(mapState, mapDispatch)(Count);