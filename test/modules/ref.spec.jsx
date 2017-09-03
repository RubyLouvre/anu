import {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';

import React from 'dist/React'

describe('ref', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook()
    })
    after(async() => {
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
    it('patchRef', async() => {
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
                return (
                    <div>
                        <input type="text" ref={(ref) => this.myTextInput = ref}/>
                        <input
                            ref='a'
                            type="button"
                            value="Focus the text input"
                            onClick={this.handleClick}/>
                    </div>
                );
            }
        };

        var s = React.render(<App/>, div)
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

    it('patchRef Component', async() => {

        class App extends React.Component {
            render() {
                return <div title='1'><A ref='a'/></div>
            }
        }
        var index = 1
        class A extends React.Component {
            componentWillReceiveProps() {
                index = 0
                this.forceUpdate()
            }
            render() {
                return index
                    ? <strong>111</strong>
                    : <em>111</em>
            }
        }

        var s = React.render(<App/>, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.a).toInstanceOf(A)

    })

    it('没有组件的情况', async() => {

        function ref(a) {
            expect(a.tagName).toBe('DIV')
        }

        var s = React.render(<div ref={ref}></div>, div)
        await browser
            .pause(100)
            .$apply()

    })
    it('should invoke refs in Component.render()', async() => {
        var i = 0
        let outer = function (a) {
            expect(a).toBe(div.firstChild);
            i++
        }
        let inner = function (a) {
            expect(a).toBe(div.firstChild.firstChild);
            i++
        }
        class Foo extends React.Component {
            render() {
                return (
                    <div ref={outer}>
                        <span ref={inner}/>
                    </div>
                );
            }
        }
        var s = React.render(<Foo/>, div);
        await browser
            .pause(100)
            .$apply()

        expect(i).toBe(2)
    });
    it('rener方法在存在其他组件，那么组件以innerHTML方式引用子节点，子节点有ref', async() => {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    tip: 'g-up-tips',
                    text: 'xxxx'
                };

            }

            render() {
                return <div ref='parent' className='parent'>
                    <Child ref='child'>
                        <span ref="inner" className="inner">child</span>
                    </Child>
                </div>
            }
        }
        class Child extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }

            render() {
                return <div className='child'>{this.props.children}</div>
            }
        }
        var s = React.render(<App/>, div);
        await browser
            .pause(100)
            .$apply()
        expect(Object.keys(s.refs).sort()).toEqual(['child', 'inner','parent'])

    })
    it('用户在构造器里生成虚拟DOM', async() => {
        var a
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.sliderLeftJSX = this.renderSlider('btnLeft');
                this.state = {};
            }
            renderSlider(which = 'btnLeft') {
                return (<span ref={dom => {
                    this[which] = dom;
                }}/>);
            }
            componentDidMount() {
                a = !!this.btnLeft
            }

            render() {
                return (
                    <div >
                        <div className="track" ref="track">
                            {this.sliderLeftJSX}
                        </div>
                    </div>
                );
            }
        }
        var s = React.render(<App/>, div);
        await browser
            .pause(100)
            .$apply()

        expect(a).toBe(true)

    })

})