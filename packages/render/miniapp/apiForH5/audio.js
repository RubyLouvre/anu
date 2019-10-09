/**
 * changelog
 * 添加 React.api.createInnerAudioContext() 方法，使用方法同步微信小程序
 *    因为 iOS Safari 的限制，导致 volume 设置不生效(Android和PC目前正常)
 *    h5 audio 的原生 api 没有 stop 方法和事件，可以使用 pause() 加上 seek(0) 代替(即: 暂停 加上 跳转到开头)
 */

class InnerAudioContext {
    constructor(id, opts) {
        this.audioEl = this.init(id, opts);
        this._isPaused = false;
    }

    set src(value) {
        this.audioEl.src = value;
    }
    set startTime(value) {
        this.audioEl.mozCurrentSampleOffset = value;
    }
    set autoplay(value) {
        this.audioEl.autoplay = value;
    }
    set loop(value) {
        this.audioEl.loop = value;
    }
    set obeyMuteSwitch(value) {
        this.audioEl.muted = value;
    }
    set volume(value) {
        value = value >= 1 ? 1 : value <= 0 ? 0 : value;
        this.audioEl.volume = parseFloat(value);
    }

    get duration() {
        let v = '';
        if (this.audioEl.src) {
            v = this.audioEl.duration;
        }
        return v;
    }
    get currentTime() {
        let v = '';
        if (this.audioEl.src) {
            v = this.audioEl.currentTime;
        }
        return v;
    }
    get paused() {
        return this._isPaused;
    }
    get buffered() {
        const b = this.audioEl.buffered;
        return b.end(0);
    }
    get volume() {
        return this.audioEl.volume;
    }

    init(id) {
        let audioElement = document.createElement('AUDIO');
        if (id) {
            audioElement = document.getElementById(id);
        } else {
            audioElement.id = Date.now();
            audioElement.style.position = 'absolute';
            audioElement.style.top = '-200px';
            audioElement.preload = 'metadata';
            audioElement.controls = false;
            // test
            // audioElement.style.top = '60px';
            // audioElement.style.right = '0px';
            // audioElement.controls = true;
            // test End
            document.body.appendChild(audioElement);
        }
        return audioElement;
    }

    /**
     * 暂停
     */
    play() {
        this._isPaused = false;
        this.audioEl.play();
    }

    /**
     * 暂停
     */
    pause() {
        this._isPaused = true;
        this.audioEl.pause();
    }

    /**
     * 停止。停止后的音频再播放会从头开始播放。
     */
    // stop() {
    //     this.pause();
    //     this.seek(0);
    // }

    /**
     * 销毁当前实例
     */
    destroy() {
        this.audioEl.remove();
    }

    /**
     * 跳转到指定位置
     * @param {number} pos
     */
    seek(pos) {
        this.audioEl.currentTime = pos;
    }

    /**
     * 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
     * @param {function} callback 回调函数
     */
    onCanplay(callback) {
        this.audioEl.addEventListener('canplay', callback);
    }

    /**
     * 取消监听音频进入可以播放状态的事件
     * @param {function} callback 回调函数
     */
    offCanplay(callback) {
        this.audioEl.removeEventListener('canplay', callback);
    }

    /**
     * 监听音频播放事件
     * @param {function} callback 回调函数
     */
    onPlay(callback) {
        this.audioEl.addEventListener('play', callback);
    }

    /**
     * 取消监听音频播放事件
     * @param {function} callback 回调函数
     */
    offPlay(callback) {
        this.audioEl.removeEventListener('play', callback);
    }

    /**
     * 监听音频暂停事件
     * @param {function} callback 回调函数
     */
    onPause(callback) {
        this.audioEl.addEventListener('pause', callback);
    }

    /**
     * 取消监听音频暂停事件
     * @param {function} callback 回调函数
     */
    offPause(callback) {
        this.audioEl.removeEventListener('pause', callback);
    }

    /**
     * 监听音频停止事件
     * @param {function} callback 回调函数
     */
    // onStop(callback) {
    //     this.audioEl.addEventListener('ended', callback);
    // }

    /**
     * 取消监听音频停止事件
     * @param {function} callback 回调函数
     */
    // offStop(callback) {
    //     this.audioEl.removeEventListener('ended', callback);
    // }

    /**
     * 监听音频自然播放至结束的事件
     * @param {function} callback 回调函数
     */
    onEnded(callback) {
        this.audioEl.addEventListener('ended', callback);
    }

    /**
     * 取消监听音频自然播放至结束的事件
     * @param {function} callback 回调函数
     */
    offEnded(callback) {
        this.audioEl.removeEventListener('ended', callback);
    }

    /**
     * 监听音频播放进度更新事件
     * @param {function} callback 回调函数
     */
    onTimeUpdate(callback) {
        this.audioEl.addEventListener('timeupdate', callback);
    }

    /**
     * 取消监听音频播放进度更新事件
     * @param {function} callback 回调函数
     */
    offTimeUpdate(callback) {
        this.audioEl.removeEventListener('timeupdate', callback);
    }

    /**
     * 监听音频播放错误事件
     * @param {function} callback 回调函数
     */
    onError(callback) {
        this.audioEl.addEventListener('error', callback);
    }

    /**
     * 取消监听音频播放错误事件
     * @param {function} callback 回调函数
     */
    offError(callback) {
        this.audioEl.removeEventListener('error', callback);
    }

    /**
     * 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
     * @param {function} callback 回调函数
     */
    onWaiting(callback) {
        this.audioEl.addEventListener('waiting', callback);
    }

    /**
     * 取消监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
     * @param {function} callback 回调函数
     */
    offWaiting(callback) {
        this.audioEl.removeEventListener('waiting', callback);
    }

    /**
     * 监听音频进行跳转操作的事件
     * @param {function} callback 回调函数
     */
    onSeeking(callback) {
        this.audioEl.addEventListener('seeking', callback);
    }

    /**
     * 取消监听音频进行跳转操作的事件
     * @param {function} callback 回调函数
     */
    offSeeking(callback) {
        this.audioEl.removeEventListener('seeking', callback);
    }

    /**
     * 监听音频完成跳转操作的事件
     * @param {function} callback 回调函数
     */
    onSeeked(callback) {
        this.audioEl.addEventListener('seeked', callback);
    }

    /**
     * 取消监听音频完成跳转操作的事件
     * @param {function} callback 回调函数
     */
    offSeeked(callback) {
        this.audioEl.removeEventListener('seeked', callback);
    }
}

export default {
    createInnerAudioContext(id, opts = {}) {
        // eslint-disable-next-line no-console
        console.log('%ccreateInnerAudioContext::xxx::', 'color:red;font-size:21pt;');
        return new InnerAudioContext(id, opts);
    }
};
