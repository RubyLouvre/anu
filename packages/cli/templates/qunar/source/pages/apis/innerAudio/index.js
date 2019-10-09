/* eslint-disable no-console */
import React from '@react';
import './index.scss';

const EVENT = [
    'onPlay',
    'onCanplay',
    'onPause',
    // 'onStop',
    'onEnded',
    'onTimeUpdate',
    'onError',
    'onWaiting',
    'onSeeking',
    'onSeeked'
];

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            audioIns: {},
            btnDisable: true,
            audio: {
                src:
                    'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
                name: '此时此刻',
                author: '许巍',
                loop: false,
                controls: false
            }
        };

        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    timer = null;

    componentDidMount() {}

    componentWillUnmount() {
        this.clearTimer();
    }

    clearTimer() {
        clearInterval(this.timer);
    }

    create() {
        const audio = React.api.createInnerAudioContext();
        console.log('audio:::', audio);

        audio.src =
            'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46';
        audio.autoplay = true;
        audio.startTime = 59;
        this.audioEl = audio;
        this.setState({ btnDisable: false });

        this.timer = setInterval(() => {
            const audioIns = {
                buffered: audio.buffered,
                currentTime: audio.currentTime,
                paused: audio.paused,
                duration: audio.duration
            };
            this.setState({ audioIns });
        }, 2000);
    }

    destroy() {
        if (this.state.btnDisable) return;
        this.audioEl.destroy();
        this.setState({ btnDisable: true, audioIns: {} });

        this.clearTimer();
    }

    setVolume(value) {
        console.log('setVolume:', value);
        if (this.state.btnDisable) return;
        this.audioEl.volume = value;
        console.log('after: setVolume:', this.audioEl.volume);
    }

    seek(pos) {
        this.audioEl.seek(pos);
    }

    onPlay(e) {
        console.log('onPlay:e:', e);
    }

    onCanplay(e) {
        console.log('canPlay:e:', e);
    }

    onPause(e) {
        console.log('onPause:e:', e);
    }

    onError(e) {
        console.log('onError:e:', e);
    }

    onEnded(e) {
        console.log('onEnded:e:', e);
    }

    onTimeUpdate(e) {
        console.log('onTimeUpdate:e:', e);
    }

    onWaiting(e) {
        console.log('onWaiting:e:', e);
    }

    render() {
        return (
            <div>
                <div className="tip">去控制台的 console 查看更多</div>
                <div className="tip">如果create失败，请尝试把react核心库更新到最新版</div>
                {!this.state.btnDisable ? (
                    <div>
                        <div>paused: {String(this.state.audioIns.paused)}</div>
                        <div>duration: {this.state.audioIns.duration}s(秒)</div>
                        <div>currentTime: {this.state.audioIns.currentTime}s(秒)</div>
                        <div>buffered: {this.state.audioIns.buffered}s(秒)</div>
                    </div>
                ) : null}
                <div className="row">
                    <button disabled={!this.state.btnDisable} onClick={this.create}>
                        create
                    </button>
                    <button disabled={this.state.btnDisable} onClick={this.destroy}>
                        destroy
                    </button>
                </div>
                <div className="row">
                    <button
                        disabled={this.state.btnDisable}
                        onClick={() => !this.state.btnDisable && this.audioEl.play()}>
                        play
                    </button>
                    <button
                        disabled={this.state.btnDisable}
                        onClick={() => !this.state.btnDisable && this.audioEl.pause()}>
                        pause
                    </button>
                    <button
                        disabled={this.state.btnDisable}
                        onClick={() => !this.state.btnDisable && this.audioEl.stop()}>
                        stop
                    </button>
                </div>
                <div className="row">
                    {[0, 0.1, 0.3, 0.5, 0.8, 1].map((v, idx) => (
                        <button
                            onClick={() => this.setVolume(v)}
                            key={idx}
                            disabled={this.state.btnDisable}>
                            {`${v * 100}%`}
                        </button>
                    ))}
                </div>
                <div className="row">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((v, idx) => (
                        <button
                            onClick={() => this.seek(v * 30)}
                            key={idx}
                            disabled={this.state.btnDisable}>
                            {`${v * 30}s`}
                        </button>
                    ))}
                </div>
                {EVENT.map((evt, idx) => {
                    const off = evt.replace('on', 'off');
                    const bd = this.state.btnDisable;
                    return (
                        <div className="row" key={idx}>
                            <button
                                disabled={bd}
                                onClick={() => !bd && this.audioEl[evt](this[evt])}>
                                {evt}
                            </button>
                            <button
                                disabled={bd}
                                onClick={() => !bd && this.audioEl[off](this[evt])}>
                                {off}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default P;
