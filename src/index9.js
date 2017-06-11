class Select extends React.Component{
     constructor() {
        super()
        this.state = {
            value: 'bbb'
        }
        this.onChange = this.onChange.bind(this)
    }
    onChange(e){
       console.log(e.target.value)
       this.setState({
           value: e.target.value
       })
    }
    render() {
        return <div><select  value={this.state.value} onChange={this.onChange}>
            <option value='aaa'>aaa</option>
            <option value='bbb'>bbb</option>
            <option value='ccc'>ccc</option>
        </select><p>{this.state.value}</p></div>
    }
}
class Input extends React.Component{
     constructor() {
        super()
        this.state = {
            value: 'input'
        }
        this.onInput = this.onInput.bind(this)
    }
    onInput(e){
       this.setState({
           value: e.target.value
       })
    }
    render() {
        return <div><input value={this.state.value} onInput={this.onInput} />{this.state.value}</div>
    }
}
class Radio extends React.Component{
     constructor(props) {
        super(props)
        this.state = {
            value: this.props.value
        }
        this.onChange = this.onChange.bind(this)
    }
    onChange(e){
        console.log(e.target.value)
       this.setState({
           value: e.target.value
       })
    }
    render() {
        return <span><input type='radio' name={this.props.name} value={this.props.value}  onChange={this.onChange} />{this.state.value+''}</span>
    }
}
window.onload = function(){
    window.s = ReactDOM.render( <div><Select /><Input /><Radio name='sex' value="男" /><Radio name='sex' value='女'/></div>, document.getElementById('example'))
}