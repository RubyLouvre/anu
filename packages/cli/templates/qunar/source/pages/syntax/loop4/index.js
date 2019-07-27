import React from '@react';
import Cat from '@syntaxComponents/Cat/index';
import Fish from '@syntaxComponents/Fish/index';
import './index.scss';

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
                    content: '我的蛙儿子到现在都没回家'
                },
                {
                    id: 1,
                    type: 'Fish',
                    content: '你中毒已深'
                },
                {
                    id: 2,
                    type: 'Cat',
                    content: '他该不会嫌弃他母亲穷，在外面有家了吧？'
                },
                {
                    id: 3,
                    type: 'Fish',
                    content: '应该没有这种操作吧？'
                },
                {
                    id: 4,
                    type: 'Cat',
                    content: '难不成被贝爷吃了？'
                },
                {
                    id: 4,
                    type: 'Fish',
                    content: '那一定是你没有为他买幸运铃！'
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
        type = e.detail.value || e.target.value;
    }
    onChange(e){
        this.setState({
            value: e.target.value
        });
    }
    render() {
        return (
            <div class="anu-block">
                <div>循环里面交替使用两利不同的组件</div>
                <ul class="anu-block">
                    {this.state.msgList.map(function(msg) {
                        return (
                            <li class='anu-block' key={msg.id}>
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
                <textarea value={this.state.value} auto-height={true} onChange={this.onChange.bind(this)} style="border:1px solid grey;"/>
                <button type="button" onClick={this.sendMsg.bind(this)}>添加</button>
            </div>
        );
    }
}
export default P;
