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

    it('复杂的孩子转换', function() {
        function getString(nodes) {
            var str = []
            for (var i = 0, node; node = nodes[i++];) {
                if(node.nodeType=== 8 && node.nodeValue.indexOf("react-text") !== 0){
                    continue
                }
                str.push(node.nodeName.toLowerCase())
            }
            return str.join(' ')
        }
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
        var s = ReactDOM.render(<App />, div)

      
        expect(getString(div.firstChild.childNodes)).toBe('#text p span strong')
        s.change(100)
        expect(getString(div.firstChild.childNodes)).toBe('em span #text span b i')
        s.change(100)
        expect(getString(div.firstChild.childNodes)).toBe('span')
    })

    it('对一个容器节点反复渲染组件或元素 ',  () => {
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
        test(<div>just a div</div>);
        test(<Comp />);

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
        expect(ReactDOM.findDOMNode(s) ).toBe(ReactDOM.findDOMNode(s2));
        s2.setState({value: 0});
        expect(ReactDOM.findDOMNode(s) ).toBe(ReactDOM.findDOMNode(s2));
        expect(ReactDOM.findDOMNode(s).nodeName).toBe('STRONG');
    })

})