import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React'
import {SyntheticEvent, addEvent} from 'src/event'
import {DOMElement} from 'src/browser'

describe('生命周期例子', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    })
    var body = document.body, div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)
    })
    it('如果在componentDidMount中调用setState方法\n那么setState的所有回调，\n都会延迟到componentDidUpdate中执行', async() => {
        var list = []
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 'aaa'
                }
            }
            componentWillMount() {
                this.setState({
                    aaa: 'bbb'
                }, function(){
                    list.push('1111')
                })
            }
            componentDidMount() {
                this.setState({
                    aaa: 'cccc'
                }, function(){
                    list.push('2222')
                })
                this.setState({
                    aaa: 'dddd'
                }, function(){
                    list.push('3333')
                })
                list.push('did mount')
            }
          
            componentWillUpdate() {
                list.push('will update')
            }
            componentDidUpdate() {
                list.push('did update')
            }
            render() {
                list.push(this.state.aaa)
                return <div>{this.state.aaa}</div>

            }
        }
   
        var s = ReactDOM.render(
            <App/>, div);
        await browser
            .pause(300)
            .$apply()
        expect(list.join('-')).toBe('bbb-did mount-will update-dddd-did update-1111-2222-3333')
       
       
    })
    it('父组件没有DidMount之时被子组件在willMount钩子里调用其setState', async() => {
        var list = []
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 'app render'
                }
            }
            componentWillMount() {
                list.push('app will mount')
            }
            componentDidMount() {
                list.push('app did mount')
            }
          
            componentWillUpdate() {
               list.push('app will update')
            }
            componentDidUpdate() {
                list.push('app did update')
            }
            render() {
                list.push(this.state.aaa)
                return <div ><A parent={this} />{this.state.aaa}</div>
            }
        }
        class A extends React.Component{
           componentWillMount(){
               this.props.parent.setState({
                   aaa: 'app new render'
               })
               this.props.parent.setState({
                   aaa: 'app new render2'
               })
           }
           componentWillReceiveProps(){
               list.push('child receive')
           }
           render(){
               return <p>A</p>
           }
        }
        var s = ReactDOM.render(
            <App/>, div);
        await browser
            .pause(300)
            .$apply()
        expect(list.join('-')).toBe('app will mount-app render-app did mount-app will update-app new render2-child receive-app did update')
    })

    it('父组件DidMount之时被子组件在componentWillReceiveProps钩子里调用其setState\n父组件的再次render会待到这次render完才调起', async() => {
    })
})