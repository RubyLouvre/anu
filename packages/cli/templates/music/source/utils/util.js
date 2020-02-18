
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function formatduration(duration) {
    duration = new Date(duration);
    return formatNumber(duration.getMinutes()) + ':' + formatNumber(duration.getSeconds());
}

function toggleplay(that, app, cb) {
    cb = cb || null;
    if (that.state.disable) {
        return;
    }
    if (that.state.playing) {
        
        that.setState({ playing: false });
        app.stopmusic(1);
    } else {
        
        that.setState({
            playing: true
        });
        app.seekmusic(app.globalData.playtype, app.globalData.currentPosition, cb);
    }
}

export default {
    formatduration,
    toggleplay
};