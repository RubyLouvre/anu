import React from '@react';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            state: '未开始',
            title: 'audio',
            color: '#9E9E9E;',
            audio: {
                src:
                    'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
                poster:
                    'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
                name: '此时此刻',
                author: '许巍',
                loop: false,
                controls: true
            }
        };
    }

    onPlay() {
        this.setState({
            state: '正在播放',
            color: '#4CAF50;'
        });
    }

    onPause() {
        this.setState({
            state: '暂停',
            color: '#FFEB3B;'
        });
    }

    onError() {
        this.setState({
            state: '出错了',
            color: '#F44336;'
        });
    }

    onEnded() {
        this.setState({
            state: '停止',
            color: '#607D8B;'
        });
    }

    render() {
        return (
            <div style="display:flex;flex-direction:column;align-items:center;padding-top:25rpx;">
                <div>
                    <audio
                        src={this.state.audio.src}
                        loop={this.state.audio.loop}
                        controls={this.state.audio.controls}
                        poster={this.state.audio.poster}
                        name={this.state.audio.name}
                        author={this.state.audio.author}
                        onPlay={this.onPlay.bind(this)}
                        onEnd={this.onEnded.bind(this)}
                        onPause={this.onPause.bind(this)}
                        onError={this.onError.bind(this)}
                    />
                </div>
                <div style="font-size: 32rpx;">
                    <span style="color: #999;">当前状态：</span>
                    <span style={{color: this.state.color}}>{this.state.state}</span>
                </div>
            </div>
        );
    }
}

export default P;
