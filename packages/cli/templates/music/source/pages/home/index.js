import React from '@react';
// import PlayList from '@componen/pages/playList/index';
import Loading from '@components/Loading/index';
import TNavigator from '@components/TNavigator/index';
import url from '../../utils/bsurl';
let bsurl = url.bsurl;
import './index.scss';
import CateModal from '@components/CateModal/index';
var app = React.getApp();
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            rec: {
                idx: 0,
                loading: false
            },
            music: {},
            playing: false,
            playtype: {},
            banner: [4],
            thisday: new Date().getDate(),
            cateisShow: true,
            playlist: {
                idx: 1,
                loading: false,
                list: {},
                offset: 0,
                limit: 20
            },
            catelist: {
                res: {},
                checked: {}
            },
            djlist: {
                idx: 2,
                loading: false,
                list: [],
                offset: 0,
                limit: 20
            },
            djcate: { loading: false },
            djrecs: {},
            sort: {
                idx: 3,
                loading: false
            },
            array123: [1,2,3],
            tabidx: 0
        };
    }
    config = {
        navigationBarTitleText: '发现音乐'
    };

    componentDidMount() {
        !this.state.rec.loading && this.init();
    }

    init() {
        let that = this;
        let rec = this.state.rec;
        //banner，
        React.api.request({
            url: bsurl + 'banner',
            data: { cookie: app.globalData && app.globalData.cookie },
            success: function(res) {
                that.setState({
                    banner: res.data.banners
                });
            }
        });
        React.api.request({
            url: bsurl + 'playlist/catlist',
            success: function(res) {
                that.setState({
                    catelist: {
                        isShow: false,
                        res: res.data,
                        checked: res.data.all
                    }
                });
            }
        });
        //个性推荐内容,歌单，新歌，mv，电台
        Promise.all(this.personalized()).then(function(result) {
            rec.loading = true;
            rec.re = result;
            that.setState({
                rec: rec
            });
        });
    }
    djradiotype(){
        console.log("djradiotype"); //eslint-disable-line
    }
    personalized() {
        let result = [];
        let arr = ['personalized', 'personalized/newsong', 'personalized/mv', 'personalized/djprogram'];
        for (let i = 0; i < arr.length; i++) {
            result[i] = new Promise((resolve, reject) => {
                React.api.request({
                    url: bsurl + arr[i],
                    data: { cookie: app.globalData && app.globalData.cookie },
                    success: function(res) {
                        resolve(res.data.result);
                    },
                    fail: function() {
                        reject('请求失败');
                    }
                });
            });
        }

        return result;
    }

    switchTab(index) {
        var that = this;
        this.setState({
            tabidx: index
        });

        if (index === 1 && !this.state.playlist.loading) {
            this.gplaylist();
        }
        if (index == 2 && !this.state.djcate.loading) {
            React.api.request({
                url: bsurl + 'djradio/catelist',
                success: function(res) {
                    var catelist = res.data;
                    catelist.loading = true;
                    that.setState({
                        djcate: catelist
                    });
                }
            });
        }

        if (index == 3 && !this.state.sort.loading) {
            this.state.sort.loading = false;
            this.setState({
                sort: this.state.sort
            });
            React.api.request({
                url: bsurl + 'toplist/detail',
                success: function(res) {
                    res.data.idx = 3;
                    res.data.loading = true;
                    that.setState({
                        sort: res.data
                    });
                }
            });
        }
    }
    gplaylist(isadd) {
        // 分类歌单列表
        var that = this;
        React.api.request({
            url: bsurl + 'top/playlist',
            data: {
                limit: that.state.playlist.limit,
                offset: that.state.playlist.offset,
                type: that.state.catelist &&this.state.catelist.checked && that.state.catelist.checked.name
            },
            success: function(res) {
                that.state.playlist.loading = true;
                if (!isadd) {
                    that.state.playlist.list = res.data;
                } else {
                    res.state.playlists = that.state.playlist.list.playlists.concat(res.data.playlists);
                    that.state.playlist.list = res.data;
                }
                that.state.playlist.offset += res.data.playlists.length;
                that.setState({
                    playlist: that.state.playlist
                });
            }
        });
    }

    togglePtype() {
        this.setState({
            cateisShow: !this.state.cateisShow
        });
    }

    cateselect() {}

    render() {
        return (
            <div class="anu-col">
                <div id="header" class="tab">
                    <div
                        class={this.state.tabidx === 0 ? 'tab-item tbi-cur' : 'tab-item'}
                        onTap={this.switchTab.bind(this, 0)}
                    >
                        <text class="tbi-text">个性推荐</text>
                    </div>
                    <div
                        class={this.state.tabidx === 1 ? 'tab-item tbi-cur' : 'tab-item'}
                        onTap={this.switchTab.bind(this, 1)}
                    >
                        <text class="tbi-text">歌单</text>
                    </div>
                    <div
                        class={this.state.tabidx === 2 ? 'tab-item tbi-cur' : 'tab-item'}
                        onTap={this.switchTab.bind(this, 2)}
                    >
                        <text class="tbi-text">主播电台</text>
                    </div>
                    <div
                        class={this.state.tabidx === 3 ? 'tab-item tbi-cur' : 'tab-item'}
                        onTap={this.switchTab.bind(this, 3)}
                    >
                        <text class="tbi-text">排行榜</text>
                    </div>
                    <div url="/pages/search/index" class="tab-item" id="lastsearch">
                        <icon type="search" size="18" color="#666" />
                    </div>
                </div>
                <div id="main" class="page_pp">
                    {/* 个性推荐 */}
                    <div class={this.state.tabidx !== 0 ? 'tab_cnt hidden' : 'tab_cnt'}>
                        <swiper indicator-dots="true" autoplay="true" circular="true">
                            {this.state.banner.map(function(item) {
                                return (
                                    <swiper-item key={item}>
                                        <image src="{{item.pic}}" class="slide-image" width="750" height="290" />
                                    </swiper-item>
                                );
                            })}
                        </swiper>
                        {!this.state.rec.loading ? (
                            <div id="album_loading">
                                <image src="../../assets/image/cm2_discover_icn_start_big@2x.png" />
                                正在为您生成个性化推荐...
                            </div>
                        ) : (
                            <div id="rec_nav">
                                <div>
                                    <TNavigator url="/pages/playlist/index">
                                        <div className="anu-col anu-center anu-middle">
                                            <div class="recn_ico">
                                                <image src="../../assets/image/cm2_discover_icn_fm-ip6@2x.png" />
                                            </div>
                                            私人FM
                                        </div>
                                    </TNavigator>
                                </div>
                                <div>
                                    <TNavigator url="/pages/playlist/index">
                                        <div className="anu-col anu-center anu-middle">
                                            <div class="recn_ico">{this.state.thisday}</div>
                                            每日歌曲推荐
                                        </div>
                                    </TNavigator>
                                </div>
                                <div>
                                    <TNavigator url="/pages/playlist/index?pid=3778678">
                                        <div className="anu-col anu-center anu-middle">
                                            <div class="recn_ico">
                                                <image src="../../assets/image/cm2_discover_icn_upbill-ip6@2x.png" />
                                            </div>
                                            云音乐热歌榜
                                        </div>
                                    </TNavigator>
                                </div>
                            </div>
                        )}
                        {/* playlist */}
                        <div class="st_title">
                            <div>
                                <image
                                    width="30"
                                    mode="widthFix"
                                    src="../../assets/image/cm2_discover_icn_recmd@2x.png"
                                />
                                <span>推荐歌单</span>
                            </div>
                            <div class="rbtn" bindtap="switchtab" data-t="1">更多></div>
                        </div>
                        {this.state.rec.loading && (
                            <div class="flex-boxlist">
                                {this.state.rec.re[0].map(function(item) {
                                    return (
                                        <div class="tl_cnt">
                                            <TNavigator url={'/pages/playlist/index?pid=' + item.id + '&from=toplist'}>
                                                <div class="anu-col">
                                                    <stack class="cover music-cover">
                                                        <image class="music_cover music-cover__image" src={item.picUrl + '?param=200y200'} />
                                                        <div class="music-cover__content">
                                                            <div class="music-cover__top play-count anu-row">
                                                                <div class="anu-grow"></div>
                                                                <image src="../../assets/image/p0.png" />
                                                                {item.playCount}
                                                            </div>
                                                        </div>
                                                    </stack>
                                                    <text class="music-info">{item.name}</text>
                                                </div>
                                            </TNavigator>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* newsongs */}
                        <div class="st_title">
                            <div>
                                <image
                                    width="30"
                                    mode="widthFix"
                                    src="../../assets/image/cm2_discover_icn_newest@2x.png"
                                />
                                <span>最新音乐</span>
                            </div>
                            <div class="rbtn" bindtap="switchtab" data-t="1">更多></div>
                        </div>
                        {this.state.rec.loading && (
                            <div class="flex-boxlist">
                                {this.state.rec.re[1].map(function(re, index) {
                                    return (
                                        <div class="tl_cnt" key={re.id}>
                                            <div className="anu-col">
                                                {index < 6 && (
                                                    <TNavigator url={'/pages/playing/index?id=' + re.id + '&br=' + re.song.privilege.maxbr}>
                                                        <div class="anu-col">
                                                            <div class="cover music-cover">
                                                                <image
                                                                    src={re.song.album.picUrl + '?param=200y200'}
                                                                    class="music_cover music-cover__image"
                                                                />
                                                            </div>
                                                            <div class="anu-col">
                                                                <text>{re.playcount}</text>
                                                                <div class="music-info anu-col">
                                                                    <div>{re.name}</div>
                                                                    <div>{re.song.artists[0].name}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TNavigator>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* 歌单 */}
                    <div class={this.state.tabidx !== 1 ? 'tab_cnt hidden' : 'tab_cnt'}>
                        <div class="st_title" id="plc_header">
                            <text>{this.state.catelist && this.state.catelist.checked && this.state.catelist.checked.name}</text>
                            <text onTap={this.togglePtype.bind(this)} id="catselectbtn">选择分类</text>
                        </div>

                        {this.state.playlist.loading && (
                            <div class="flex-boxlist">
                                {this.state.playlist.list.playlists.map(function(item) {
                                    return (
                                        <div class="tl_cnt" key={item.id}>
                                            <TNavigator url={'/pages/playlist/index?pid=' + item.id + '&from=toplist'}>
                                                <div class="anu-col">
                                                    <stack class="cover music-cover">
                                                        <image class="music_cover music-cover__image" src={item.coverImgUrl + '?param=200y200'}/>
                                                        <div class="music-cover__content">
                                                            <div class="music-cover__top play-count anu-row">
                                                                <div class="anu-grow"></div>
                                                                <image src="../../assets/image/p0.png" />
                                                                {item.playCount}
                                                            </div>
                                                            <div class="music-cover__main"></div>
                                                            <div class="music-cover__bottom play-count anu-row">
                                                                <image src="../../assets/image/cm2_icn_userhead@2x.png" />
                                                                {item.creator.nickname}
                                                            </div>
                                                        </div>
                                                    </stack>
                                                    <span class="music-info">{item.name}</span>
                                                </div>
                                            </TNavigator>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {(!this.state.playlist.loading || this.state.playlist.list.more) && <Loading />}
                    </div>
                    {/* 主播电台 */}
                    <div class={this.state.tabidx !== 2 ? 'tab_cnt hidden' : 'tab_cnt'}>
                        {this.state.djcate.loading ? (
                            <div class="broadcasting">
                                <swiper indicator-dots="true" circular="true">
                                    {this.state.array123.map(function() {
                                        return (
                                            <swiper-item class="anu-row anu-wrap">
                                                {this.state.djcate.categories.map(function(re) {
                                                    return (
                                                        <div onTap={this.djradiotype.bind(this)} class="item anu-col">
                                                            <image src={re.pic56x56Url} />
                                                            <div>{re.name}</div>
                                                        </div>
                                                    );
                                                })}
                                            </swiper-item>
                                        );
                                    })}
                                </swiper>
                            </div>
                        ) : (
                            <Loading />
                        )}
                    </div>
                    {/* 排行榜 */}
                    <div class={this.state.tabidx !== 3 ? 'tab_cnt hidden' : 'tab_cnt'}>
                        {this.state.sort.loading ? (
                            <div class="anu-col ranking">
                                <div class="listheader">云音乐官方榜</div>
                                <div class="anu-col">
                                    {this.state.sort.list.map(function(item) {
                                        return (
                                            <TNavigator url={'/pages/playlist/index?pid=' + item.id + '&from=toplist'}>
                                                <div class="anu-row">
                                                    <stack class="music-cover anu-col">
                                                        <image src={item.coverImgUrl + '?param=200y200'} class="cover__image" />
                                                        <div class="music-cover__content">
                                                            <div class="music-cover__top"></div>
                                                            <div class="music-cover__main"></div>
                                                            <div class="music-cover__bottom">
                                                                <text class="music-info">{item.updateFrequency}</text>
                                                            </div>
                                                        </div>
                                                    </stack>
                                                    <div class="music-info anu-col">
                                                        {item.tracks.map(function(r, idx) {
                                                            return (
                                                                <div key={idx}>
                                                                    <text>{idx + 1}．{r.first} - {r.second}</text>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </TNavigator>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <Loading />
                        )}
                    </div>

                </div>
                {/* 选择分类 */}
                <scroll-view
                    id="catewrap"
                    scroll-into-view="c2"
                    scroll-y="true"
                    class={this.state.cateisShow ? 'cat-modal hidden' : 'cat-modal'}
                >
                    <list-item type="catewrap-item" >

                        {!this.state.cateisShow && (
                            <CateModal
                                togglePtype={this.togglePtype.bind(this)}
                                cateselect={this.cateselect}
                                catelist={this.state.catelist}
                            />
                        )}
                    </list-item>
                </scroll-view>
            </div>
        );
    }
}
export default P;
