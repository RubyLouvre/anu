import eventHook, {
    beforeHook,
    afterHook,
    browser
} from 'karma-event-driver-ext/cjs/event-driver-hooks';
let {
    $serial
} = browser;
import React from 'src/React'

describe('Event Drive Tests', function () {
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
                var value = e.target.value;
                this.setState({
                    city: value,
                })
            }
            componentDidMount() {
                console.log('mount......')
             
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

        var div = document.createElement('div');

        document.body.appendChild(div);
        var s = React.render(<Select />, document.body)

        await prom;

        expect(s.vnode.dom.children[1].selected).toBe(true)
        await browser.selectByVisibleText('select', '上海').$apply('wait');
        console.log('选择下拉项的某一项');

        expect(s.vnode.dom.children[2].selected).toBe(true)
        await browser.selectByVisibleText('select', '杭州').$apply('wait');
        expect(s.vnode.dom.children[0].selected).toBe(true)
        // document.removeChild(div)



    });
});