import React from "../../../../ReactWX";
class P extends React.Component {
    constructor(props) {
       this.state = {
            focus: false,
            inputValue: ''
       }
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "input demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    bindButtonTap(){
        this.setState({
            focus: true
        });
    }
    bindKeyInput(e){
        this.setState({
            inputValue: e.value.trim()
        });
    }
    bindReplaceInput(e){
        // var value = e.detail.value
        // var pos = e.detail.cursor
        // if(pos != -1){
        //     //光标在中间
        //     var left = e.detail.value.slice(0,pos)
        //     //计算光标的位置
        //     pos = left.replace(/11/g,'2').length
        // }

        // //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        // return {
        //     value: value.replace(/11/g,'2'),
        //     cursor: pos
        // }

    }
    render() {
        return (
            <div class='container'>
                <div class="section">
                    <input value='呵呵呵' placeholder='这是一个可以自动聚焦的input' auto-focus/>
                </div>
                <div class="section">
                <input placeholder={'--这个只有在按钮点击的时候才聚焦'} focus={this.state.focus} />
                <div class="btn-area">
                    <button onTap={this.bindButtonTap}>使得输入框获取焦点</button>
                </div>
                </div>
                <div class="section">
                    <input  maxlength="10" placeholder="最大输入长度10" />
                </div>
                <div class="section">
                    <div class="section__title">你输入的是: {this.state.inputValue}</div>
                    <input onInput={this.bindKeyInput}  placeholder="输入同步到div中"/>
                </div>
                <div class="section">
                    <input  onInput={this.bindReplaceInput} placeholder="连续的两个1会变成2" />
                </div>
                <div class="section">
                    <input password type="number" />
                </div>
                <div class="section">
                    <input password type="text" />
                </div>
                <div class="section">
                    <input type="digit" placeholder="带小数点的数字键盘"/>
                </div>
                <div class="section">
                    <input type="idcard" placeholder="身份证输入键盘" />
                </div>
                <div class="section">
                    <input placeholder-style="color:red" placeholder="占位符字体是红色的" />
                </div>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/demo/form/input/index"));
export default P;
