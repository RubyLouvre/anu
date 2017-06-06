import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React'

describe('node模块', function () {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    after(async () => {
        await afterHook(false);
    });

    var body = document.body, div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)

    })
    
    it('非受控组件select的value不可变', async () => {

        class Com extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: 'bbb'
                }
            }
            render() {
                return <select id='node8' value={this.state.value}>
                    <option value='aaa'>aaa</option>
                    <option value='bbb'>bbb</option>
                    <option value='ccc'>ccc</option>
                </select>
            }
        }

        var s = React.render(<Com />, div)
        await browser
            .pause(100)
            .$apply()

        expect(s._currentElement._hostNode.children[1].selected).toBe(true)
        await browser
            .selectByVisibleText('#node8', 'ccc')
            .pause(200)
            .$apply()

        expect(s._currentElement._hostNode.children[2].selected).toBe(false)
        expect(s._currentElement._hostNode.children[1].selected).toBe(true)



    })
    
})