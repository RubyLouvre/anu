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
        return <select multiple="true" value={this.state.value} onChange={this.onChange}>
            <option value='aaa'>aaa</option>
            <option value='bbb'>bbb</option>
            <option value='ccc'>ccc</option>
        </select>
    }
}
window.onload = function(){
    window.s = ReactDOM.render( <Select />, document.getElementById('example'))
}