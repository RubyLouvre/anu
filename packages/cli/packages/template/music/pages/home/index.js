import React from '@react';
// import PlayList from '@components/playList/index';
import Loading from '@components/Loading/index';
import url from '../../utils/bsurl';
let bsurl = url.bsurl;
import './index.less';
import CateModal from '@components/cateModal/index';
// eslint-disable-next-line
var app = getApp();
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
            banner: [
                {
                    pic: 'https://p1.music.126.net/whUPtMMdXHLfceuFt4vNBg==/109951163537455414.jpg'
                },
                { pic: 'https://p1.music.126.net/Yd78k9-bMIRZQ96mNTlFiA==/109951163537349659.jpg' }
            ],
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
      wx.request({
          url: bsurl + 'banner',
          data: { cookie: app.globalData.cookie },
          success: function(res) {
              that.setState({
                  banner: res.data.banners
              });
          }
      });
      wx.request({
          url: bsurl + 'playlist/catlist',
          complete: function(res) {
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

  personalized() {
      let result = [];
      let arr = ['personalized', 'personalized/newsong', 'personalized/mv', 'personalized/djprogram'];
      for (let i = 0; i < arr.length; i++) {
          result[i] = new Promise((resolve) => {
              wx.request({
                  url: bsurl + arr[i],
                  data: { cookie: app.globalData.cookie },
                  success: function(res) {
                      resolve(res.data.result);
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
          wx.request({
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
          wx.request({
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
      wx.request({
          url: bsurl + 'top/playlist',
          data: {
              limit: that.state.playlist.limit,
              offset: that.state.playlist.offset,
              type: that.state.catelist.checked.name
          },
          complete: function(res) {
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
          <div>
              <div id="header" class="tab">
                  <div
                      class={'tab-item ' + (this.state.rec.idx === this.state.tabidx ? 'tbi-cur' : '')}
                      onTap={this.switchTab.bind(this, 0)}
                  >
                      <text class="tbi-text">个性推荐</text>
                  </div>
                  <div
                      class={'tab-item ' + (this.state.playlist.idx === this.state.tabidx ? 'tbi-cur' : '')}
                      onTap={this.switchTab.bind(this, 1)}
                  >
                      <text class="tbi-text">歌单</text>
                  </div>
                  <div
                      class={'tab-item ' + (this.state.djlist.idx === this.state.tabidx ? 'tbi-cur' : '')}
                      onTap={this.switchTab.bind(this, 2)}
                  >
                      <text class="tbi-text">主播电台</text>
                  </div>
                  <div
                      class={'tab-item ' + (this.state.sort.idx === this.state.tabidx ? 'tbi-cur' : '')}
                      onTap={this.switchTab.bind(this, 3)}
                  >
                      <text class="tbi-text">排行榜</text>
                  </div>
                  <navigator url="../search/index" class="tab-item" id="lastsearch">
                      <icon type="search" size="18" color="#666" />
                  </navigator>
              </div>
              <div id="main" class="page_pp">
                  {/* 个性推荐 */}
                  <div class="tab_cnt" hidden={this.state.tabidx !== 0}>
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
                                  <navigator url="../fm/index">
                                      <div class="recn_ico">
                                          <image src="../../assets/image/cm2_discover_icn_fm-ip6@2x.png" />
                                      </div>
                    私人FM
                                  </navigator>
                              </div>
                              <div>
                                  <navigator url="../recsongs/index">
                                      <div class="recn_ico">{this.state.thisday}</div>
                    每日歌曲推荐
                                  </navigator>
                              </div>
                              <div>
                                  <navigator url="../playlist/index?pid=3778678">
                                      <div class="recn_ico">
                                          <image src="../../assets/image/cm2_discover_icn_upbill-ip6@2x.png" />
                                      </div>
                    云音乐热歌榜
                                  </navigator>
                              </div>
                          </div>
                      )}
                      {/* playlist */}
                      <div class="st_title">
                          <image
                              width="30"
                              mode="widthFix"
                              src="../../assets/image/cm2_discover_icn_recmd@2x.png"
                          />
              推荐歌单
                          <div class="rbtn" bindtap="switchtab" data-t="1">
                更多>
                          </div>
                      </div>
                      {this.state.rec.loading && (
                          <div class="flex-boxlist">
                              {this.state.rec.re[0].map(function(item) {
                                  return (
                                      <div class="tl_cnt">
                                          <navigator url={`../playlist/index?pid=${item.id}&from=toplist`}>
                                              <div class="cover">
                                                  <image src={`${item.picUrl}?param=200y200`} class="music_cover" />
                                                  <div class="img_playcount">
                                                      <image src="../../assets/image/p0.png" />
                                                      {item.playCount}
                                                  </div>
                                              </div>
                                              <text class="name">{item.name}</text>
                                          </navigator>
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                      {/* newsongs */}
                      <div class="st_title">
                          <image
                              width="30"
                              mode="widthFix"
                              src="../../assets/image/cm2_discover_icn_newest@2x.png"
                          />
              最新音乐
                          <div class="rbtn" bindtap="switchtab" data-t="1">
                更多>
                          </div>
                      </div>
                      {this.state.rec.loading && (
                          <div class="flex-boxlist">
                              {this.state.rec.re[1].map(function(re, index) {
                                  return (
                                      <div class="tl_cnt" key={re.id}>
                                          {index < 6 && (
                                              <navigator
                                                  url={`../playing/index?id=${re.id}&br=${re.song.privilege.maxbr}`}
                                              >
                                                  <div class="cover">
                                                      <image
                                                          src={`${re.song.album.picUrl}?param=200y200`}
                                                          class="music_cover"
                                                      />
                                                      <text>{re.playcount}</text>
                                                  </div>
                                                  <div class="tl_info">
                                                      <div>{re.name}</div>
                                                      <div class="tli_des">{re.song.artists[0].name}</div>
                                                  </div>
                                              </navigator>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                  </div>
                  {/* 歌单 */}
                  <div class="tab_cnt" hidden={this.state.tabidx !== 1}>
                      <div class="listheader" id="plc_header">
                          {this.state.catelist.checked.name}
                          <text onTap={this.togglePtype} id="catselectbtn">
                选择分类
                          </text>
                      </div>

                      {this.state.playlist.loading && (
                          <div class="flex-boxlist flex-two">
                              {this.state.playlist.list.playlists.map(function(item) {
                                  return (
                                      <div class="tl_cnt cateplaylist" key={item.id}>
                                          <navigator url={'../playlist/index?pid=' + item.id + '&from=toplist'}>
                                              <div class="cover">
                                                  <image src={item.coverImgUrl + '?param=200y200'} class="music_cover" />
                                                  <div class="img_creator">
                                                      <image
                                                          src="../../assets/image/cm2_icn_userhead@2x.png"
                                                          style={{ width: '24rpx', height: '24rpx' }}
                                                      />
                                                      {item.creator.nickname}
                                                  </div>
                                                  <div class="img_playcount">
                                                      <image src="../../assets/image/p0.png" />
                                                      {item.playCount}
                                                  </div>
                                              </div>
                                              <span class="name">{item.name}</span>
                                          </navigator>
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                      {(!this.state.playlist.loading || this.state.playlist.list.more) && <Loading />}
                  </div>
                  {/* 主播电台 */}
                  <div class="tab_cnt" hidden={this.state.tabidx !== 2}>
                      {this.state.djcate.loading ? (
                          <div>
                              <swiper indicator-dots="true" circular="true">
                                  {[1, 2, 3].map(function() {
                                      return (
                                          <swiper-item class="djcatewrap">
                                              {this.state.djcate.categories.map(function(re) {
                                                  return (
                                                      <div bindtap="djradiotype" class="djcatelist">
                                                          <image
                                                              src={`${re.pic56x56Url}`}
                                                              class="slide-image"
                                                              width="56"
                                                              height="56"
                                                          />
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
                  <div class="tab_cnt" hidden={this.state.tabidx !== 3}>
                      {this.state.sort.loading ? (
                          <div>
                              <div class="listheader">云音乐官方榜</div>
                              <div class="flex-boxlist flex sortlist">
                                  {this.state.sort.list.map(function(item) {
                                      return (
                                          <navigator
                                              url={`../playlist/index?pid=${item.id}&from=toplist`}
                                              key={item.id}
                                          >
                                              <div class=" flexlist ">
                                                  <div class="cover flexleft fl-image">
                                                      <image class="album_cover" src={`${item.coverImgUrl}?param=200y200`} />
                                                      <text>{item.updateFrequency}</text>
                                                  </div>
                                                  <div class="flexlist tl_info">
                                                      {item.tracks.map(function(r, idx) {
                                                          return (
                                                              <div class="sort_fl_list " key={idx}>
                                                                  {idx + 1}．{r.first} - {r.second}
                                                              </div>
                                                          );
                                                      })}
                                                  </div>
                                              </div>
                                          </navigator>
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
                  class="cat-modal"
                  id="catewrap"
                  scroll-into-view="c2"
                  scroll-y="true"
                  hidden={this.state.cateisShow}
              >
                  {!this.state.cateisShow && (
                      <CateModal
                          togglePtype={this.togglePtype.bind(this)}
                          cateselect={this.cateselect}
                          catelist={this.state.catelist}
                      />
                  )}
              </scroll-view>
          </div>
      );
  }
}
export default P;
