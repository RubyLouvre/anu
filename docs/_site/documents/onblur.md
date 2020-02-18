# 快应用的onblur

快应用的onblur事件不会自动触发
```jsx
<input
id="ANU_INPUT"
class="input-city"
value={this.state.inputValue}
placeholder={this.props.placeholder}
placeholder-style="color:#b2b2b2;"
onBlur={this.handleBlur}
onFocus={this.handleFocus}
onChange={this.handleKeyInput}
/>
```

需要为此元素添加一个ID，然后在某个类似失去焦点的时机触发它

```javascript
emitBlur(){
    if (process.env.ANU_ENV === 'quick') {
        this.wx.$element('ANU_INPUT').focus({ focus: false });
    }
}
```