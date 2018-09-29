import React from '@react';
import 'weapp-async-await';
const style = {
    'textAlign': 'center'
};
class P extends React.Component {
    constructor(){
        super();
        this.state = {
            status: ''
        };
    }
    say(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve('屌爆了!!');
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
