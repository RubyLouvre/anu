import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';

import React from 'dist/React'

describe('SVG元素', function () {
    this.timeout(200000);
    before(async () => {
        await beforeHook()
    })
    after(async () => {
        await afterHook(false)
    })
    var body = document.body, div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)
    })
    var rsvg = /^\[object SVG\w*Element\]$/
    it('circle', async () => {


        var s = ReactDOM.render(<svg><circle cx='25'
            cy='25'
            r='20'
            fill='green' /></svg>, div)
        await browser.pause(100).$apply()
        expect(rsvg.test(s.firstChild)).toBe(true)


    })
    it('ellipse', async () => {

        var s = ReactDOM.render(<svg><ellipse
            cx='25'
            cy='25'
            rx='20'
            ry='10'
            fill='green' /></svg>, div)
        await browser.pause(100).$apply()

        expect(rsvg.test(s.firstChild)).toBe(true)


    })

    it('line', async () => {

        var s = ReactDOM.render(<svg><line
            x1='5'
            y1='5'
            x2='45'
            y2='45'
            stroke='green' /></svg>, div)
        await browser.pause(300).$apply()

        expect(rsvg.test(s.firstChild)).toBe(true)

    })

    it('path', async () => {


        var s = ReactDOM.render(<svg><path
            d='M5,5 C5,45 45,45 45,5'
            fill="none"
            stroke='red' /></svg>, div)
        await browser.pause(100).$apply()

        expect(rsvg.test(s.firstChild)).toBe(true)

    })

    it('polygon', async () => {

        var s = ReactDOM.render(<svg><polygon
            points='5,5 45,45 5,45 45,5'
            fill="none"
            stroke='red' /></svg>, div)
        await browser.pause(100).$apply()
        expect(rsvg.test(s.firstChild)).toBe(true)

    })

    it('polyline', async () => {


        var s = ReactDOM.render(<svg><polyline
            points='5,5 45,45 5,45 45,5'
            fill="none"
            stroke='red' /></svg>, div)
        await browser.pause(100).$apply()
        expect(rsvg.test(s.firstChild)).toBe(true)

    })
    it('rect', async () => {


        var s = ReactDOM.render(<svg><rect
            x='5'
            y='5'
            rx='5'
            ry='5'
            width='40'
            height='40'
            fill="green" stroke='red' /></svg>, div)
        await browser.pause(100).$apply()
        expect(rsvg.test(s.firstChild)).toBe(true)


    })
    it('defs', async () => {

        var s = ReactDOM.render(
            <svg>
                <defs>
                    <rect id='rect' style='fill:green' width='15' height='15' />
                </defs>
                <use x='5' y='5' xlinkHref='#rect' />
                <use x='30' y='30' xlinkHref='#rect' />
            </svg>, div)


        await browser.pause(100).$apply()
        expect(rsvg.test(s.firstChild)).toBe(true)

    })
    it('attribute throw error', async () => {
    
        var a = {}
        a.toString = function () {
            throw "xxx"
        }
        var s = ReactDOM.render(React.createElement('div', {
            aaa: a
        }), div)
        await browser.pause(100).$apply()
        expect(s.getAttribute('aaa')).toBeNull()
    })

    it('use元素的xlinkHref', async () => {
        function Test() {
            return (
                <svg className="icon-twitter" width="16px" height="16px">
                    <use xlinkHref="#twitter" id='aaa' />
                </svg>
            )
        }

        ReactDOM.render( <Test />,div)
       
     
        await browser.pause(300).$apply()
        var el = div.getElementsByTagName('use') 
        expect(el.length).toBe(1)
        expect(el[0].getAttribute('xlink:href')).toBe('#twitter')
    })


})

