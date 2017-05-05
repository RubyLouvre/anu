import {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';

import React from 'src/React'

describe('diffProps', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('使用对象解构', async() => {
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    title: 'xxx',
                    className: 'aaa'
                }
            }
            render() {
                return <div ref='a' {...this.state}>
                    xxx
                </div>
            }
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
        var s = React.render(<App/>, div)
        await browser
            .pause(100)
            .$apply()
        var dom = s.refs.a
        expect(dom.title).toBe('xxx')
        expect(dom.className).toBe('aaa')
        s.setState({title: '123', id: 'uuuu'})
        await browser
            .pause(100)
            .$apply()
        expect(dom.title).toBe('123')
        expect(dom.className).toBe('aaa')
        expect(dom.id).toBe('uuuu')
        document
            .body
            .removeChild(div)
    })
    it('改变属性', async() => {
        var index = 1
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    title: 'xxx',
                    className: 'aaa'
                }
            }
            onClick() {
                index = 0
                this.forceUpdate()
            }
            render() {
                return index
                    ? <div
                            ref='a'
                            title='xxx'
                            className='ddd'
                            id='h33'
                            onClick={this
                            .onClick
                            .bind(this)}
                            dangerouslySetInnerHTML={{
                            __html: '<b>xxx</b>'
                        }}></div>
                    : <div ref='a' title='yyy' id='h44' data-bbb='sss'>
                        xxx{new Date - 0}
                    </div>
            }
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
        var s = React.render(<App/>, div)
        await browser
            .pause(100)
            .$apply()
        var dom = s.refs.a
        expect(dom.title).toBe('xxx')
        expect(dom.className).toBe('ddd')
        expect(dom.id).toBe('h33')
        expect((dom.__events || {}).onClick).toA('function')
        expect(dom.getElementsByTagName('b').length).toBe(1)
        index = 0
        await browser
            .click('#h33')
            .pause(100)
            .$apply()

        dom = s.refs.a
        expect(dom.title).toBe('yyy')
        expect(dom.className).toBe('')
        expect(dom.id).toBe('h44')
        expect(dom.getAttribute('data-bbb')).toBe('sss')
        expect((dom.__events || {}).onClick).toA('undefined')
        expect(dom.getElementsByTagName('b').length).toBe(0)
        document
            .body
            .removeChild(div)
    })

    
})