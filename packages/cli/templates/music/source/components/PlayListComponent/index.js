import React from '@react';
import './index.scss';
import TNavigator from '@components/TNavigator/index';

class PlayListComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.privileges ? (
                    <div class="anu-col">
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
                                    <TNavigator
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
                                                {/**
                                                    re.id === this.props.curplay ? (
                                                        <image src="../../aseets/image/aal.png" style={{ width: '36rpx' }}>
                                                            image
                                                        </image>
                                                    ) : (
                                                        <div>
                                                            <text class={this.props.toplist && idx < 3 ? 'topindex' : ''}>
                                                                {idx + 1}
                                                            </text>
                                                        </div>
                                                    )
                                                */}
                                                <text class={this.props.toplist && idx < 3 ? 'topindex' : ''}>
                                                    {idx + 1}
                                                </text>
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
                                                {/**
                                                    re.mv != 0 && (
                                                        <div class="flexact">
                                                            <div class="fa_list fa_mv">
                                                                <TNavigator url="../mv/index?id={{re.mv}}">
                                                                    <image src="../../assets/image/l0.png" mode="widthFix" />
                                                                </TNavigator>
                                                            </div>
                                                        </div>
                                                    )
                                                */}
                                            </div>
                                        </div>
                                    </TNavigator>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div class="anu-col">
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
                                    <TNavigator
                                        hover-class={re.st == -1 ? 'none' : ''}
                                        url={
                                            re.st != -1
                                                ? '../playing/index?id=' + re.id + '&br='
                                                : ''
                                        }
                                        bindtap="playmusic"
                                    >
                                        <div class="displayFlex">
                                            <div class="displayFlexLeft">
                                                {/**
                                                    re.id === this.props.curplay ? (
                                                        <image src="../../aseets/image/aal.png" style={{ width: '36rpx' }}>
                                                            image
                                                        </image>
                                                    ) : (
                                                        <text class={this.props.toplist && idx < 3 ? 'topindex' : ''}>
                                                            {idx + 1}
                                                        </text>
                                                    )
                                                 */}
                                                <text class={this.props.toplist && idx < 3 ? 'topindex' : ''}>
                                                    {idx + 1}
                                                </text>
                                            </div>
                                            <div class="displayFlexRight">
                                                <div class="anu-col">
                                                    <div class='displayFlexRightTop'>
                                                        {re.name}
                                                        {re.alia.length && <text>（{re.alia[0]}）</text>}
                                                    </div>
                                                    <div class='displayFlexRightBottom'>
                                                        {re.ar[0].name}-{re.al.name}
                                                    </div>
                                                </div>
                                                {/**
                                                    re.mv != 0 && (
                                                        <div class="flexact">
                                                            <div class="fa_list fa_mv">
                                                                <TNavigator url="../mv/index?id={{re.mv}}">
                                                                    <image src="../../assets/image/l0.png" mode="widthFix" />
                                                                </TNavigator>
                                                            </div>
                                                        </div>
                                                    )
                                                */}
                                            </div>
                                        </div>
                                    </TNavigator>
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
