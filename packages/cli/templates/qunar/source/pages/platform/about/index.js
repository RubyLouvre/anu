import React from '@react';
import './index.scss';

class About extends React.Component {
    constructor(){
        super();
        this.state = {
            name: 'qunar快应用',
            desc: '即点即用，让你省去下载安装的步骤，立即使用各类服务',
            serviceType: '工具类',
            subjectInfo: '北京趣拿软件科技有限公司',
            copyright: ''
        };
    }

    render() {
        return (
            <div className="demo-page">
                <image className="icon" src="@assets/logo.png"></image>

                <div className="name">{this.state.name}</div>
                <div className="name">手机品牌：{this.props.query.brand}</div>
                <div className="name">快应用版本号：{this.props.query.version}</div>

                <div className="tags">
                    <div className="tag">无安装</div>
                    <div className="gap">|</div>
                    <div className="tag">体积小</div>
                    <div className="gap">|</div>
                    <div className="tag">一步直达</div>
                </div>

                <div className="desc">{this.state.desc}</div>

                <div className="detail detail-first">
                    <div className="detail-title">服务类型</div>
                    <div className="detail-content">{this.state.serviceType}</div>
                </div>
                <div className="detail">
                    <div className="detail-title">主体信息</div>
                    <div className="detail-content">{this.state.subjectInfo}</div>
                </div>
                <div className="detail">
                    <div className="detail-title">页面参数</div>
                    <div className="detail-content">param1:{this.props.query.param1} param2:{this.props.query.param1}</div>
                </div>
                

                <div className="btn">
                    <button type="primary" size="default" onTap={React.api.createShortcut}>创建快捷方式</button>
                </div>

                <div className="footer">{this.state.copyright}</div>
            </div>
        );
    }
}

export default About;