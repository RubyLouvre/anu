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
              
                this.setState({
                    aaa: this.state.aaa + 1
                })
              
            }
            componentDidMount() {
                resolve()
            }
            componentDidUpdate() {
               // console.log('updated')
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
        var rootInstance,
            resolve
        async function nextAction(fn) {
            if (fn && !fn.prototype) {
                throw '不能为匿名函数'
            }
            var rr
            var p = new Promise(function (r) {
                rr = r
            })
            await runCommand(fn.bind(rr))
            return p
        }

        await nextAction(function () {
            rootInstance = ReactDOM.render(
                <A/>, document.body)
            this()
        })
        //等待组件mount 确保Promise是在await之前
        await nextAction(function (browser) {
            browser.click('#aaa');
            resolve = this
        });

        expect(rootInstance.state.aaa).toBe(112)

        await nextAction(function (browser) {
            browser.click('#aaa');
            resolve = this
        })

        expect(rootInstance.state.aaa).toBe(113)

    })

})