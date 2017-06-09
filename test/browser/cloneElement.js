import React from 'dist/React';
import sinon from 'sinon';

describe('cloneElement',()=>{
   
    it('type', () => {
        class Hello extends React.Component {
            render() {
                return <div>Hello world</div>; 
            }
        }
        var s = React.render(<Hello name="prop"/>, document.body);
        var newEl = React.cloneElement(s,{b:'2'});
        console.log(s);
        
        var a = React.createElement('div',{a: 1})
        var b = React.cloneElement(a, {b: 2})
        console.log(a);
        console.log(b);
        expect(b.props.b).toBeDefined()
    })
   

})