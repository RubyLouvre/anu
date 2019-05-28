// eslint-disable-next-line
import React from "@react";
export default function Counter(props) {
    const [count, setCount] = React.useState(props.count);
    props.count = count; //数据必须加到props或state上
   
    return (
      <div>
        Count: {props.count}
        <button onClick={ ()=>{
          setCount(props.initCount)
        }}>Reset</button>
        <button onClick={()=>{
            setCount(prevCount => prevCount + 1)
        }}>+</button>
        <button onClick={()=>{
            setCount(prevCount => prevCount - 1)
        }}>-</button>
      </div>
    );
  }
  