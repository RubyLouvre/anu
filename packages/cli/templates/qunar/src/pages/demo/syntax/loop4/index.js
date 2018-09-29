import React from '@react';
import Cat from '@components/Cat/index';
import Fish from '@components/Fish/index';
// eslint-disable-next-line
var type = "Cat"
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            input:'',
            idCounter: 3,
            msgList: [
                {
                    id: 0,
                    type: 'Cat',
                    content: 'xxxx'
                },
                {
                    id: 1,
                    type: 'Cat',
                    content: '4324343'
                },
                {
                    id: 2,
                    type: 'Fish',
                    content: 'sdfsdf'
                },
                {
                    id: 3,
                    type: 'Cat',
                    content: 'erewre'
                },
            ]
        };
    }
    sendMsg() {
        if (!this.state.value){
            // eslint-disable-next-line
            console.warn('没有内容');
            return;
        }
        let msgList = [...this.state.msgList];
        let id = this.state.idCounter + 1;
        msgList.push({
            id: id + '',
            type: type, 
            content: this.state.value
        });
        this.setState({
            value: '',
            msgList,
            idCounter: id
        });
    }
    onSelect(e){
        type = e.value;
    }
    onInput(e){
        this.setState({
            value: e.target.value
        });
    }
    render() {
        return (
            <div class="page">
                <div>循环里面交替使用两利不同的组件</div>
                <ul>
                    {this.state.msgList.map(function(msg) {
                        return (
                            <li className="msg-container clearfix" key={msg.id}>
                                {msg.type === 'Cat'  && (
                                    <Cat id={msg.id} content={msg.content} />
                                )}
                                {msg.type === 'Fish' && (
                                    <Fish id={msg.id} content={msg.content} />
                                )}
                            </li>
                        );
                    })}
                </ul>
                <radio-group class="radio-group" onChange={this.onSelect.bind(this)}>
                    <radio value="Cat"  />Cat
                    <radio value="Fish" />Fish
                </radio-group>
                <textarea value={this.state.value} auto-height={true} onInput={this.onInput.bind(this)} style="border:1px solid grey;"/>
                <button type="button" onClick={this.sendMsg.bind(this)}>添加</button>
            </div>
        );
    }
}
export default P;
