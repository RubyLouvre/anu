import React from 'src/React'

import {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';
let {$serial} = browser;

describe('ReactDOM.render返回根组件的实例', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('事件与样式', async() => {
        class A extends React.Component {
            constructor() {
                super()
                this.state = {
                    aaa: 111
                }
            }
            click(e) {
                this.setState({
                    aaa: this.state.aaa + 1
                })
            }

            render() {
                return (
                    <div
                        id="aaa3"
                        style={{
                        height: this.state.aaa
                    }}
                        onClick={this
                        .click
                        .bind(this)}>
                        {this.state.aaa}
                    </div>
                )
            }
        }

        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
        var rootInstance = ReactDOM.render(
            <A/>, div);
        await browser
            .pause(200)
            .$apply()
        expect(rootInstance.state.aaa).toBe(111)
        await browser
            .click(rootInstance.vnode.dom)
            .pause(100)
            .$apply()

        expect(rootInstance.state.aaa).toBe(112)
        await browser
            .click(rootInstance.vnode.dom)
            .pause(100)
            .$apply()

        expect(rootInstance.state.aaa).toBe(113)
        document
            .body
            .removeChild(div)
    })

})