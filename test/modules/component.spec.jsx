import eventHook, {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';
let {$serial} = browser;
import React from 'src/React'
import PureComponent from 'src/PureComponent'

describe('无狀态组件', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('stateless', async() => {
        function HelloComponent(props,
        /* context */) {
            return <div onClick={() => props.name = 11}>Hello {props.name}</div>
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
        var s = React.render(<HelloComponent name="Sebastian"/>, div)

        await browser
            .pause(200)
            .$apply()
        console.log(s.type, '!!!')
        expect(s.vnode.dom.innerHTML).toBe('Hello Sebastian')

        document
            .body
            .removeChild(div)
    })

    it('setState', async() => {
        var a = 1
        class A extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 1
                }
            }
            shouldComponentUpdate() {
                console.log('shouldComponentUpdate')
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
                return  <div onClick={this.click.bind(this) }>{this.state.aaa}</div>
            }
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
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
        document
            .body
            .removeChild(div)
    });
 it('setState2', async() => {
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
                return  <div onClick={this.click.bind(this) }>{this.state.aaa}</div>
            }
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
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
        document
            .body
            .removeChild(div)
    });
it('PureComponent', async() => {
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
               
                 this.setState(function(state){
                   state.aaa.a = 8
                })
               
            }
            render() {
                return  <div onClick={this.click.bind(this) }>{this.state.aaa.a}</div>
            }
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
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
       
        document
            .body
            .removeChild(div)
    });
it('PureComponent2', async() => {
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
                return  <div onClick={this.click.bind(this) }>{this.state.aaa.a}</div>
            }
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
        var s = React.render(<A />, div)
        await browser
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('7')
        await browser
            .click(s.vnode.dom)
            .pause(200)
            .$apply()
        expect(s.vnode.dom.innerHTML).toBe('9')
       
        document
            .body
            .removeChild(div)
    });
})