import React from '@react';
import './index.less';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            imgPath: ''
        };
    }

    config = {
        navigationBarTextStyle: '#fff',
        navigationBarBackgroundColor: '#0088a4',
        navigationBarTitleText: 'base demo',
        backgroundColor: '#eeeeee',
        backgroundTextStyle: 'light'
    };

    chooseImage() {
        React.api
            .chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
            })
            .then(res => {
                this.setState({
                    imgPath: res.tempFilePaths
                });
            })
            .fail(res => {
                this.setState({
                    imgPath: res.tempFilePaths.toString()
                });
            });
    }

    sendRequest() {
        React.api
            .request({
                url: 'test.php',
                data: {
                    x: 1,
                    y: 1
                }
            })
            .then(function(res) {
                // eslint-disable-next-line
                console.log(res);
            })
            .catch(function() {
                React.api.showModal({
                    title: '提示',
                    content: '服务器出错了',
                    success: function(res) {
                        if (res.confirm) {
                            // eslint-disable-next-line
                            console.log('用户点击确定');
                        } else if (res.cancel) {
                            // eslint-disable-next-line
                            console.log('用户点击取消');
                        }
                    }
                });
            });
    }

    getLocation() {
        React.api
            .getLocation({
                type: 'wgs84'
            })
            .then(function(res) {
                return React.api.showModal({
                    title: '提示',
                    content: `latitude: ${res.latitude},  longitude: ${
                        res.longitude
                    }`
                });
            })
            .then(function(res) {
                if (res.confirm) {
                    // eslint-disable-next-line
                    console.log('用户点击确定');
                } else if (res.cancel) {
                    // eslint-disable-next-line
                    console.log('用户点击取消');
                }
            })
            .catch(function() {});
    }

    render() {
        return (
            <div class="container async-job-list">
                <view className="async-job-list-item">
                    <view>upload image</view>
                    {this.state.imgPath ? (
                        <image src={this.state.imgPath} />
                    ) : null}
                    <button onTap={this.chooseImage}>choose image</button>
                </view>
                <view className="async-job-list-item">
                    <view>send request</view>
                    <button onTap={this.sendRequest}>send request</button>
                </view>
                <view className="async-job-list-item">
                    <view>get location</view>
                    <button onTap={this.getLocation}>get location</button>
                </view>
            </div>
        );
    }
}

export default P;
