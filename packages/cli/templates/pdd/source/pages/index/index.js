import React from '@react';
import PageIndex from '@components/PageIndex/index';
// import Dog from '@components/Dog/index'
import './index.less';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            loadingHidden: false, // loading
            indexPageIcons: [],
            choiceItems: []
        };
    }
    config = {
        backgroundTextStyle: 'white',
        navigationBarTextStyle: 'white',
        navigationBarTitleText: '环球小镇',
        navigationBarBackgroundColor: '#292929',
        backgroundColor: '#F2f2f2',
        // enablePullDownRefresh: true
    };
    globalData = {
        userInfo: null
    };

    componentWillMount() {
        // eslint-disable-next-line
        console.log('weixinchat onLoad');
        //sliderList
        this._isMounted = true;
        var that = this;
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/11550/wemall/venues/venuesList',
            method: 'GET',
            data: {},
            header: {
                Accept: 'application/json'
            },
            success: function(res) {
                that.setState({
                    indexPageIcons: res.data.indexPageIcons
                });
            }
        });

        //choiceList
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/11550/wemall/venues/choiceList',
            method: 'GET',
            data: {},
            header: {
                Accept: 'application/json'
            },
            success: function(res) {
                that.setState({
                    choiceItems: res.data.indexPageIcons
                });
                setTimeout(function() {
                    that.setState({
                        loadingHidden: true
                    });
                }, 1500);
            }
        });

        setTimeout(function() {
            if (!that.state.loadingHidden && that._isMounted) {
                React.api.showModal({
                    title: '提示',
                    content: '不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书'
                });
            }
        }, 6000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div>
                <PageIndex
                    loadingHidden={this.state.loadingHidden}
                    indexPageIcons={this.state.indexPageIcons}
                    choiceItems={this.state.choiceItems}
                />
            </div>
        );
    }
}

export default P;
