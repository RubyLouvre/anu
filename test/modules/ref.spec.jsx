import {
    beforeHook,
    afterHook,
    browser
} from 'karma-event-driver-ext/cjs/event-driver-hooks';

import React from 'src/React'

describe('ref', function () {
    this.timeout(200000);
    before(async () => {
        await beforeHook()
    })
    after(async () => {
        await afterHook(false)
    })
    var body = document.body,
        div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)
    })
    it('patchRef', async () => {
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.handleClick = this
                    .handleClick
                    .bind(this)

            }
            handleClick() {
                // Explicitly focus the text input using the raw DOM API.
                if (this.myTextInput !== null) {
                    this
                        .myTextInput
                        .focus();
                }
            }
            render() {
                return (<div>
                    <input type="text"
                        ref={
                            (ref) => this.myTextInput = ref
                        }
                    /> <input ref='a'
                        type="button"
                        value="Focus the text input"
                        onClick={
                            this.handleClick
                        }
                    /> </div>
                );
            }
        };

        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        var dom = s.refs.a

        await browser
            .click(dom)
            .pause(100)
            .$apply()

        expect(document.activeElement).toBe(s.myTextInput)
        expect(s.myTextInput).toBeDefined()

    })

    it('patchRef Component', async () => {
        
        class App extends React.Component {
            render() {
                return <div title='1'><A ref='a' /></div>
            }
        }
        var index = 1
        class A extends React.Component {
            componentWillReceiveProps() {
                index = 0
                this.forceUpdate()
            }
            render() {
                return index ? <strong>111</strong> : <em>111</em>
            }
        }
        
        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect( s.refs.a ).toInstanceOf(A)

     
    })
})