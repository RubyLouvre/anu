"use strict";

let ChildUpdates;
let MorphingComponent;
let React;
let ReactDOM;

describe("ReactHook-test", () => {
    beforeEach(() => {
        jest.resetModules();
        React = require("react");
        ReactDOM = require("react-dom");
    });

    it("should support useState", () => {
        var fn 
        function Child() {
            var [todoName, setTodoName] = React.useState('todo')
           fn = setTodoName
           return <div>{todoName}</div>;
        }
        const el = document.createElement("div");
        ReactDOM.render(<Child />, el);
        expect(el.textContent).toBe("todo");
        fn('new')
        expect(el.textContent).toBe("new");
        fn(1111)
        expect(el.textContent).toBe("1111");
    });

    it("should support useCallback", () => {
        var onClick 
        function Child() {
          var [todoName, setTodoName] = React.useState('todo')
           onClick = React.useCallback((e)=>{
              setTodoName(e.target.value)
           }, [])
           return <input value={todoName} onClick={onClick } /> 
        }
        const el = document.createElement("div");
        ReactDOM.render(<Child />, el);
        var onClick1 = onClick;
     
        ReactDOM.render(<Child />, el);
        expect(onClick1).toBe(onClick)
    });
    it("should support useImperativeHandle", () => {
      
       var runing  = 1, refOuter
      const Lorry = React.forwardRef((props, ref) => {
        const startLorry = () => {
            runing = 'start'
        }

        const stopLorry = () => {
            runing = 'stop'
        }
        refOuter = ref
        React.useImperativeHandle(
          ref,
          () =>({
              startLorry,
              stopLorry
          })
        )

        return (
         <span>SPAN</span>
        )
      })

      function Main(){
          let lorryRef = React.useRef(null)
          React.useEffect(()=>{
              lorryRef.current.startLorry() //报错，因为lorryRef.current为null
          },[])
         return  <p>111<Lorry ref={lorryRef}></Lorry></p>
      }
      const el = document.createElement("div");
      ReactDOM.render(<Main />, el);
      expect(runing).toBe('start')
      expect(Object.keys(refOuter.current).length).toBe(2)
    })

});
