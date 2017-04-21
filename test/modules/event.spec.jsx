import React from 'src/React'
import eventHook, {beforeHook, afterHook, runCommand} from 'karma-event-driver-ext/cjs/event-driver-hooks.js';

describe('ReactDOM.render返回根组件的实例', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('ReactDOM.render返回根组件的实例', async() => {
        class A extends React.Component {
            constructor() {
                super()
                this.state = {
                    aaa: 111
                }
            }
            click(e) {
                console.log('这个已经触发')
                this.setState({
                    aaa: this.state.aaa + 1
                })
                console.log('点击完')
            }
            componentDidMount() {
                resolve()
            }
            componentDidUpdate() {
                console.log('updated')
                console.log(this.state.aaa)
                resolve()

            }
            render() {
                return (
                    <div
                        id="aaa"
                        onClick={this
                        .click
                        .bind(this)}>
                        {this.state.aaa}
                    </div>
                )
            }
        }
        var resolve
        var p = new Promise(function (r) {
            resolve = r
        })
        var rootInstance = ReactDOM.render(
            <A/>, document.body)
        //等待组件mount
        await p
        p = new Promise(function (r) {
            resolve = r
        })
        //确保Promise是在await之前
        await runCommand((browser) => {
            browser.click('#aaa'); 
        });
        //等待组件update
        await p
        expect(rootInstance.state.aaa).toBe(112)
        p = new Promise(function (r) {
            resolve = r
        })
        await runCommand((browser) => {
            browser.click('#aaa'); 
        });
        //等待组件update
        await p
        expect(rootInstance.state.aaa).toBe(113)

    })

})