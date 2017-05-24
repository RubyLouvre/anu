import eventHook, { beforeHook, beforeEachHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
let { $serial } = browser;

describe('Event Drive Tests', function() {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    beforeEach(() => {
        beforeEachHook();
    })
    after(async () => {
        await afterHook();
    });
    it('click element', async () => {
        var div = document.createElement('div');

        document.body.appendChild(div);
        div.innerHTML = 'Click Me';
        var a = 1;
        div.onclick = function() {
            setTimeout(() => {
                a++;
                browser.$next();
            }, 500)
        };

        await browser
            .click(div)
            .$apply('applyAndWaitForNext'); // equal to .$applyAndWaitForNext()
        expect(a).to.equal(2);

        await browser
            .click(div)
            .$apply('applyAndWaitForNext'); // equal to .$applyAndWaitForNext()

        expect(a).to.equal(3);
    });

    it('Test Default', async () => {
        let React = react;
        let ReactDOM = react;
        class Select extends React.Component {
            constructor() {
                super();
                this.state = {
                    city: "bj"
                };
            }

            handleCity(e) {
                let value = e.target.value;
                this.setState({
                    city: value
                });
            }

            componentDidUpdate() {
                browser.$next();
            }

            componentDidMount() {
                browser.$next();
            }

            render() {
                return <select name='city' id='city'
                    value={this.state.city} onChange={this.handleCity}>
                    <option value='hz'>杭州</option>
                    <option value='bj'>北京</option>
                    <option value='sh'>上海</option>
                </select>
            }
        }

        ReactDOM.render(<Select />, document.body);
        
        // await $serial support, a promise returned
        // won't start executing util browser.$next is called
        return $serial(
            async () => {
                await browser
                    .selectByVisibleText('select', '上海')
                    .$apply('applyAndWaitForNext');
                expect(document.getElementById('city')children[2].selected).toBe(true)
            },
            async () => {
                await browser
                    .selectByVisibleText('select', '杭州')
                    .$applyAndWaitForNext();
                expect(document.getElementById('city').children[0].selected).toBe(true)
            }
        );
    });

});
