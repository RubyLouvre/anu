##调试

anu完全兼容官方的chrome开发者工具

先到[这里](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)


![image](https://cloud.githubusercontent.com/assets/190846/26409590/8ad8d146-40d3-11e7-8e3c-a16b47aa35a6.png)

然后

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style>
        .aaa {
            width: 200px;
            height: 200px;
            background: red;
        }
       .bbb {
            width: 200px;
            height: 200px;
            background: lawngreen;
        }
    </style>
    <script src="./dist/React.js"></script>
    <script src="./libs/devtools.js"></script>
    <script src="./libs/redux.js"></script>
    <script src="./libs/react-redux.js"></script>
    <script src="./libs/babel.js"></script>
    <script type='text/babel'>
      
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 'aaa'
                }
            }
            change(a){
                this.setState({
                    aaa:a
                })
            }
            componentDidMount(){
                console.log('App componentDidMount')
            }
            componentWillUpdate(){
                console.log('App componentWillUpdate')
            }
            render() {
                 return this.state.aaa === 'aaa' ?  <Inner className={this.state.aaa} />:
             <Inner2 className={this.state.aaa} />
             
            }
        }

        class Inner extends React.Component{
             constructor(props){
                super(props)
            }
            componentWillMount(){
                console.log('Inner componentWillMount')
            }
            componentDidMount(){
                console.log('Inner componentDidMount')
            }
            
            componentWillUpdate(){
                console.log('Inner componentWillUpdate')
            }
            componentDidUpdate(){
                console.log('Inner componentDidUpdate')
            }
            componentWillUnmount(){
                console.log('Inner componentWillUnmount')
            }
            render() {
                return  <div className={this.props.className}>xxx</div> 
            }

        }
        class Inner2 extends React.Component{
            constructor(props){
                super(props)
            }
            componentWillMount(){
                console.log('Inner2 componentWillMount')
            }
            componentDidMount(){
                console.log('Inner2 componentDidMount')
            }
             componentWillUpdate(){
                console.log('Inner2 componentWillUpdate')
            }
            componentWillUnmount(){
                console.log('Inner2 componentWillUnmount')
            }
            render() {
                return  <strong className={this.props.className}>yyy</strong>
            }

        }

var s 
window.onload = function(){
   s = ReactDOM.render( <App/>, document.getElementById('example'))
}
    </script>

</head>
<body>

    <div>开发者工具</div>
    <div id='example'></div>
</body>

</html>
```
![](http://wx2.sinaimg.cn/mw1024/7109e87fly1ffwuhe1nijj21740pktbf.jpg)