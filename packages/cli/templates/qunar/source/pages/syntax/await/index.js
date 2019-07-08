import React from '@react';
const style = {
    'textAlign': 'center'
};
class P extends React.Component {
    constructor(){
        super();
        this.state = {
            status: ''
        };
        this.bindFns();
    }
    bindFns(){
        this.tapHander = this.tapHander.bind(this);
        this.say = this.say.bind(this);
    }
    say(){
        return new Promise((rel)=>{
            setTimeout(()=>{
                rel('hello nanachi');
            }, 2000);
        });
    }
    async tapHander(){
        this.setState({status: 'waiting...' });
        let result = await this.say();
        this.setState({
            status: result
        });
    }
    render() {
        return (
            <div>
                <div style={style}>async/await</div>
                <div>status: {this.state.status}</div>
                <button onTap={this.tapHander}>试一试</button>
            </div>
        );
    }
}

export default P;