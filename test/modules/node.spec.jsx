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
    it('连续点击一个DIV', async () => {
        div.innerHTML = '看到我吗？'
        var a = 1
        div.onclick = function () {
            a++
        }
        await browser.click(div).pause(100).$apply()

        expect(a).toBe(2)

        await browser.click(div).pause(100).$apply()

        expect(a).toBe(3)

    });
    it('输出简单的元素', async () => {

        var s = React.render(<div>222</div>, div)

        await browser
            .pause(100)
            .$apply()
        //组件直接返回元素节点
        expect(s.nodeName).toBe('DIV');


    });
    it('InputControlES6', async () => {

        class InputControlES6 extends React.Component {
            constructor(props) {
                super(props);

                // 设置 initial state
                this.state = {
                    text: props.initialValue || 'placeholder'
                }

                // ES6 类中函数必须手动绑定
                this.handleChange = this
                    .handleChange
                    .bind(this);
            }

            handleChange(event) {
                this.setState({ text: event.target.value });
            }

            render() {
                return (
                    <div>
                        Type something:
                        <input ref="input" onChange={this.handleChange} value={this.state.text} />
                    </div>
                )
            }
        }

        InputControlES6.defaultProps = {
            initialValue: '请输入内容'
        }

        var s = React.render(<InputControlES6 />, div)

        await browser
            .pause(100)
            .$apply()
        var input = s.refs.input
        expect(input.value).toBe('请输入内容')
        expect(input.getDOMNode()).toBe(input)

    })
    it('forceUpdate', async () => {


        class App extends React.Component {
            constructor(props) {
                super(props);

                // 设置 initial state
                this.state = {
                    text: 'xxx'
                };
            }

            shouldComponentUpdate() {
                return false
            }

            render() {
                return (
                    <div>
                        Type something:
                        <input ref="input" value={new Date - 0} />
                    </div>
                );
            }
        }

        App.defaultProps = {
            initialValue: '请输入内容'
        };
        div.innerHTML = '<span>remove</span>'



        var s = React.render(<App />, div)

        await browser
            .pause(100)
            .$apply()
        var index = 0
        expect(s.updater._hostNode.nodeName).toBe('DIV')
        s.forceUpdate(function () {
            index++
        })
        s.forceUpdate(function () {
            index++
        })
        await browser
            .pause(200)
            .$apply()
        expect(index).toBe(2)

    })
    it('下拉菜单的选择', async () => {

        class Select extends React.Component {
            constructor() {
                super()
                this.state = {
                    city: "bj"
                }
            }
            handleCity(e) {
                expect(e.type).toBe('change')
                var value = e.target.value;
                this.setState({ city: value })
            }
            render() {
                return <select
                    name='city'
                    id="node2"
                    value={this.state.city}
                    onChange={this
                        .handleCity
                        .bind(this)}>
                    <option value='hz'>杭州</option>
                    <option value='bj'>北京</option>
                    <option value='sh'>上海</option>
                </select>
            }
        }


        var s = React.render(<Select />, div)
        await browser.pause(100).$apply()

        expect(div.firstChild.children[1].selected).toBe(true)
        await browser.selectByVisibleText('#node2', '上海').pause(100).$apply()

        expect(div.firstChild.children[2].selected).toBe(true)
        await browser.selectByVisibleText('#node2', '杭州').pause(100).$apply()

        expect(div.firstChild.children[0].selected).toBe(true)


    })

    it('下拉菜单的options重排后确保selected正确', async () => {

        class Select extends React.Component {
            constructor() {
                super()
                this.state = {
                    city: "bj",
                    cities: [
                        {
                            value: 'bj',
                            text: '北京'
                        }, {
                            value: 'hj',
                            text: '杭州'
                        }, {
                            value: 'nj',
                            text: '南京'
                        }
                    ]
                }
            }
            change() {
                this.setState({
                    cities: [
                        {
                            value: 'hj',
                            text: '杭州'
                        }, {
                            value: 'nj',
                            text: '南京'
                        }, {
                            value: 'bj',
                            text: '北京'
                        }
                    ]
                })
            }
            handleCity(e) {
                var value = e.target.value;
                this.setState({ city: value })
            }
            render() {
                return <select
                    name='city'
                    id="node3"
                    value={this.state.city}
                    onChange={this
                        .handleCity
                        .bind(this)}>
                    {this
                        .state
                        .cities
                        .map(function (el) {
                            return <option value={el.value}>{el.text}</option>
                        })
                    }
                </select>
            }
        }
        ;
        var s = React.render(<Select />, div)
        await browser.pause(100).$apply()

        expect(s.updater._hostNode.children[0].text).toBe('北京')
        expect(s.updater._hostNode.children[1].text).toBe('杭州')
        expect(s.updater._hostNode.children[2].text).toBe('南京')
        s.change()
        await browser.pause(100).$apply()

        expect(s.updater._hostNode.children[0].text).toBe('杭州')
        expect(s.updater._hostNode.children[1].text).toBe('南京')
        expect(s.updater._hostNode.children[2].text).toBe('北京')


    })

    it('测试radio的onchange事件', async () => {

        class Radio extends React.Component {
            constructor() {
                super()
                this.state = {
                    checkedIndex: 2
                }
            }
            handleChange(index) {
                this.setState({ checkedIndex: index })
            }
            // webdriver.io不支持触发
            // checkbox的onchange事件，只能browsers.click它，然后在一个onClick回调中手动调用onChange回调
            onClick(index) {
                var me = this
                setTimeout(function () {
                    me.handleChange(index)
                })
            }

            render() {

                return <div>
                    {[1, 2, 3]
                        .map(function (el) {
                            return <input
                                type='radio'
                                id={'radio' + el}
                                name='xxx'
                                key={el}
                                value={el}
                                checked={this.state.checkedIndex === el}
                                onClick={this
                                    .onClick
                                    .bind(this, el)}
                                onChange={this
                                    .handleChange
                                    .bind(this, el)} />

                        }, this)
                    }
                </div>
            }
        }


        var s = React.render(<Radio />, div)
        await browser.pause(100).$apply()

        expect(s.updater._hostNode.children[0].checked).toBe(false)
        expect(s.updater._hostNode.children[1].checked).toBe(true)
        expect(s.updater._hostNode.children[2].checked).toBe(false)
        await browser.click('#radio3').pause(100).$apply()

        expect(s.updater._hostNode.children[0].checked).toBe(false)
        expect(s.updater._hostNode.children[1].checked).toBe(false)
        expect(s.updater._hostNode.children[2].checked).toBe(true)


    })

    it('测试input元素的oninput事件', async () => {

        var values = ['x', 'xx', 'xxx', 'xxxx']
        var el = ''
        class Input extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: 2
                }
            }
            onInput(e) {
                console.log('oninput', e.type, e.target.value)
                el = values.shift()
                this.setState({ value: e.target.value })
            }


            componentDidUpdate() {

                expect(s.updater._hostNode.children[0].value).toBe(el)

            }
            render() {
                return <div>
                    <input
                        id='node4'
                        value={this.state.value}
                        onInput={this
                            .onInput
                            .bind(this)} />{this.state.value}
                    <input type='image' />
                    <input type='button' value='提交' />
                </div>
            }
        }


        var s = React.render(<Input />, div)

        await browser.pause(100).$apply()

        expect(s.updater._hostNode.children[0].value).toBe('2')

        await browser
            .setValue('#node4', 'xxxx').pause(300).$apply()



    })
    it('测试textarea元素的oninput事件', async () => {

        var values = ['y', 'yy', 'yyy', 'yyyy']
        var el = ''
        class TextArea extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: 4
                }
            }
            onInput(e) {
                el = values.shift()
                this.setState({ value: e.target.value })
            }

            componentDidUpdate() {
                expect(s.updater._hostNode.children[0].value).toBe(el)
            }
            render() {
                return <div>
                    <textarea
                        id='node5'
                        onInput={this
                            .onInput
                            .bind(this)}>{this.state.value}</textarea>{this.state.value}
                </div>
            }
        }


        var s = React.render(<TextArea />, div)

        await browser
            .pause(100)
            .$apply()

        expect(s.updater._hostNode.children[0].value).toBe('4')

        await browser
            .setValue('#node5', 'yyyy').pause(300).$apply()


    })
    it('非受控组件textarea的value不可变', async () => {

        class TextArea extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: 5
                }
            }
            render() {
                return <div>
                    <textarea id='node6' value={this.state.value}></textarea>{this.state.value}
                </div>
            }
        }


        var s = React.render(<TextArea />, div)

        await browser
            .pause(100)
            .$apply()

        expect(s.updater._hostNode.children[0].value).toBe('5')

        await browser
            .setValue('#node6', 'xxxx')
            .pause(100)
            .$apply()

        expect(s.updater._hostNode.children[0].value).toBe('5')


    })
    it('非受控组件checkbox的checked不可变', async () => {

        class Checkbox extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: true
                }
            }
            render() {
                return <div>
                    <input id='node7' type='checkbox' name='xxx' checked={this.state.value} />

                </div>
            }
        }


        var s = React.render(<Checkbox />, div)
        await browser
            .pause(100)
            .$apply()

        expect(s.updater._hostNode.children[0].checked).toBe(true)

        await browser
            .click('#node7')
            .pause(300)
            .$apply()

        expect(s.updater._hostNode.children[0].checked).toBe(true)


    })
    it('非受控组件radio的checked不可变', async () => {

        class Radio extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: false
                }
            }
            render() {
                return <div>
                    <input id='radio7' type='checkbox' name='xxx' checked={this.state.value} />

                </div>
            }
        }


        var s = React.render(<Radio />, div)
        await browser
            .pause(100)
            .$apply()

        expect(s.updater._hostNode.children[0].checked).toBe(false)

        await browser
            .click('#radio7')
            .pause(300)
            .$apply()

        expect(s.updater._hostNode.children[0].checked).toBe(false)


    })
    it('元素节点存在dangerouslySetInnerHTML', async () => {
        class App extends React.Component {
            constructor() {
                super()
                this.state = {
                    aaa: 0
                }
            }
            change(s) {
                this.setState({
                    aaa: 1
                })
            }
            render() {
                return <div>{this.state.aaa === 1 ? <p dangerouslySetInnerHTML={{ __html: "<span>111</span" }}  >222</p> :
                    <p><strong>222</strong></p>
                }</div>
            }
        }
        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect(div.getElementsByTagName('strong').length).toBe(1)
        s.change(1)
        expect(div.getElementsByTagName('span').length).toBe(1)


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

        expect(s.updater._hostNode.children[1].selected).toBe(true)
        await browser
            .selectByVisibleText('#node8', 'ccc')
            .pause(200)
            .$apply()

        expect(s.updater._hostNode.children[2].selected).toBe(false)
        expect(s.updater._hostNode.children[1].selected).toBe(true)


    })

    it('父子组件间的通信', async () => {
        class Select extends React.Component {
            constructor(props) {
                super(props)

                this.state = {
                    value: props.value
                }
                this.onUpdate = props.onUpdate
                this.onChange = this.onChange.bind(this)
            }
            componentWillReceiveProps(props) {
                this.state = { //更新自己
                    value: props.value
                }
            }
            onChange(e) {//让父组件更新自己
                this.onUpdate(e.target.value)
            }
            render() {
                return <select id="communicate" value={this.state.value} onChange={this.onChange}>
                    <option>北京</option>
                    <option>南京</option>
                    <option>东京</option>
                </select>
            }
        }
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    value: '南京'
                }
            }
            onUpdate(value) { //让子组件调用这个父组件的方法
                this.setState({
                    value: value
                })
            }
            onChange(e) {
                this.onUpdate(e.target.value)

            }
            render() {
                return <div><Select onUpdate={this.onUpdate.bind(this)} value={this.state.value} /><input ref='sss' value={this.state.value} onChange={this.onChange.bind(this)} /></div>
            }

        }

        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.sss.value).toBe('南京')
        await browser
            .selectByVisibleText('#communicate', '北京').pause(100)
            .$apply()
        expect(s.refs.sss.value).toBe('北京')

    })
    it('empty Component', async () => {
        class Empty extends React.Component {
            render() {
                return null
            }
        }
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    value: '南京'
                }
            }
            onUpdate(value) { //让子组件调用这个父组件的方法
                this.setState({
                    value: value
                })
            }
            onChange(e) {//让父组件更新自己
                this.onUpdate(e.target.value)
            }
            render() {
                return <div><Empty />
                    <input ref="a" value={this.state.value} onInput={this.onChange.bind(this)} /></div>
            }
        }


        var s = React.render(<App />, div)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.a.value).toBe('南京')
        await browser.setValue(s.refs.a, '北京').pause(100)
            .$apply()
        expect(s.refs.a.value).toBe('北京')

    })
    it('移除组件', async () => {
        var str = ''
        class Component1 extends React.Component {
            componentWillUnmount() {
                str += 'xxxx'
            }
            render() {
                return <div className="component1">{this.props.children}</div>
            }
        }
        class Component2 extends React.Component {
            componentWillUnmount() {
                str += ' yyyy'
            }
            render() {
                return <div className="component2">xxx</div>
            }
        }
        var index = 1
        function detect(a) {
            console.log('detect 方法', index, a)
            if (index === 1) {
                expect(typeof a).toBe('object')
            } else {
                expect(a).toBeNull()
            }
        }
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.handleClick = this.handleClick.bind(this)
            }
            handleClick() {
                index = 0
                this.forceUpdate()
                setTimeout(function () {
                    console.log('应该输出', str)
                })
            }
            render() {
                return index ?
                    <div ref='a' onClick={this.handleClick.bind(this)}>
                        <Component1>
                            <p ref={detect}>这是子节点(移除节点测试1)</p>
                            <Component2 />
                        </Component1>
                    </div> : <div>文本节点</div>

            }
        };

        var s = React.render(<App />, div)

        await browser.pause(100).click(s.refs.a).pause(100)
            .$apply()
        expect(str).toBe('xxxx yyyy')

    })
    it('移除组件2', async () => {
        var index = 1
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.handleClick = this.handleClick.bind(this)
            }
            handleClick() {
                index = 0
                this.forceUpdate()
            }
            render() {
                return index ?
                    <div ref='a' onClick={this.handleClick.bind(this)}>
                        <div ref='b'><span>这是点击前</span></div>
                    </div> : <div><p><strong>这是点击后</strong></p></div>

            }
        };

        var s = React.render(<App />, div)

        await browser.pause(100).click(s.refs.a).pause(100)
            .$apply()
        expect(div.getElementsByTagName('p').length).toBe(1)

    })
    it('removedChildren', async () => {
        var index = 1
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.handleClick = this.handleClick.bind(this)
            }
            handleClick() {
                index = 0
                this.forceUpdate()
            }
            render() {
                return index ?
                    <div ref='a' onClick={this.handleClick.bind(this)}>
                        <p><strong>111</strong></p><p>2</p><p>3</p><p>4</p>
                    </div> : <div><p>11</p></div>

            }
        };

        var s = React.render(<App />, div)

        await browser.pause(100).$apply()
        expect(div.getElementsByTagName('p').length).toBe(4)
        await browser.click(s.refs.a).pause(100).$apply()
        expect(div.getElementsByTagName('p').length).toBe(1)
    })

    it('一个元素拥有多个实例', async () => {
        var arr = ['111', '222', '333']
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    title: 111
                }
            }

            handleClick() {

                this.setState({
                    title: arr.shift() || new Date - 0
                })

            }
            render() {
                return <B title={this.state.title} onClick={this.handleClick.bind(this)} />
            }
        }

        class B extends React.Component {
            componentWillReceiveProps() {
                this.forceUpdate()
            }
            render() {
                return <div title={this.props.title} onClick={this.props.onClick}  >{new Date - 0}<C /></div>;
            }
        }

        class C extends React.Component {
            render() {
                return <strong >{new Date - 0}</strong>;
            }
        }
        var s = React.render(<App />, div)

        await browser.pause(100).$apply()
        expect(div.getElementsByTagName('strong').length).toBe(1)
        expect(s).toInstanceOf(App)
        //expect(div.getElementsByTagName('p').length).toBe(1)
    })
    it('一个元素拥有多个实例2', async () => {
        var arr = ['111', '222', '333']
        class App extends React.Component {
            render() {
                return <div><A /></div>
            }
        }
        class A extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    title: 111
                }
            }

            handleClick() {

                this.setState({
                    title: arr.shift() || new Date - 0
                })

            }
            render() {
                return <B title={this.state.title} onClick={this.handleClick.bind(this)} />
            }
        }

        class B extends React.Component {
            componentWillReceiveProps() {
                this.forceUpdate()
            }
            render() {
                return <div title={this.props.title} onClick={this.props.onClick}  >{new Date - 0}<C /></div>;
            }
        }

        class C extends React.Component {
            render() {
                return <strong >{new Date - 0}</strong>;
            }
        }
        var s = React.render(<App />, div)

        await browser.pause(100).$apply()
        expect(div.getElementsByTagName('strong').length).toBe(1)
        s.forceUpdate()
        expect(div.getElementsByTagName('strong').length).toBe(1)
        //expect(div.getElementsByTagName('p').length).toBe(1)
    })

    it('用一个新组件替换另一个组件', async () => {
        var index = 1
        class App extends React.Component {

            handleClick() {
                index = 0
                this.forceUpdate()

            }
            render() {
                return <div onClick={this.handleClick.bind(this)}>
                    {index ? <A /> : <B />}</div>
            }
        }
        class A extends React.Component {

            render() {
                return <strong>111</strong>
            }
        }

        class B extends React.Component {
            render() {
                return <em>111</em>
            }
        }
        var s = React.render(<App />, div)

        await browser.pause(100).$apply()
        expect(div.getElementsByTagName('strong').length).toBe(1)
        s.handleClick()
        expect(div.getElementsByTagName('em').length).toBe(1)
        //expect(div.getElementsByTagName('p').length).toBe(1)
    })

    it('复杂的孩子转换', async () => {
        var index = 0
        var map = [
            <div >1111<p>ddd</p><span>333</span><Link /></div>,
            <div><em>新的</em><span>111</span>222<span>333</span><b>444</b><Link /></div>,
            <div><span>33</span></div>
        ]
        function Link() {
            return index == 1 ? <strong>ddd</strong> : <i>ddd</i>
        }
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 'aaa'
                }
            }
            change(a) {
                this.setState({
                    aaa: a
                })
            }
            componentDidMount() {
                console.log('App componentDidMount')
            }
            componentWillUpdate() {
                console.log('App componentWillUpdate')
            }
            render() {
                return map[index++]

            }
        }
        var s = React.render(<App />, div)

        await browser.pause(100).$apply()
        function getString(nodes) {
            var str = []
            for (var i = 0, node; node = nodes[i++];) {
                str.push(node.nodeName.toLowerCase())
            }
            return str.join(' ')
        }
        expect(getString(div.firstChild.childNodes)).toBe('#text p span strong')
        s.change(100)
        await browser.pause(100).$apply()
        expect(getString(div.firstChild.childNodes)).toBe('em span #text span b i')
        s.change(100)
        await browser.pause(100).$apply()
        expect(getString(div.firstChild.childNodes)).toBe('span')
    })

    it('对一个容器节点反复渲染组件或元素 ', async () => {
        class Comp extends React.Component {
            render() {
                return <span>span in a component</span>;
            }
        }
        let root;
        function test(content) {
            root = React.render(content, div);
        }

        test(<Comp />);
        await browser.pause(50).$apply()
        test(<div>just a div</div>);
        await browser.pause(50).$apply()
        test(<Comp />);
        await browser.pause(50).$apply()

        expect(div.firstChild.innerHTML).to.equal('span in a component');
    });

    it('切换style对象', async () => {
        var index = 1
        class Comp extends React.Component {
            render() {
                return <span style={index ? { color: 'red' } : null}>span in a component</span>;
            }
        }
        let root;
        function test(content) {
            root = React.render(content, div);
        }

        test(<Comp />);
        await browser.pause(50).$apply()
        expect(div.firstChild.style.color).to.equal('red');
        index = 0

        test(<Comp />);
        await browser.pause(50).$apply()
        expect(div.firstChild.style.color).to.equal('');
    });

    it('子组件的DOM节点改变了，会同步父节点的DOM', async () => {
        var s, s2
        class App extends React.Component {
            constructor(props) {
                super(props);
            }
            render() {
                return <A />
            }
        }
        class A extends React.Component {
            constructor(props) {
                super(props);
            }
            render() {
                return <B />
            }
        }
        class B extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: '3333'
                };
            }
            componentDidMount() {
                s2 = this
            }
            render() {
                return this.state.value ? <div>111</div> : <strong>3333</strong>
            }
        }
        var s = React.render(<App />, div);
        await browser.pause(200).$apply();
        expect(s.updater._hostNode ).toBe(s2.updater._hostNode);
        s2.setState({value: 0});
        expect(s.updater._hostNode ).toBe(s2.updater._hostNode);
        expect(s.updater._hostNode.nodeName).toBe('STRONG');
    })

})