import React from '@react';
import './index.scss';

class PageIndex extends React.Component {
    constructor() {
        super();
        this.state = {
            indicatorDots: true,
            vertical: false,
            autoplay: true,
            interval: 3000,
            duration: 1000,
            imgUrls: [
                'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
            ]
        };
    }

    goto(url) {
        if (url){
            React.api.navigateTo({ url });
        } else {
            React.api.showModal({
                title: '提示',
                content: '该部分仅展示，无具体功能!',
                showCancel: false
            });
        }
    }

    render() {
        return (
            <div className="chat-container anu-col">
                <div>
                    <swiper
                        className="swiper_box"
                        indicator-dots={this.state.indicatorDots}
                        vertical={this.state.vertical}
                        autoplay={this.state.autoplay}
                        interval={this.state.interval}
                        duration={this.state.duration}
                        onChange={this.swiperchange}
                    >
                        {this.state.imgUrls.map(function(item) {
                            return (
                                <swiper-item>
                                    <image src={item} className="slide-image" key={item} />
                                </swiper-item>
                            );
                        })}
                    </swiper>
                </div>
                <div className="text">
                    <div className="line_flag" />
                    <div>主题馆</div>
                </div>
                <div className="venues_box">
                    <div className="venues_list">
                        {this.props.indexPageIcons.map(function(item) {
                            return (
                                <div class="venues_item" key={item.bizIndex}>
                                    <div onClick={this.goto.bind(this, '../pages/brand/index?id='+item.bizIndex)}>
                                        <image src={item.logoSrc} className="slide-image-2"/>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="text">
                    <div className="line_flag" />
                    <div>全球精选</div>
                </div>
                <div className="venues_box">
                    <div className="venues_list">
                        {this.props.choiceItems.map(function(item) {
                            return (
                                <div class="venues_item" key={item.bizIndex}>
                                    <div onClick={this.goto.bind(this, '../pages/brand/index?id='+item.bizIndex)}>
                                        <image src={item.logoSrc} className="slide-image-1"/>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* <loading hidden={this.props.loadingHidden}>加载中...</loading> */}
            </div>
        );
    }
}

export default PageIndex;
