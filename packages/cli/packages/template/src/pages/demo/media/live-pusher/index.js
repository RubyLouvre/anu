import React from '../../../../ReactWX';

class LivePusher extends React.Component {
    render() {
        return (
            <div class="container">
                由于限制，无法预览
            </div>
        );
    }
}

Page(React.createPage(LivePusher, 'pages/demo/media/live-pusher/index'));

export default LivePusher;
