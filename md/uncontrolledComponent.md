##受控组件与非受控组件

一些表单元素，如select, textarea, input存在受控与非受控之分。受控就是用户可以通过点击，输入，选择等行为来控制其value/checked的改变，非受控则反之。

value, checked是表单元素两个很特殊的属性，决定着元素的外观。

当用户为表单元素指定了value, checked属性，那么框架就会进一步判定用户有没有定义其他用于控制它改变的属性与事件，比如说disabled, readOnly, onChange, onClick, onInput。如果有，它就是受控组件，没有就是非受控组件。

非受控组件的情况下，框架会在内部添加一些事件，阻止用户手动改变value/checked，这时用户只能通过setState来改变。

强烈建议，表单元素一定要弄成受控组件。

否则你不要使用value/checked，而是改用defaultValue/defaultChecked。

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
   <script type='text/javascript' src="./dist/React.js"></script>

    <script src="./libs/babel.js"></script>
    <script type='text/babel'>
var textarea, radio, text, select, checkbox
window.onload = function(){
class Text extends React.Component{
 constructor(props) {
    super(props);
    this.state={value:'Hello'};
    this.handleChange=this.handleChange.bind(this);
  }
  handleChange(event) {
     this.setState({value: event.target.value});
  }
  render() {
     var value = this.state.value;
    return <input type="text" value={this.state.value}  />;
  }
}
class Checkbox extends React.Component{
 constructor(props) {
    super(props);
    this.state={checked: false};
    this.handleChange=this.handleChange.bind(this);
  }
  handleChange(event) {
     this.setState({checked: event.target.checked});
  }
  render() {
     var value = this.state.value;
     return <input type="checkbox" name='xxx' checked={this.state.checked}  />;
  }
}
class Radio extends React.Component{
    constructor(props) {
        super(props);
        this.state={checked: false};
        this.handleChange=this.handleChange.bind(this);
  }
  handleChange(event) {
        this.setState({checked: event.target.checked});
  }
  render() {
        var value = this.state.value;
        return <input type="radio" name='xxx' checked={this.state.checked}  />
  }
}
class TextArea extends React.Component{
    constructor(props) {
        super(props);
        this.state={value: 'dddd'};
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({value: event.target.checked});
    }
    render() {
        return <textarea value={this.state.value}></textarea>
    }
}
class Select extends React.Component {
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
    text = ReactDOM.render(
        <Text />,
    document.getElementById('text')
    )
    checkbox = ReactDOM.render(
        <Checkbox />,
    document.getElementById('checkbox')
    )
    radio = ReactDOM.render(
        <Radio />,
    document.getElementById('radio')
    )
    textarea = ReactDOM.render(
        <TextArea />,
    document.getElementById('textarea')
    )
    select = ReactDOM.render(
        <Select />,
    document.getElementById('select')
    )
}
    </script>
</head>

<body>

    <div>各种非受控组件</div>
    <div id='text'></div>
    <div id='checkbox'></div>
    <div id='radio'></div>
    <div id='textarea'></div>
   <div id='select'></div>

</body>

</html>
```



注意，多选下拉框的value应该对应一个数组。