import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React'
import PureComponent from 'src/PureComponent'

describe('context', function () {
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
      React.PropTypes =  (React.PropTypes || {})


    it('getChildContext', async () => {
      
        var arr = ['111', '222', '333']
        class App extends React.Component {

            getChildContext() {
                return {
                    name: "Jonas",
                    fruit: "Banana"
                };
            }
            handleClick() {
                this.getChildContext = function () {
                    return {
                        name: "Jonas",
                        fruit: arr.shift() 
                    };
                }
                this.forceUpdate()

            }
            render() {
                return <div ref='a' onClick={this.handleClick.bind(this)}><h4>{new Date - 0}</h4><B /></div>;
            }
        }
        App.childContextTypes = {
            name: React.PropTypes.string,
            fruit: React.PropTypes.string
        }

        class B extends React.Component {

            render() {
                return <div><C /><strong>{this.context.fruit}</strong></div>;
            }
        }
        B.contextTypes = {
            fruit: React.PropTypes.string
        }
        class C extends React.Component {
            render() {
                return <strong>{this.context.fruit}</strong>;
            }
        }

        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        var strongs = div.getElementsByTagName('strong')
        expect(strongs[0].innerHTML).toBe('Banana')
        expect(strongs[1].innerHTML).toBe('Banana')
        await browser.click(s.refs.a).pause(100)
            .$apply()
        strongs = div.getElementsByTagName('strong')
        expect(strongs[0].innerHTML).toBe('111')
        expect(strongs[1].innerHTML).toBe('111')
        await browser.click(s.refs.a).pause(100)
            .$apply()
        strongs = div.getElementsByTagName('strong')
        expect(strongs[0].innerHTML).toBe('222')
        expect(strongs[1].innerHTML).toBe('222')
    })



})