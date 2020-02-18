# async/await
nanachi可自由使用async/await语法

```jsx
import React from '@react';

class P extends React.Component {
    constructor(){
        super();
        this.state = {
            status: ''
        };
        this.tapHander = this.tapHander.bind(this);
    }
    say(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve('hello nanachi');
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
                <div>status: {this.state.status}</div>
                <button onTap={this.tapHander}>click me</button>
            </div>
        );
    }
}

export default P;
```
