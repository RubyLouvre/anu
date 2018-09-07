import React from '@react';
import url from '../../utils/bsurl';
let bsurl = url.bsurl;
import id2Url from '../../utils/base64md5';
import './index.less';
import Loading from '@components/Loading/index';
import PlayListComponent from '@components/PlayListComponent/index';
class PlayList extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            curplay: {},
            pid: 0,
            cover: '',
            music: {},
            playing: false,
            playtype: 1,
            loading: true,
            toplist: false,
            user: wx.getStorageSync('user') || {},
            listLoading: true
        };
    }

    componentWillMount() {
        var that = this;
        let query = this.props.query;
        wx.request({
            url: bsurl + 'playlist/detail',
            data: {
                id: query.pid,
                limit: 50
            },
            success: function(res) {
                var canplay = [];
                for (let i = 0; i < res.data.playlist.tracks.length; i++) {
                    if (res.data.privileges[i].st >= 0) {
                        canplay.push(res.data.playlist.tracks[i]);
                    }
                }
                that.setState({
                    list: res.data,
                    canplay: canplay,
                    toplist: query.from == 'stoplist' ? true : false,
                    cover: id2Url.id2Url(
                        '' + (res.data.playlist.coverImgId_str || res.data.playlist.coverImgId)
                    ),
                    listLoading: false
                });

                wx.setNavigationBarTitle({
                    title: res.data.playlist.name
                });
            },
            fail: function() {
                wx.navigateBack({
                    delta: 1
                });
            }
        });
    }

    render() {
        return (
            <div>
                {!this.state.listLoading && (
                    <div id="plist-header">
                        <div
                            class="blurbg"
                            style={{ backgroundImage: `url(${this.state.cover})` }}
                            id="plh-filterbg"
                        />
                        <div id="plh-main">
                            <div id="plh-cover">
                                <image class="music_cover" src={this.state.cover} />
                                <div class="img_playcount">
                                    <image
                                        src="../../assets/image/p0.png"
                                        style={{ width: '24rpx', height: '24rpx' }}
                                    />
                                    {this.state.list.playlist.playCount}
                                </div>
                                <div id="plh-playinfo" bindtap="plinfo">
                                    <image src="../../assets/image/cm2_list_detail_icn_infor@2x.png" />
                                </div>
                            </div>
                            <div id="plh-cnt">
                                <text id="music_h_name">{this.state.list.playlist.name || ' '}</text>
                                <div>
                                    <image
                                        id="user_ava"
                                        class="user_avator"
                                        src={this.state.list.playlist.creator.avatarUrl}
                                    />
                                    <text>{this.state.list.playlist.creator.nickname || ' '} </text>
                                    <image
                                        src="../../assets/image/cm2_list_detail_icn_arr@2x.png"
                                        style={{ width: '16rpx', height: '24rpx' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div id="plh_action">
                            <div>
                                <image src="../../assets/image/cm2_list_detail_icn_fav_new@2x.png" />
                                <text>{this.state.list.playlist.subscribedCount || '收藏'}</text>
                            </div>
                            <div>
                                <navigator url="../recommend/index?id={{list.playlist.commentThreadId}}&from=playlist">
                                    <image src="../../assets/image/cm2_list_detail_icn_cmt@2x.png" />
                                    <text>{this.state.list.playlist.commentCount || '评论'}</text>
                                </navigator>
                            </div>

                            <div>
                                <image src="../../assets/image/cm2_list_detail_icn_share@2x.png" />
                                <text>{this.state.list.playlist.shareCount || '分享'}</text>
                            </div>
                        </div>
                    </div>
                )}
                <div class="plist-detail page_pp">
                    {!this.state.listLoading && this.state.list.playlist.tracks.length ? (
                        <div>
                            <div id="playall" bindtap="playall" class="flexlist flex-center">
                                <div class="flexleft flexnum">
                                    <image src="../../assets/image/pl-playall.png" mode="widthFix" />
                                </div>

                                <div class="flexlist">
                                    <text id="pa-count">
                    播放全部{' '}
                                        <text>
                                            {' '}
                      (共
                                            {this.state.list.playlist.trackCount}
                      首)
                                        </text>
                                    </text>
                                </div>
                            </div>
                            <PlayListComponent
                                list={this.state.list.playlist.tracks}
                                privileges={this.state.privileges}
                                curplay={this.state.curplay}
                                toplist={this.state.toplist}
                            />
                        </div>
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        );
    }
}
export default PlayList;
