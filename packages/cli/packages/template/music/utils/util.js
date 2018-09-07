
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function formatduration(duration) {
    duration = new Date(duration);
    return formatNumber(duration.getMinutes()) + ':' + formatNumber(duration.getSeconds());
}

function toggleplay(that) {
    // eslint-disable-next-line
    //cb = cb || null;
    if (that.state.disable) {
        return;
    }
    if (that.state.playing) {
        // eslint-disable-next-line
        console.log('暂停播放');
        that.setState({ playing: false });
    //   app.stopmusic(1);
    } else {
        // eslint-disable-next-line
        console.log('继续播放');
        that.setState({
            playing: true
        });
    //   app.seekmusic(app.globalData.playtype, app.globalData.currentPosition, cb);
    }
}

export default {
    formatduration,
    toggleplay
};