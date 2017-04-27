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
    it('click element', async () => {
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
    it('select', async () => {
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
                    id="select"
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
        await browser.selectByVisibleText('select', '上海').$apply('wait');

        expect(s.vnode.dom.children[2].selected).toBe(true)
        await browser.selectByVisibleText('select', '杭州').$apply('wait');
        expect(s.vnode.dom.children[0].selected).toBe(true)

       
        document.body.removeChild(div2)
       
    })

    it('select2', async () => {
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
                    id="select2"
                    value={this.state.city}
                    onChange={this.handleCity.bind(this) } >
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

    it('radio2', async () => {
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
            onClick(index){
                var me = this
                setTimeout(function(){
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
                            console.log('radio'+el)
                            return <input type='radio' id={'radio'+el} name='xxx' key={el} value={el}
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
    
});