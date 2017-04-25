import React from 'src/React'
import {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';
let {executer, $$addTest} = browser;

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
                //  resolve()
                executer.next()
            }
            componentDidUpdate() {
                // console.log('updated')

                executer.next()
                //   console.log(this.state.aaa) /    resolve()

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
        $$addTest(async function () {
            parent.xxxx = document.getElementById('aaa') || 'xxxx';
            browser.click('#aaa');
            await browser.$$action('wait')
            expect(rootInstance.state.aaa).toBe(112)

        }, async function () {
            browser.click('#aaa');
            await browser.$$action('wait')
            expect(rootInstance.state.aaa).toBe(112)
            resolve = this
        })

        rootInstance = ReactDOM.render(
            <A/>, document.body);
    })

})