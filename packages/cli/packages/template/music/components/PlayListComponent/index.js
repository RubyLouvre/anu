import React from '@react';

class PlayListComponent extends React.Component {
    constructor(props) {
        super();
        // eslint-disable-next-line
        console.log('props', props);
    }

    render() {
        return (
            <div>
                {this.props.privileges ? (
                    <div>
                        {this.props.list.map(function(re, idx) {
                            return (
                                <div
                                    key={re.id}
                                    class={
                                        'songs ' +
                    (re.id === this.props.curplay ? 'cur' : '') +
                    (this.props.privileges[idx].st >= 0 ? '' : 'disabled')
                                    }
                                >
                                    <navigator
                                        hover-class={this.props.privileges[idx].st < 0 ? 'none' : ''}
                                        url={
                                            this.props.privileges[idx].st >= 0
                                                ? '../playing/index?id=' + re.id + '&br=' + this.props.privileges.maxbr
                                                : ''
                                        }
                                        bindtap="playmusic"
                                    >
                                        <div class="flexlist flex-center">
                                            <div class="flexleft flexnum ">
                                                {re.id === this.props.curplay ? (
                                                    <image src="../../aseets/image/aal.png" style={{ width: '36rpx' }}>
                            image
                                                    </image>
                                                ) : (
                                                    <div>
                                                        <text class={this.props.toplist && idx < 3 ? 'topindex' : ''}>
                                                            {idx + 1}
                                                        </text>
                                                    </div>
                                                )}
                                            </div>
                                            <div class="flexlist">
                                                <div class="flexmain">
                                                    <div>
                                                        {re.name}
                                                        {re.alia.length && <text>（{re.alia[0]}）</text>}
                                                    </div>
                                                    <div class="relistdes">
                                                        {re.ar[0].name}-{re.al.name}
                                                    </div>
                                                </div>
                                                {re.mv != 0 && (
                                                    <div class="flexact">
                                                        <div class="fa_list fa_mv">
                                                            <navigator url="../mv/index?id={{re.mv}}">
                                                                <image src="../../assets/image/l0.png" mode="widthFix" />
                                                            </navigator>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </navigator>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        {this.props.list.map(function(re, idx) {
                            return (
                                <div
                                    key={re.id}
                                    class={
                                        'songs ' +
                    (re.id === this.props.curplay ? 'cur' : '') +
                    (re.st == -1 ? 'disabled' : '') +
                    re.id
                                    }
                                >
                                    <navigator
                                        hover-class={re.st == -1 ? 'none' : ''}
                                        url={
                                            re.st != -1
                                                ? '../playing/index?id=' + re.id + '&br='
                                                : ''
                                        }
                                        bindtap="playmusic"
                                    >
                                        <div class="flexlist flex-center">
                                            <div class="flexleft flexnum ">
                                                {re.id === this.props.curplay ? (
                                                    <image src="../../aseets/image/aal.png" style={{ width: '36rpx' }}>
                            image
                                                    </image>
                                                ) : (
                                                    <div>
                                                        <text class={this.props.toplist && idx < 3 ? 'topindex' : ''}>
                                                            {idx + 1}
                                                        </text>
                                                    </div>
                                                )}
                                            </div>
                                            <div class="flexlist">
                                                <div class="flexmain">
                                                    <div>
                                                        {re.name}
                                                        {re.alia.length && <text>（{re.alia[0]}）</text>}
                                                    </div>
                                                    <div class="relistdes">
                                                        {re.ar[0].name}-{re.al.name}
                                                    </div>
                                                </div>
                                                {re.mv != 0 && (
                                                    <div class="flexact">
                                                        <div class="fa_list fa_mv">
                                                            <navigator url="../mv/index?id={{re.mv}}">
                                                                <image src="../../assets/image/l0.png" mode="widthFix" />
                                                            </navigator>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </navigator>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}
export default PlayListComponent;
