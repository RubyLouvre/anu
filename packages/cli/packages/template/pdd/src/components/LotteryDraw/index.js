import React from '@react';

class LotteryDraw extends React.Component {
    constructor(props) {
        super();
        // eslint-disable-next-line
        console.log('props',props);
        this.state = {
            data: props.awardData || [],
            awardsList: [],
            btnDisabled: '',
            animationData: {},
            animationRun: {},
            animationInit: {}
        };
    }
    getLottery() {
        var that = this;

        //中奖逻辑
        var awardIndex = this.props.awardIndex !== undefined
            ? this.props.awardIndex
            : Math.floor(Math.random() * this.state.data.length);

        // 初始化 rotate
        var animationInit = wx.createAnimation({
            duration: 1
        });
        this.setState({ animationInit });
        animationInit.rotate(0).step();

        this.setState({ animationData: animationInit.export() });
        this.setState({ btnDisabled: 'disabled' });

        // 旋转抽奖
        setTimeout(function() {
            var animationRun = wx.createAnimation({
                duration: 4000,
                timingFunction: 'ease'
            });
            that.state.animationRun = animationRun;
            animationRun.rotate(360 * 8 - awardIndex * (360 / that.state.data.length)).step();
            that.setState({ animationData: animationRun.export() });
        }, 100);

        // 中奖提示
        setTimeout(function() {
            wx.showModal({
                title: '恭喜',
                content: '获得' + that.state.data[awardIndex].name,
                showCancel: false,
                success: function() {
                    that.props.onOk();
                }
            });
            that.setState({
                btnDisabled: ''
            });
        }, 4100);
    }

    componentDidMount() {
        let defaultConfig = [
            { index: 0, name: '1元红包' },
            { index: 1, name: '5元话费' },
            { index: 2, name: '6元红包' },
            { index: 3, name: '8元红包' },
            { index: 4, name: '10元话费' },
            { index: 5, name: '10元红包' },
            { index: 6, name: '11元红包' },
            { index: 7, name: '11元红包' }
        ];
        let config;
        if (this.state.data.length === 0) {
            this.setState({ data: defaultConfig });
            config = defaultConfig;
        } else {
            config = this.state.data;
        }
    
        // 绘制转盘
        var len = config.length,
            rotateDeg = 360 / len / 2 + 90,
            html = [],
            turnNum = 1 / len; // 文字旋转 turn 值

        var ctx = wx.createContext();
        for (var i = 0; i < len; i++) {
            // 保存当前状态
            ctx.save();
            // 开始一条新路径
            ctx.beginPath();
            // 位移到圆心，下面需要围绕圆心旋转
            ctx.translate(150, 150);
            // 从(0, 0)坐标开始定义一条新的子路径
            ctx.moveTo(0, 0);
            // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
            ctx.rotate((((360 / len) * i - rotateDeg) * Math.PI) / 180);
            // 绘制圆弧
            ctx.arc(0, 0, 150, 0, (2 * Math.PI) / len, false);

            // 颜色间隔
            if (i % 2 == 0) {
                ctx.setFillStyle('#ffb820');
            } else {
                ctx.setFillStyle('#ffcb3f');
            }

            // 填充扇形
            ctx.fill();
            // 绘制边框
            ctx.setLineWidth(0.5);
            ctx.setStrokeStyle('#e4370e');
            ctx.stroke();

            // 恢复前一个状态
            ctx.restore();

            // 奖项列表
            html.push({ turn: i * turnNum + 'turn', award: config[i].name });
        }
        this.setState({ awardsList: html });

        wx.drawCanvas({
            canvasId: 'lotteryCanvas',
            actions: ctx.getActions()
        });
    }
    render() {
        return (
            <div class="canvas-container">
                <div animation={this.state.animationData} class="canvas-content">
                    <canvas
                        style="width: 300px; height: 300px;"
                        class="canvas-element"
                        canvas-id="lotteryCanvas"
                    />
                    {this.state.awardsList.map(function(item, index) {
                        return (
                            <div class="canvas-list" key={index}>
                                <div class="canvas-item">
                                    <text
                                        class="canvas-item-text"
                                        style={{
                                            '-webkit-transform': 'rotate(' + item.turn + ')',
                                            transform: 'rotate(' + item.turn + ')'
                                        }}
                                    >
                                        {item.award}
                                    </text>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div onTap={this.getLottery.bind(this)} class={'canvas-btn ' + this.state.btnDisabled}>
          抽奖
                </div>
            </div>
        );
    }
}

export default LotteryDraw;
