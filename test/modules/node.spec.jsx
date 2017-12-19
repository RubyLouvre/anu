import React from 'dist/React'

describe('node模块', function () {
    this.timeout(200000);
    var body = document.body, div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)

    })
    
  

    it('元素节点存在dangerouslySetInnerHTML',  () => {
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
      
        expect(div.getElementsByTagName('strong').length).toBe(1)
        s.change(1)
        expect(div.getElementsByTagName('span').length).toBe(1)


    })
   
   
    it('removedChildren',  () => {
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

        expect(div.getElementsByTagName('p').length).toBe(4)
       s.refs.a.click()
        expect(div.getElementsByTagName('p').length).toBe(1)
    })

 
    it('用一个新组件替换另一个组件',  () => {
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

        expect(div.getElementsByTagName('strong').length).toBe(1)
        s.handleClick()
        expect(div.getElementsByTagName('em').length).toBe(1)
        //expect(div.getElementsByTagName('p').length).toBe(1)
    })


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
        expect(div.firstChild.style.color).to.equal('red');
        index = 0

        test(<Comp />);
        expect(div.firstChild.style.color).to.equal('');
    });


})