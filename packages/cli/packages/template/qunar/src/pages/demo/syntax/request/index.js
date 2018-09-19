import React from '@react';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
    }
    componentDidMount() {
        let that = this;
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/city',
            success: function(data) {
                let curData = that.cleanData(data.data);
                that.setState({data: curData});
            }
        });
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
            <div class='city-select'>
                <p>就是使用React.api.request,对wx .request做了并发处理</p>
                <p>https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html</p>
                {this.state.data.map(function(el){
                    return <p>{el.title}-------
                        <ul>
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