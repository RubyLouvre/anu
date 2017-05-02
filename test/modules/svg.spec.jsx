import eventHook, {
    beforeHook,
    afterHook,
    browser
} from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'src/React'

describe('SVG元素', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('circle', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( <svg><circle cx = '25'
            cy='25'
            r='20'
            fill='green' /></svg>, div)
           await browser.pause(300).$apply() 
            expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
     it('ellipse', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( <svg><ellipse 
            cx='25'
            cy='25'
            rx='20'
            ry='10'
            fill='green' /></svg>, div)
           await browser.pause(300).$apply() 
            expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
     it('line', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( <svg><line 
            x1='5'
            y1='5'
            x2='45'
            y2='45'
            stroke='green' /></svg>, div)
           await browser.pause(300).$apply() 
            expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
     it('path', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( <svg><path 
            d='M5,5 C5,45 45,45 45,5'
            fill="none"
            stroke='red' /></svg>, div)
           await browser.pause(300).$apply() 
            expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
      it('polygon', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( <svg><polygon 
            points='5,5 45,45 5,45 45,5'
            fill="none"
            stroke='red' /></svg>, div)
           await browser.pause(300).$apply() 
            expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
     it('polyline', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( <svg><polyline 
            points='5,5 45,45 5,45 45,5'
            fill="none"
            stroke='red' /></svg>, div)
           await browser.pause(300).$apply() 
            expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
      it('rect', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( <svg><rect
            x='5'
            y='5'
            rx='5'
            ry='5'
            width='40'
            height='40'
            fill="green" stroke='red' /></svg>, div)
           await browser.pause(300).$apply() 
            expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
      it('defs', async() => {
        var div = document.createElement('div');
        document
            .body
            .appendChild(div);

        var svg = ReactDOM.render( React.createElement('svg', null, React.createElement('defs', null, 
          React.createElement('rect',{
              id:'rect',
              style:  'fill:green',
              width: 15,
              height:15
          })), React.createElement('use', {
              x:5,y:5, 'xlink:href':'#rect'
          }, React.createElement('use', {
              x:30,y:30, 'xlink:href':'#rect'
          }))), div)
           await browser.pause(300).$apply() 
           expect(/^\[object SVG\w*Element\]$/.test(svg.firstChild)).toBe(true)

            document
            .body
            .removeChild(div)
     })
      it('attribute throw error', async() => {
         var div = document.createElement('div');
        document
            .body
            .appendChild(div);
        var a = {}
            a.toString = function(){
                throw "xxx"
            }
       var s =  ReactDOM.render(React.createElement('div',{
            aaa: a
        }), div)
       await browser.pause(300).$apply() 
       expect(s.getAttribute('aaa')).toBeNull()
    })
})

