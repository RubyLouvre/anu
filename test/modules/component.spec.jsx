import {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'src/React'
import PureComponent from 'src/PureComponent'

describe('无狀态组件', function () {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    after(async () => {
        await afterHook(false);
    })
    var body = document.body, div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)
    })
    it('stateless', async () => {
        function HelloComponent(props,
        /* context */) {
            return <div onClick={() => props.name = 11}>Hello {props.name}</div>
        }
   
        var s = React.render(<HelloComponent name="Sebastian" />, div)

        await browser
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('Hello Sebastian')

    })

    it('setState', async () => {
        var a = 1
        class A extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 1
                }
            }
            shouldComponentUpdate() {
              //  console.log('shouldComponentUpdate')
            }
            click() {
                this.setState(function (a) {
                    a.aaa++
                }, function () {
                    a++
                })

                this.setState(function (a) {
                    a.aaa++
                }, function () {
                    a++
                })
            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa}</div>
            }
        }

        var s = React.render(<A />, div)
        await browser
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('1')
        await browser
            .click(s.vnode.dom)
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('3')

        expect(a).toBe(3)

    });
    it('setState2', async () => {
        var a = 1
        class A extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 1
                }
            }
            shouldComponentUpdate() {
                return false
            }
            click() {
                this.setState(function (a) {
                    a.aaa++
                }, function () {
                    a++
                })

                this.setState(function (a) {
                    a.aaa++
                }, function () {
                    a++
                })
            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa}</div>
            }
        }
   
        var s = React.render(<A />, div)
        await browser
            .pause(200)
            .$apply()

        expect(s.vnode.dom.innerHTML).toBe('1')
        await browser
            .click(s.vnode.dom)
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('1')
        expect(a).toBe(3)

    });
    it('PureComponent', async () => {
        var a = 1
        class A extends React.PureComponent {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: {
                        a: 7
                    }
                }
            }

            click() {

                this.setState(function (state) {
                    state.aaa.a = 8
                })

            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa.a}</div>
            }
        }
  
        var s = React.render(<A />, div)
        await browser
            .pause(200)
            .$apply()

        expect(s.vnode.dom.innerHTML).toBe('7')
        await browser
            .click(s.vnode.dom)
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('7')


    });
    it('PureComponent2', async () => {
        class A extends React.PureComponent {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: {
                        a: 7
                    }
                }
            }

            click() {
                var aaa = this.state.aaa
                aaa.a = 9
                this.setState({
                    aaa: aaa,
                    ccc: 222
                })
            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa.a}</div>
            }
        }
  
        var s = React.render(<A />, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('7')

        await browser
            .click(s.vnode.dom)
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('9')


    });
    it('子组件是无状态组件', async () => {
        function Select(props) {
            return <strong>{props.value}</strong>
        }
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    value: '南京'
                }
            }

            onChange(e) {
                this.setState({
                    value: e.target.value
                })

            }
            render() {
                return <div><Select value={this.state.value} />
                    <input ref='a' value={this.state.value} onInput={this.onChange.bind(this)} /></div>
            }

        }
    
        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.a.value).toBe('南京')
        await browser
            .setValue(s.refs.a, '南京22')
            .pause(200)
            .$apply()
        expect(s.refs.a.value).toBe('南京22')
        expect(div.getElementsByTagName('strong')[0].innerHTML).toBe('南京22')


    });
    it('多选下拉框', async () => {
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    value: ['aaa', 'ccc']
                }
            }

            onChange(e) {
                var values = []
                var elems = e.target.getElementsByTagName('option')
                for (var i = 0, el; el = elems[i++];) {
                    if (el.selected) {
                        if (el.getAttribute('value') != null) {
                            values.push(el.getAttribute('value'))
                        } else {
                            values.push(el.text)
                        }
                    }
                }
                this.setState({
                    values: values
                })
            }
            render() {
                return <select value={this.state.value} multiple='true' onChange={this.onChange.bind(this)}>
                    <optgroup>
                        <option ref='a'>aaa</option>
                        <option ref='b'>bbb</option>
                    </optgroup>
                    <optgroup>
                        <option ref='c'>ccc</option>
                        <option ref='d'>ddd</option>
                    </optgroup>
                </select>
            }

        }

        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.a.selected).toBe(true)
        expect(s.refs.b.selected).toBe(false)
        expect(s.refs.c.selected).toBe(true)
        expect(s.refs.d.selected).toBe(false)
        s.setState({
            value: ['bbb', 'ddd']
        })
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.a.selected).toBe(false)
        expect(s.refs.b.selected).toBe(true)
        expect(s.refs.c.selected).toBe(false)
        expect(s.refs.d.selected).toBe(true)
  
    })

    it('多选下拉框defaultValue', async () => {

        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    value: 'ccc'
                }
            }
           
            render() {
                return <select defaultValue={this.state.value} >
                    <option ref='a'>aaa</option>
                    <option ref='b'>bbb</option>
                    <option ref='c'>ccc</option>
                    <option ref='d'>ddd</option>
                </select>
            }
        }
 
        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.c.selected).toBe(true)

    })

     it('多选下拉框没有defaultValue', async () => {

        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {  }
            }
           
            render() {
                return <select >
                    <option ref='a'>aaa</option>
                    <option ref='b'>bbb</option>
                    <option ref='c'>ccc</option>
                    <option ref='d'>ddd</option>
                </select>
            }
        }
  
        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.a.selected).toBe(true)

    })
})