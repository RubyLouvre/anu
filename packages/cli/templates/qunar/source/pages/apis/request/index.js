import React from '@react';
import './index.scss';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
    }
    async componentDidMount() {
        let that = this;
        console.log(React.api.request+'');
        let data  = await React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/11595/qunar/city'
        });
        let curData = that.cleanData(data.data);
        that.setState({data: curData});
    }
    cleanData(data) {
        let result = [];
        let obj = {};

        data.map((item)=> {
            if (/[A-Z]/.test(item)) {
                if (item !== 'A') {
                    result.push(obj);
                }
                obj = {};
                obj.title = item;
                obj.data = [];
            } else {
                obj.data.push(item);
            }
        });
        result.push(obj);
        return result;
    }
    render() {
        return (
            <div class='anu-block'>
                <p>就是使用React.api.request,对wx .request做了并发处理</p>
                <p>https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html</p>
                {this.state.data.map(function(el){
                    return <p>{el.title}-------
                        <ul class="anu-block" >
                            {el.data.map(function(elem){
                                return <p>{elem}</p>;
                            })}
                        </ul>
                    </p>;
                },this)}
            </div>
        );
    }
}

export default P;