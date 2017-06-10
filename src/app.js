       
       
        class App extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: 'aaa'
                }
                this.change = this.change.bind(this)
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
                 return this.state.aaa === 'aaa' ?  <Inner title="aaa" className={this.state.aaa}  />:
             <Inner2 title="bbb" className={this.state.aaa}  />
             
            }
        }

        class Inner extends React.Component{
             constructor(props){
                super(props)
                this.state = {
                    value: '111'
                }
                this.onInput = this.onInput.bind(this)
            }
            onInput(e){
                this.setState({
                    value: e.target.value
                })
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
                return  <div className={this.props.className}><p>xxx{this.state.value}</p>
                <p><input value={this.state.value} onInput={this.onInput} /></p>
                </div> 
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