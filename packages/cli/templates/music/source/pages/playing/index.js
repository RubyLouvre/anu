import React from '@react';
import url from '../../utils/bsurl';
let bsurl = url.bsurl;
import common from '../../utils/util';
import TNavigator from '@components/TNavigator/index';
import './index.scss';
import Lrc from '@components/Lrc/index';
import Loading from '@components/Loading/index';
let app = React.getApp();

class Playing extends React.Component {
    constructor() {
        super();
        this.state = {
            playing: false,
            loading: true,
            music: {},
            playtime: '00:00',
            duration: '00:00',
            percent: 0,
            lrc: [],
            commentscount: 0,
            lrcindex: 0,
            showlrc: false,
            disable: false,
            downloadPercent: 0,
            showminfo: false,
            showpinfo: false,
            showainfo: false,
            playlist: [],
            curpl: [],
            share: {
                title: '',
                des: ''
            }
        };
    }

    playmusic(id) {
        let that = this;
        React.api.request({
            url: bsurl + 'music/detail',
            data: {
                id: id
            },
            success: function(res) {
                let curplay = res.data.songs[0];
                app.globalData && (app.globalData.curplay = curplay);
                that.setState({
                    start: 0,
                    share: {
                        id: id,
                        title: curplay.name,
                        br: res.data.privileges[0].maxbr,
                        des: (curplay.ar || curplay.artists)[0].name
                    },
                    music: curplay,
                    duration: common.formatduration(curplay.dt || curplay.duration),
                    loading: false
                });
                app.globalData && React.api.setNavigationBarTitle({ title: app.globalData.curplay.name });
                app.seekmusic(1);
                // common.loadrec(app.globalData.cookie, 0, 0, that.state.music.id, function (res) {
                //     that.setData({
                //       commentscount: res.total
                //     })
                //   })
            }
        });
    }

    componentWillMount() {
        let options = this.props.query;
        this.playmusic(options.id);
    }

    songheart() {}

    downmusic() {}

    playingtoggle() {
        common.toggleplay(this, app, function () { });
    }

    render() {
        return (
            <div style={{height: '100%', width: '100%'}}>
                {this.state.loading ? (
                    <Loading />
                ) : (
                    <div id="playingpage" class={this.state.playing ? 'playing' : ''}>
                        <stack class="anu-col">
                            <image src="../../assets/image/cm2_default_play_bg-ip6@2x.jpg" id="coverbg" />
                            <image
                                id="playing-bg"
                                class="blurbg"
                                mode="aspectFill"
                                src={this.state.music.al.picUrl || this.state.music.album.picUrl + '?param=600y600'}
                            />

                            <div class="anu-col anu-center anu-middle">

                                <div id="playing-zz" hidden={this.state.showlrc}>
                                    <image src="@assets/image/aag.png" />
                                </div>
                                <stack id="playing-main" class="anu-center anu-middle" hidden={this.state.showlrc}>
                                    <image id="playingmainbg" src="@assets/image/play.png" />
                                    <image
                                        src={this.state.music.al.picUrl || this.state.music.album.picUrl + '?param=200y200'}
                                        bindtap="loadlrc"
                                        id="pmaincover"
                                    />
                                </stack>
                                {/* 歌词 */}
                                <Lrc lrc={this.state.lrc} showlrc={this.state.showlrc} lrcindex={this.state.lrcindex} />
                                <div id="playing-actwrap">
                                    <div class="anu-col">
                                        {!this.state.showlrc && (
                                            <div id="playing-info">
                                                <div class="pi-act" onTap={this.songheart}>
                                                    {this.state.music.st ? (
                                                        <image src="../../assets/image/cm2_play_icn_loved@2x.png" />
                                                    ) : (
                                                        <image src="../../assets/image/cm2_play_icn_love@2x.png" />
                                                    )}
                                                </div>
                                                <div class="pi-act" onTap={this.downmusic}>
                                                    <image src="../../assets/image/cm2_play_icn_dld@2x.png" />
                                                </div>
                                                <div class="pi-act commentscount">
                                                    <TNavigator url={'../recommend/index?id=' + this.state.music.id + '&from=song'}>
                                                        {!this.state.commentscount ? (
                                                            <image src="../../assets/image/cm2_play_icn_cmt@2x.png" />
                                                        ) : (
                                                            <image src="../../assets/image/cm2_play_icn_cmt_num@2x.png" />
                                                        )}
                                                        <text>
                                                            {this.state.commentscount > 999 ? '999+' : this.state.commentscount}
                                                        </text>
                                                    </TNavigator>
                                                </div>
                                                <div class="pi-act" bindtap="togminfo">
                                                    <image src="../../assets/image/cm2_play_icn_more@2x.png" />
                                                </div>
                                            </div>
                                        )}
                                        <div id="playingaction">
                                            <div class="pa-saction" bindtap="playshuffle" hidden={this.state.shuffle != 1}>
                                                <image src="../../assets/image/cm2_icn_loop@2x.png" />
                                            </div>
                                            <div class="pa-saction" bindtap="playshuffle" hidden={this.state.shuffle != 2}>
                                                <image src="../../assets/image/cm2_icn_one@2x.png" />
                                            </div>
                                            <div class="pa-saction" bindtap="playshuffle" hidden={this.state.shuffle != 3}>
                                                <image src="../../assets/image/cm2_icn_shuffle@2x.png" />
                                            </div>
                                            <div class="pa-maction" data-other="-1" bindtap="playother">
                                                <image src="../../assets/image/ajh.png" />
                                            </div>
                                            {this.state.playing ? (
                                                <div class="pa-baction" onTap={this.playingtoggle} data-p="{{playing}}">
                                                    <image id="pa-pause" src="../../assets/image/ajd.png" />
                                                </div>
                                            ) : (
                                                <div class="pa-baction" onTap={this.playingtoggle} data-p="{{playing}}">
                                                    <image id="pa-playing" src="../../assets/image/ajf.png" />
                                                </div>
                                            )}
                                            <div class="pa-maction" data-other="1" bindtap="playother">
                                                <image src="../../assets/image/ajb.png" />
                                            </div>
                                            <div class="pa-saction" bindtap="togpinfo">
                                                <image src="../../assets/image/cm2_icn_list@2x.png" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </stack>
                    </div>
                )}
            </div>
        );
    }
}
export default Playing;
