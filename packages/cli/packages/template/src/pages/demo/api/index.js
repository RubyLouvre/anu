import React from "../../../ReactWX";
import './index.less';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            imgPath: ''
        }
       
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "base demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    chooseImage(){
        var self = this;
        React.wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          })
          .then(function(res){
             self.setState({
                imgPath: res.tempFilePaths
             });
          })
          .fail(function(fail){
             self.setState({
                imgPath: res.tempFilePaths.toString()
             });
          });

    }
    sendRequest(){
        React.request({
            url: 'test.php',
            data: {
                x:  1,
                y: 1
            }
        })
        .then(function(res){
            console.log(res);
        })
        .catch(function(err){
            React.wx.showModal({
                title: '提示',
                content: '服务器出错了',
                success: function(res){
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })

        })
       
    }
    getLocation(){
        React.wx.getLocation({
            type: 'wgs84'
        })
        .then(function(res){
            return React.wx.showModal({
                       title: '提示',
                       content: `latitude: ${res.latitude},  longitude: ${res.longitude}`
                   })
        })
        .then(function(res){
            if (res.confirm) {
                console.log('用户点击确定')
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
        })
        .catch(function(fail){
            
        })
    }
    render() {
        return (
            <div class='container async-job-list'>
                <view className='async-job-list-item'>
                    <view>upload image</view>
                    {
                        this.state.imgPath
                        ? <image src={this.state.imgPath}></image>
                        : null
                    }
                    <button onTap={this.chooseImage}>choose image</button>
                </view>
                <view className='async-job-list-item'>
                    <view>send request</view>
                    <button onTap={this.sendRequest}>send request</button>
                </view>
                <view className='async-job-list-item'>
                    <view>get location</view>
                    <button onTap={this.getLocation}>get location</button>
                </view>
            </div>
        );
    }
}

export default P;

