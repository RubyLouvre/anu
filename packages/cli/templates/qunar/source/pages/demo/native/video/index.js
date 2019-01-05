import React from '@react';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            src:
                'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
            danmuList: [
                {
                    text: '你好👋',
                    color: 'green',
                    time: 1
                },
                {
                    text: '干杯🍻',
                    olor: 'green',
                    time: 3
                }
            ],
            controls: true,
            enableDanmu: true,
            danmuBtn: true,
            loop: true
        };
    }
    render() {
        return (
            <div>
                <div class="page_hd">{this.state.title}</div>
                <div class="page_bd">
                    <div class="navigation">
                        <video
                            src={this.state.src}
                            controls={this.state.controls}
                            danmuList={this.state.danmuList}
                            loop={this.state.loop}
                            enableDanmu={this.state.enableDanmu}
                            danmuBtn={this.state.danmuBtn}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default P;
