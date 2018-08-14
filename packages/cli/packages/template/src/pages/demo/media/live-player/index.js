import React from '../../../../ReactWX';

class LivePlayer extends React.Component {
    render() {
        return (
            <div class="container">
                由于限制，无法预览
            </div>
        );
    }
}

Page(React.createPage(LivePlayer, 'pages/demo/media/live-player/index'));

export default LivePlayer;
