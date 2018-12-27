import React from '@react';
import url from '../../utils/bsurl';
let bsurl = url.bsurl;
import id2Url from '../../utils/base64md5';
import './index.scss';
import Loading from '@components/Loading/index';
import TNavigator from '@components/TNavigator/index';
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
            user: React.api.getStorageSync('user') || {},
            listLoading: true
        };
    }

    componentWillMount() {
        var that = this;
        let query = this.props.query;
        React.api.request({
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

                React.api.setNavigationBarTitle({
                    title: res.data.playlist.name
                });
            },
            fail: function() {
                React.api.navigateBack({
                    delta: 1
                });
            }
        });
    }

    render() {
        return (
            <div>
                <div class="anu-col">
                    {!this.state.listLoading && (
                        <stack id="plist-header" class="anu-col">
                            <div
                                class="blurbg"
                                style={{ backgroundImage: 'url(' + this.state.cover + ')' }}
                                id="plh-filterbg"
                            />
                            <div class="anu-col">
                                <div id="plh-main">
                                    <div id="plh-cover">
                                        <div class="anu-col">
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
                                    </div>
                                    <div id="plh-cnt" class="anu-row">
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
                                    <div class="action-item">
                                        <div class="anu-col anu-center anu-middle">
                                            <image src="../../assets/image/cm2_list_detail_icn_fav_new@2x.png" />
                                            <text>{this.state.list.playlist.subscribedCount || '收藏'}</text>
                                        </div>
                                    </div>
                                    <div class="action-item">
                                        <TNavigator url="../recommend/index">
                                            <div class="anu-col anu-center anu-middle">
                                                <image src="../../assets/image/cm2_list_detail_icn_cmt@2x.png" />
                                                <text>{this.state.list.playlist.commentCount || '评论'}</text>
                                            </div>
                                        </TNavigator>
                                    </div>
                                    <div class="action-item">
                                        <div class="anu-col anu-center anu-middle">
                                            <image src="../../assets/image/cm2_list_detail_icn_share@2x.png" />
                                            <text>{this.state.list.playlist.shareCount || '分享'}</text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </stack>
                    )}
                    <div class="plist-detail page_pp">
                        {!this.state.listLoading && this.state.list.playlist.tracks.length ? (
                            <div class="anu-col">
                                <div id="playall" bindtap="playall" class="anu-row flexlist flex-center borderBottom">
                                    <div class="flexleft flexnum">
                                        <image src="../../assets/image/pl-playall.png" mode="widthFix" />
                                    </div>
                                    <div>
                                        <text id="pa-count">
                                        播放全部{' '}
                                            <text>
                                                {' '}(共{this.state.list.playlist.trackCount}首)
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
            </div>
        );
    }
}
export default PlayList;
