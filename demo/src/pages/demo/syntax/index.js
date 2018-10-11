import React from '@react';
import Animal from '@components/Animal/index';
class Express extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '语法相关'
        };
    }
    config = {
        'navigationBarTextStyle': '#fff',
        'navigationBarBackgroundColor': '#0088a4',
        'navigationBarTitleText': 'Demo',
        'backgroundColor': '#eeeeee',
        'backgroundTextStyle': 'light'
    }
    componentWillMount(){
        // eslint-disable-next-line
        console.log('syntax componentWillMount');
    }
    componentDidMount(){
        // eslint-disable-next-line
        console.log('syntax componentDidMount');
    }
    render() {
        return (
            <div class='container'>
                <div class='page_hd'>{this.state.title}</div>
                <Animal name="aaa" age={16} />
            </div>
        );
    }
}
export default Express;
