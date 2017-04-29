import eventHook, {
    beforeHook,
    afterHook,
    browser
} from 'karma-event-driver-ext/cjs/event-driver-hooks';
let {
    $serial
} = browser;
import React from 'src/React'

describe('node模块', function () {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    after(async () => {
        await afterHook(false);
    });
    it('连续点击一个DIV', async () => {
        var div = document.createElement('div');

        document.body.appendChild(div);
        div.innerHTML = '看到我吗？'
        var a = 1;
        div.onclick = function () {
            a++
            browser.$next();
        };

        await browser
            .click(div)
            .$apply('wait');
        expect(a).toBe(2);

        await browser
            .click(div)
            .$apply('wait');

        expect(a).toBe(3);
        document.body.removeChild(div)
    });
    it('输出简单的元素', async () => {
        var div = document.createElement('div');

        document.body.appendChild(div);
       
        var s = React.render(<div>222</div>, div)

        await browser.pause(100).$apply()
        expect(s.vnode.dom.nodeName).toBe('DIV');

      
        document.body.removeChild(div)
    });
    it('下拉菜单的选择', async () => {
        let rs, prom = new Promise((s) => {
            rs = s;
        })
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
                this.setState({
                    city: value,
                })
            }
            componentDidMount() {
                rs()
            }
            componentDidUpdate() {
                browser.$next();
            }
            render() {
                return <select name='city'
                    id="node2"
                    value={this.state.city}
                    onChange={
                        this.handleCity.bind(this)
                    } >
                    <option value='hz' >杭州</option>
                    <option value='bj' >北京</option>
                    <option value='sh' >上海</option>
                </select>
            }
        }

        var div2 = document.createElement('div');

        document.body.appendChild(div2);
        var s = React.render(<Select />, div2)

        await prom;

        expect(s.vnode.dom.children[1].selected).toBe(true)
        await browser.selectByVisibleText('#node2', '上海').$apply('wait');

        expect(s.vnode.dom.children[2].selected).toBe(true)
        await browser.selectByVisibleText('#node2', '杭州').$apply('wait');
        expect(s.vnode.dom.children[0].selected).toBe(true)


        document.body.removeChild(div2)

    })

    it('下拉菜单的options重排后确保selected正确', async () => {
        let rs, prom = new Promise((s) => {
            rs = s;
        })
        class Select extends React.Component {
            constructor() {
                super()
                this.state = {
                    city: "bj",
                    cities: [{ value: 'bj', text: '北京' }, { value: 'hj', text: '杭州' }, { value: 'nj', text: '南京' }],
                }
            }
            change() {
                this.setState({
                    cities: [{ value: 'hj', text: '杭州' }, { value: 'nj', text: '南京' }, { value: 'bj', text: '北京' }],
                })
            }
            handleCity(e) {
                var value = e.target.value;
                this.setState({
                    city: value,
                })
            }
            componentDidMount() {
                rs()
            }
            componentDidUpdate() {
                browser.$next();

            }
            render() {
                return <select name='city'
                    id="node3"
                    value={this.state.city}
                    onChange={this.handleCity.bind(this)} >
                    {
                        this.state.cities.map(function (el) {
                            return <option value={el.value}>{el.text}</option>
                        })
                    }
                </select>
            }
        }

        var div3 = document.createElement('div');

        document.body.appendChild(div3);
        var s = React.render(<Select />, div3)

        await prom;

        expect(s.vnode.dom.children[0].text).toBe('北京')
        expect(s.vnode.dom.children[1].text).toBe('杭州')
        expect(s.vnode.dom.children[2].text).toBe('南京')
        s.change()

        return $serial(async () => {
            expect(s.vnode.dom.children[0].text).toBe('杭州')
            expect(s.vnode.dom.children[1].text).toBe('南京')
            expect(s.vnode.dom.children[2].text).toBe('北京')
            document.body.removeChild(div3)
        })
    })

    it('测试radio的onchange事件', async () => {
        let rs, prom = new Promise((s) => {
            rs = s;
        })
        class Radio extends React.Component {
            constructor() {
                super()
                this.state = {
                    checkedIndex: 2
                }
            }
            handleChange(index) {
                this.setState({
                    checkedIndex: index
                })
            }
            //webdriver.io不支持触发 checkbox的onchange事件，只能browsers.click它，然后在一个onClick回调中手动调用onChange回调
            onClick(index) {
                var me = this
                setTimeout(function () {
                    me.handleChange(index)
                })
            }
            componentDidMount() {
                rs()
            }
            componentDidUpdate() {
                browser.$next();
            }
            render() {

                return <div>
                    {
                        [1, 2, 3].map(function (el) {
                            return <input type='radio' id={'radio' + el} name='xxx' key={el} value={el}
                                checked={this.state.checkedIndex === el}
                                onClick={this.onClick.bind(this, el)}
                                onChange={this.handleChange.bind(this, el)} />

                        }, this)
                    }
                </div>
            }
        }

        var div = document.createElement('div');

        document.body.appendChild(div);
        var s = React.render(<Radio />, div)

        await prom;

        expect(s.vnode.dom.children[0].checked).toBe(false)
        expect(s.vnode.dom.children[1].checked).toBe(true)
        expect(s.vnode.dom.children[2].checked).toBe(false)
        await browser.click('#radio3').$apply('wait')
        return $serial(async () => {
            expect(s.vnode.dom.children[0].checked).toBe(false)
            expect(s.vnode.dom.children[1].checked).toBe(false)
            expect(s.vnode.dom.children[2].checked).toBe(true)
            document.body.removeChild(div)
        })
    })

    it('测试input元素的oninput事件', async () => {
        let rs, prom = new Promise((s) => {
            rs = s;
        })
        var values = ['x', 'xx', 'xxx', 'xxxx']
        class Input extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: 2
                }
            }
            onInput(e) {
                this.setState({
                    value: e.target.value
                })
            }

            componentDidMount() {
                rs()
            }
            componentDidUpdate() {
                expect(s.vnode.dom.children[0].value).toBe(values.shift())
                browser.$next();
            }
            render() {
                return <div>
                    <input id='node4' value={this.state.value} onInput={this.onInput.bind(this)} />{this.state.value}
                    <input type='image'/> <input type='button' value='提交'/>
                </div>
            }
        }

        var div = document.createElement('div');

        document.body.appendChild(div);
        var s = React.render(<Input />, div)

        await prom;

        expect(s.vnode.dom.children[0].value).toBe('2')

        await browser.setValue('#node4', 'xxxx').$apply('wait')
   
        document.body.removeChild(div)
   

    })
    it('测试textarea元素的oninput事件', async () => {
        let rs, prom = new Promise((s) => {
            rs = s;
        })
        var values = ['x', 'xx', 'xxx', 'xxxx']
        class TextArea extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: 4
                }
            }
            onInput(e) {
               // console.log('oninput', e.type, e.target.value)
                this.setState({
                    value: e.target.value
                })
            }

            componentDidMount() {
                rs()
            }
            componentDidUpdate() {
                expect(s.vnode.dom.children[0].value).toBe(values.shift())
                browser.$next();
            }
            render() {
                return <div>
                    <textarea id='node5' onInput={this.onInput.bind(this)} >{this.state.value}</textarea>{this.state.value}
                </div>
            }
        }

        var div = document.createElement('div');

        document.body.appendChild(div);
        var s = React.render(<TextArea />, div)

        await prom;

        expect(s.vnode.dom.children[0].value).toBe('4')

        await browser.setValue('#node5', 'xxxx').$apply('wait')
   
        document.body.removeChild(div)
   

    })
   it('非受控组件textarea的value不可变', async () => {
        let rs, prom = new Promise((s) => {
            rs = s;
        })
        class TextArea extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: 5
                }
            }

            componentDidMount() {
                rs()
            }
            render() {
                return <div>
                    <textarea id='node6' value={this.state.value} ></textarea>{this.state.value}
                </div>
            }
        }

        var div = document.createElement('div');

        document.body.appendChild(div);
        var s = React.render(<TextArea />, div)

        await prom;

        expect(s.vnode.dom.children[0].value).toBe('5')

        await browser.setValue('#node6', 'xxxx').pause(300).$apply()

        expect(s.vnode.dom.children[0].value).toBe('5')

        document.body.removeChild(div)
   
    })
  it('非受控组件checkbox的checked不可变', async () => {
      
        class Com extends React.Component {
            constructor() {
                super()
                this.state = {
                    value: true
                }
            }
            render() {
                return <div>
                   <input id='node7' type='checkbox' name='xxx' checked={this.state.value}  />
                
                </div>
            }
        }

        var div = document.createElement('div');

        document.body.appendChild(div);
        var s = React.render(<Com />, div)
        await browser.pause(100).$apply()

        expect(s.vnode.dom.children[0].checked).toBe(true)

        await browser.click('#node7').pause(300).$apply()

        expect(s.vnode.dom.children[0].checked).toBe(true)

        document.body.removeChild(div)
   
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

        var div = document.createElement('div');

        document.body.appendChild(div);
        var s = React.render(<Com />, div)
        await browser.pause(100).$apply()

        expect(s.vnode.dom.children[1].selected).toBe(true)
        await browser.selectByVisibleText('#node8', 'ccc').pause(300).$apply()

        expect(s.vnode.dom.children[2].selected).toBe(false)
        expect(s.vnode.dom.children[1].selected).toBe(true)

        document.body.removeChild(div)
     })

})