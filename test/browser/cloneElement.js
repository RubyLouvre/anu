import React from 'dist/React';
import sinon from 'sinon';

describe('cloneElement',()=>{
   
    it('new element', () => {
        var el = React.createElement('div',{a: 1},<p>im a oldEl</p>)
        var newEl = React.cloneElement(el, {b: 2})
        console.log(el);
        console.log(newEl);
        expect(newEl.type).toBe('div');
        expect(newEl.props.children).toA('array');
        expect(newEl.props.b).toBeDefined();

        var span = <span a="1" ref="sp">VaJoy</span>;
        var newSpan = React.cloneElement(span, {b:'2'}, <em>CNBlog</em>);
        expect(newSpan.__refKey).toBe('sp');
    })
    it('children', () => {
        var el = React.createElement('div',{a: 1},<p>im a oldEl</p>)
        var newEl = React.cloneElement(el, {b: 2})
        expect(newEl.props.children.length).toBe(1)

        el = React.createElement('div', {children: ["aaa","bbb"]})
        var newEl = React.cloneElement(el, {b: 2})
        expect(newEl.props.children.length).toBe(1)

        el = React.createElement('div', null, null)
        var newEl = React.cloneElement(el)
        expect(newEl.props.children.length).toBe(0)

        el = React.createElement('div',{key:'xxx'})
        var newEl = React.cloneElement(el)
        expect(newEl.key).toBe('xxx')

        el = React.createElement('div', null, [])
        var newEl = React.cloneElement(el)
        expect(el.props.children.length).toBe(0)
    })
   

})