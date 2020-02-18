window.ydoc_plugin_search_json = {
  "文档": [
    {
      "title": "介绍",
      "content": "自微信小程序出来后，互联网进入一个新的纪元。中国移动互联网再次三巨头切割，三大小程序加上以小米为首的快应用，割据这个大蛋糕。由于手机的容量有限，每个人不可能装太多APP ，总有一些APP大家都装，它们称之为超级APP，它们集成越来越多的功能，并且以小程序，直达号，公众号等方式收纳第三方开发的功能。它们巨大的流量红利不容小视，这就是小程序越来越火的原因。在中国移动互联网中PWA并不是前端技术的未来，因为国内最有价值的内容，例如微信订阅号、微博以及各种自媒体，还有各种短视频内容，无一例外都是私域内的东西\n小程序开始体积限制得很死，并且语法表现力非常贫乏。但长得有点像vue，因此为了便利我们的开发，出现一些以vue编写小程序的转译框架，如wepy,mpvue。但随着体积的放开，及人们对小程序的研究深入，发现其虚拟DOM机制就是模仿自React，因此用React开发小程序其实效果更佳。React的JSX 动态模板表现更强，语法提示及着色更是被各大IDE广泛支持。于是娜娜奇转译器诞生了。娜娜奇，是一处编写多处运行的小程序快应用的转译框架，提供按平台打包核心库，按平台打包缺省组件，按平台打包业务代码，按平台注入API包（以后这个会演化为按需注入平台API补丁包）的能力。快应用，国内手机商提供的内置迷你的hybird方案，小程序，BAT提供的依赖于大流量APP的寄生APP方案。核心库是指ReactWx, ReactBu, ReactAli, ReactQuick,针对不同的平台使用不同的迷你React库，娜娜奇是希望使用React强大的组件机制来突破小程序的弱模板限制。缺省组件是指其他平台都使用微信那套内置组件来构建页面，毕竟 其他平台都是抄微信的，但抄的速度没有这么快，也没有这么完整，需要我们提供一些组件来补全。按需打包业务代码是指登录支付等核心流程可能出入太大，如果使用if else会导致小程序的size过大，因此提供ANU_ENV变量实现打编译打包对应平台的代码。API包是指wx, swan, my这些对象，为小程序提供调用电池，摄像头，通信录，二维包等原生API的能力，但是它们也不统一，需要我们做兼容处理。直接访问React.api就能得到磨平后的API。接需注入API补丁包则是刚才功能的更高级形式，目的是让体积更加小。快速开始",
      "url": "/documents/intro.html",
      "children": []
    },
    {
      "title": "快速开始",
      "content": "",
      "url": "/documents/install.html",
      "children": [
        {
          "title": "前置要求",
          "url": "/documents/install.html#前置要求",
          "content": "前置要求下载并安装微信开发者工具\n本地 Node.js 版本 8.6.0 以上\n开发过程中，对文件夹及文件的命名都有一定要求，见发布打包一节\n"
        },
        {
          "title": "安装",
          "url": "/documents/install.html#安装",
          "content": "安装npmnpm install nanachi-cli -gyarnyarn global add nanachi-clinanachi init  创建工程\ncd  && npm i 安装依赖\nnanachi watch:[wx|bu|ali|quick|h5] 监听构建小程序\n用对应的小程序开发工具打开当中的dist目录，自己在source目录中进行开发\nnanachi watch:wx默认是从npm拉对应的ReactWx, ReactAli...的稳定版，一星期发布一次。如果出BUG，急紧修复，着急要最新版本，可以使用nanachi watch:wx --beta命令。\n注意：快应用下构建结束后，需要执行以下三步骤npm install    #  需要开另一个窗口, 安装快应用的hap编译器， 只需安装一次npm run build  # 与上面同一窗口, 生成dist目录\nnpm run server # 需要第三个窗口, 运行node环境，这时会出一个二维码与一个链接，保证PC的WIFI与手机的WIFI是同一个，然后用手机上的快应用调试器 扫描，就能看到效果。也可以将链接贴到chrome中，这时二维码会出现页面上，也是手机扫描，可以同时在手机与网页上看到效果，此这种方式用于调式。\n"
        },
        {
          "title": "更多便捷的命令",
          "url": "/documents/install.html#更多便捷的命令",
          "content": "更多便捷的命令nanachi page aaa # 在pages目录下创建aaa/index.js模板nanachi component Dog # 在components目录下创建Dog/index.js模板\nnanachi build:[wx|ali|bu|quick|tt|h5|360] --beta #同步最新的 React lib\nnanachi watch:[wx|ali|bu|quick|tt|h5] --beta-ui #同步最新的补丁组件\nnanachi -V #查看当前版本\n"
        },
        {
          "title": "第二种安装",
          "url": "/documents/install.html#第二种安装",
          "content": "第二种安装此方式下适用于去哪儿网内部用户，在参与开发nanachi框架的技术人员git clone git@github.com:RubyLouvre/anu.git 或git clone https://github.com/RubyLouvre/anu.git\n命令行定位到packages/cli目录下，执行npm link 如果之前装过要先npm unlink\n然后定位到外面的目录，不要在cli目录中建工程。 使用 cd ../../ && nanachi init demo 创建工程\n定位到 demo 目录下安装依赖npm i或yarn\nnanachi build 全量编译代码，build后面可跟参数， 如nanachi build:ali\nnanachi watch 增量编译代码并监听文件变化，watch后面可跟参数\n用微信开发工具打开当中的dist目录，自己在source目录中进行开发\ncd anu/packages/cli && npm i && npm linkcd ../../ && nanachi init demo\ncd demo && yarn\nnanachi watch   //或 nanachi watch:wx 或 nanachi watch:bu 或 nanachi watch:ali 或 或 nanachi watch:tt\n\n\n\n\n有远程请求的页面，需要打开右上角 “>>” 详情，  不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书 打上勾"
        },
        {
          "title": "用nanachi开发的应用的性能",
          "url": "/documents/install.html#用nanachi开发的应用的性能",
          "content": "用nanachi开发的应用的性能"
        },
        {
          "title": "快应用的安装流程",
          "url": "/documents/install.html#快应用的安装流程",
          "content": "快应用的安装流程执行以下命令：npm install -g hap-toolkit //安装快应用的hap编译器， 只需安装一次nanachi init xxx     // 初始化工程\ncd xxx && npm i      // npm i可以改成yarn， 安装nanachi的依赖\nnanachi watch:quick  // 编译代码\nnpm i                // 这是安装快应用的编译器hap的依赖，\nnpm run build        // 这是hap 的构建命令\nnpm run server  -- --watch  //或hap server --watch 这是hap 的打开远程服务，生成二维码让你用手机扫码查看编译后的app\n。快应用还没有像微信， 支付宝， 百度那样提供好用的开发者工具，想查看结果需要手机装 快应用调试器。快应用只能用于安卓。快应用调试器快应用预览版快应用的目标代码分别在src（ux文件）与dist（二进制）在编译二进制过程，可能有许多警告，因为快应用的标签不支持 data-*属性及许多HTML样式，但这不会影响结果。\n\n\n"
        },
        {
          "title": "360编译",
          "url": "/documents/install.html#360编译",
          "content": "360编译nanachi build:360 # 360编译暂不支持watch模式cd src\nnpm install && npm run serve\n打开360浏览器的小程序开发模式，新建项目，项目目录选择src目录，然后点击调试即可。"
        }
      ]
    },
    {
      "title": "如何升级",
      "content": "娜娜奇转译器正处在高速迭代的时期，不断添加更多好用的特性，支持更多的平台。因此出BUG时，可以给我们提ISSUE。我们修复后，大家如何应用新的娜娜奇版本呢？回到你之前下载的anu目录下，然后定位到packages/cli目录，再次npm i 或 yarn就行了。然后你在自己的工程，再次nanachi watch或nanachi watch:bu就是使用新的娜娜奇版本进行编译",
      "url": "/documents/update.html",
      "children": []
    },
    {
      "title": "全局对象",
      "content": "在小程序中，一个应用由多个页面组成，一个页面由多个组件组成。app.js就是用来定义全局配置对象， 全局数据对象，全局回调，全局样式及import所有页面。app.js外表上看来是一个React组件\n全局配置对象 config 配置标题栏与tab栏\n\n\n全局数据对象 globalData\n\n\n全局回调\n\nonGlobalLoad 每个页面在初次加载时就会执行此回调，注意不存在页面级别的onLoad方法\nonGlobalReady 每个页面在初次渲染后（布局完成）就会执行此回调，注意不存在页面级别的onReady方法\nonGlobalUnload 每个页面在被销毁时就会调用此方法，注意不存在页面级别的onUnload方法, 其次路由切换导致当前页面隐藏时，页面不一定销毁，只有此页面被踢出页面栈时才会销毁。页面栈一共保存10个页面. 想用页面级别的onUnload方法，可以用componentWillUnmount代替。\nonGlobalShow 每个页面在显示时就会调用此方法，页面有onShow方法时，也会同时执行此方法\nonGlobalHide 每个页面在隐藏时就会调用此方法，页面有onHide方法时，也会同时执行此方法\nonGlobalShare  只有页面组件没有定义onShare/onShareAppMessage方法，才会调用此方法，此方法要求返回对象\nonCollectLogs 所有click/tap/change/input/blur等核心的与用户行为相关的事件触发时，都会调用这个回调\nonSendLogs  onCollectLogs理应凑够一定数量的日志就会调用此方法，用于上传日\n\n\n\n全局样式 自己手动import 'app.scss'或import 'app.less'\n\n\nimport 所有以 ./pages/ 开头的依赖放到 app.json 中 pages 配置项中。\n\n\n默认我们会把 第一个./pages开头的依赖当作首页。\n\n此外，app.js还支持原生的onLaunch, onError, onShow, onHide。其中onShow, onHide不等同于onGlobalShow, onGlobalHide, 前两者是小程序从前台进入后台或从后台进入前台触发的， 后两者是页面级别的监听方法。由于快应用不支持应用级别的onShow方法，因此不要使用。在快应用下，它没有onLaunch, onHide, 娜娜奇会在自动转译成 onCreate、onDestroy方法。import React from '@react';import './pages/index/index'; //引入所有页面。\nimport './pages/demo/base/index';\nimport './pages/demo/native/index/index';\nimport './app.less';\n\nclass Global extends React.Component {\n    //全局配置\n    static config = {\n        window: {\n            backgroundTextStyle: 'light',\n            navigationBarBackgroundColor: '#0088a4',\n            navigationBarTitleText: 'mpreact',\n            navigationBarTextStyle: '#fff'\n        }\n        needRedirectPages: {\n            \"pages/bargain/helper/helper\":  \"pages/ticket/bargain/helper/index\",\n            \"pages/bargain/ticket/index\":  \"pages/ticket/bargain/list/index\",\n            \"pages/bargain/award/index\":  \"pages/ticket/bargain/award/index\"\n        },\n        tabBar: {\n            backgroundColor: '#0077c7',\n            list: [{\n              pagePath: \"pages/platform/index/index\",\n              text: \"首页\"\n            }, {\n              pagePath: \"pages/service/index/index\",\n              text: \"客服\"\n            }]\n        }\n    };\n    // 全局数据\n    globalData = {\n        ufo: 'nanachi',//only test\n        __storage: {}  //快应用的storage在这里保存一份副本,\n    };\n    onGlobalReady(){}  //全局的页面钩子\n    onGlobalUnload(){} //全局的页面钩子\n    onGlobalShow(){}   //全局的页面钩子\n    onGlobalHide(){}   //全局的页面钩子\n    onGlobalLoad(){    //全局的页面钩子\n        //快应用需要在每个页面打开的瞬间初始化同步storage API\n        //即getStorageSync, setStorageSync, removeStorageSync, clearStorageSync\n        if ( process.env.ANU_ENV === 'quick' ) {\n           React.api.initStorageSync &&\n           React.api.initStorageSync(this.globalData.__storage)\n        }\n    }\n    onGlobalShare(){   //全局的小程序分享钩子， 如果页面没有定义onShare, 或onShare没有返回对象，就会触发它\n        return {};\n    }\n    onPageNotFound(e){\n        //这里专门迁移之前的业务，比如一些广告，二维图已经印出来，贴在各大广场上，不可能再改这些二维码\n        //而二维码对应一些旧页面，现在用nanachi重写，并根据nanachi的规范，只能以index结尾\n        //随着业务的拆分，它们分到新部门（门票），为了方便分包，它们的目录结构也要改动\n        //我们可以在config中添加needRedirectPages映射\n        var [path, query] = e;\n        //在微信小程序中path不以\"/\"开头，但不保证其他小程序是以\"./\", \"/\"开头\n        path = path.replace(/^\\/,\"\"/)\n        var newPath = Global.config.needRedirectPages[path] || \"pages/platform/404/index\";\n        var queryString = Object.keys(query).map(function(k){\n          return `${k}=${query[k]}`\n        }).join(\"&\");\n        React.api.redirectTo({\n            url:path + (queryString? '?'+ queryString: '')\n        });\n    }\n    onShowMenu(pageInstance, app){} //供快应用实现右上角菜单与转发分享（onShare, onGlobalShare都在这里）\n    onCollectLogs(){}  //全局的用户行为日志收集钩子\n    onHide(){          //全局的app钩子, 当app切换后台时触发\n          var app = React.getApp()\n          console.log(app == this)//由于平台的差异性，React.getApp(）得到的对象不定是new App的实例\n    }\n    onLaunch() {     //全局的app钩子 （快应用会自动转译成onCreate）\n        if ( process.env.ANU_ENV === 'quick' ) { //非快应用的平台在编译阶段会被干掉\n            if ( this.$data && typeof global === 'object') {  //针对快应用的全局getApp补丁\n                var ref = Object.getPrototypeOf(global) || global;\n                var _this = this;\n                ref.getApp = function() {\n                    return _this;\n                };\n                this.globalData = this.$def.globalData;\n            }\n        }\n        console.log('App launched');\n    }\n}\n\nexport default App(new Global());\n",
      "url": "/documents/app.html",
      "children": [
        {
          "title": "globalData的设计",
          "url": "/documents/app.html#globaldata的设计",
          "content": "globalData的设计在我们公司，globalData会将登录信息（微信的getUserInfo, 里面有openId什么），页面的参数， 场景值全部缓存起来，这样以后大家直接访问React.getApp().globalData就能拿到，建议用户们可以模仿。//app.js   globalData = {\n        systemInfo: {},\n        // 页面渲染时间\n        _timestamp: 0,\n        // 页面留存时间\n        _staytime: 0,\n        _startimestamp: 0,\n        location: {},\n        // 外链带入渠道\n        bd_origin: '',\n        // 小程序内部渠道，路由跳转会自动替换\n        hd_origin: '',\n        scene: '',\n        logs: [] //日志， 满10条就会自动发送后台\n    };\n    onLaunch(e) {\n        this.globalData.scene = e.scene\n        if(process.env.ANU_ENV === 'quick') {\n            this.onLaunchQuick(e);\n        }\n        this.onLaunchNormal(e);\n    }\n    onHide(){\n       this.globalData._staytime = Data.now - this.globalData._startimestamp\n    }\n    async onLaunchNormal(e) {\n        // 统计总体停留时长\n        this.globalData._startimestamp = +new Date();\n        // 这里要把系统信息放到全局 方便日志收集  业务线调用时要使用util下的getSystemInfo\n        React.api.getSystemInfo({\n            success: res => {\n                this.globalData.systemInfo = res;\n            }\n        });\n    }\n    onLaunchQuick(e) {\n        //针对快应用的全局getApp补丁\n        if (this.$data && typeof global === 'object') {\n            var ref = Object.getPrototypeOf(global) || global;\n            var _this = this;\n            this.globalData = this.$def.globalData || {};\n            ref.getApp = function() {\n                return _this;\n            };\n        }\n        // 统计总体停留时长\n        this.globalData._startimestamp = +new Date();\n        React.api.getSystemInfo({\n            success: res => {\n                this.globalData.systemInfo = res;\n            }\n        });\n        // 拿openId 更新token\n        user.appLanchInfos();\n        // 获取地理位置 埋点所需 百度账号未登录会报错\n        React.api.getLocation({\n            success: (res) => {\n                this.globalData.location = {\n                    lat: res.latitude,\n                    lgt: res.longitude\n                };\n            }\n        });\n        // 将bd_origin存到全局变量内\n        const scene = this.globalData.scene;\n        if (e.query) {\n            // 缓存初始的bdo\n            this.globalData.bd_origin = e.query.bd_origin || '';\n            this.globalData.hd_origin = e.query.hd_origin || '';\n        }\n    }\n"
        },
        {
          "title": "tabBar 的使用",
          "url": "/documents/app.html#tabbar-的使用",
          "content": "tabBar 的使用\n\n属性\n类型\n必填\n默认值\n描述\n\n\n\n\ncolor\nHexColor\n是\n \ntab 上的文字默认颜色，仅支持十六进制颜色\n\n\nselectedColor\nHexColor\n是\n \ntab 上的文字选中时的颜色，仅支持十六进制颜色\n\n\nbackgroundColor\nHexColor\n是\n \ntab 的背景色，仅支持十六进制颜色\n\n\nborderStyle\nstring\n否\nblack\ntabbar 上边框的颜色， 仅支持 black / white\n\n\nlist\nArray\n是\n \ntab 的列表，详见 list 属性说明，最少 2 个、最多 5 个 tab\n\n\nposition\nstring\n否\nbottom\ntabBar 的位置，仅支持 bottom / top\n\n\ncustom\nboolean\n否\nfalse\n自定义 tabBar，见详情\n\n\n快应用不支持 position， tabBar总是在下面\ntabBar下的list也可以根据平台设置，详见这里\n"
        },
        {
          "title": "React.getApp()的使用场合",
          "url": "/documents/app.html#react.getapp的使用场合",
          "content": "React.getApp()的使用场合React.getApp()必须放在app.js 或页面组件或普通组件的生命周期钩子里面执行，不要放在全局作用域下执行快应用可以这样设置跨页面的全局数据 this.$app.$data = {a:1}其他配置项统一放在config对象中，详细配置列表参见这里"
        }
      ]
    },
    {
      "title": "页面组件与生命周期",
      "content": "一个应用是由许多页面组成，这些页面的文件名都是index.js, 它们都必须放在pages/xxx目录中。xxx为一个文件夹，里面通常有index.js, index.scss或index.less.其次， 页面组件必须是一个有状态的 React 组件， 第一行必须为import React from '@react'。再次， 页面组件必须有render方法， 并且JSX只能出现在render方法中，不能出现在其他方法里面。JSX也不能用React.createElement()代替。因此render方法的JSX会被抽取出来，编译成wxml, axml, swan等文件。有关 JSX 的注意事项可以看这里。//pages/train/index.jsimport React from '@react';\n\nclass P extends React.Component {\n  constructor() {\n    super();\n    this.state = {\n      iconSize: [20, 30, 40, 50, 60, 70],\n      text: 'this is first line\\nthis is second line'\n    };\n  }\n  static config = {\n    \"navigationBarBackgroundColor\": \"#ffffff\",\n    \"navigationBarTextStyle\": \"black\",\n    \"navigationBarTitleText\": \"微信接口功能演示\",\n    \"backgroundColor\": \"#eeeeee\",\n    \"backgroundTextStyle\": \"light\"\n  };\n\n  add() {\n    this.setState({\n      text: this.state.text + '\\nthis is new line'\n    });\n  }\n\n  remove() {\n    var textAry = this.state.text.split('\\n');\n    if (!textAry.length) return;\n    textAry.pop();\n\n    this.setState({\n      text: textAry.join('\\n')\n    });\n  }\n  static getDerivedStateFromProps(){} //React 16新钩子\n  componentWillMount() { }      //React 16 声明废弃的钩子\n  componentDidMount() {}        //React 5  的钩子\n  componentWillReceiveProps(){} //React 16 声明废弃的钩子\n  shouldComponentUpdate(){}     //React 5  的钩子\n  componentWillUpdate(){}       //React 16 声明废弃的钩子\n  componentDidUpdate(){}        //React 5  的钩子\n  componentWillUnmount(){}      //React 5  的钩子\n  onShow(){}                  //小程序页面的钩子 路由\n  onHide(){}                  //小程序页面的钩子 路由\n  onResize(){}                //小程序页面的钩子 页面大小变动\n  onShare(){}                 //小程序页面的钩子 转发\n  onPullDownRefresh(){}       //小程序页面的钩子 滚动\n  onReachBottom(){}           //小程序页面的钩子 滚动\n  onPageScroll(){}            //小程序页面的钩子 滚动\n  onTabItemTap(){}            //小程序页面的钩子 TAB点击\n  render() {\n    return (\n      \n        \n          Icon\n          \n            {this.state.iconSize.map(function(item) {\n              return ;\n            })}\n          \n        \n      \n    );\n  }\n}\n\nexport default P;\n",
      "url": "/documents/lifetimes.html",
      "children": [
        {
          "title": "页面组件的配置对象",
          "url": "/documents/lifetimes.html#页面组件的配置对象",
          "content": "页面组件的配置对象其实就是来源于微信小程序官网\n\n属性\n类型\n默认值\n描述\n\n\n\n\nnavigationBarBackgroundColor\nHexColor\n#000000\n导航栏背景颜色，如 #ff0000\n\n\nnavigationBarTextStyle\nString\nwhite\n导航栏标题颜色，仅支持 black / white\n\n\nnavigationBarTitleText\nString\n \n导航栏标题文字内容\n\n\nbackgroundColor\nHexColor\n#ffffff\n窗口的背景色\n\n\nenablePullDownRefresh\nBoolean\nfalse\n是否全局开启下拉刷新\n\n\ntabBar\nObject\nnull\n如果tabBar已定义，并且里面有list数组\n\n\n"
        },
        {
          "title": "页面组件的生命周期",
          "url": "/documents/lifetimes.html#页面组件的生命周期",
          "content": "页面组件的生命周期由于页面组件也是一个React有状态组件, 因此它拥有React15/16的所有钩子。当我们打开一个页面，页面组件会依次触发如下生命周期钩子如果对页面组件进行setState,会依次触发如下生命周期钩子componentWillMount/Update/ReceiveProps这三个钩子是 React15的旧钩子，如果定义了它们\n就不会触发React 16的新钩子getDerivedStateFromProps\n如果用户从页面1跳转到页面2，是不会触页面组件的componentWillUnmount(即onUnload),而是触发页面的onHide钩子与app.js上的onGlobalHide钩子。然后再依次触发页面2的componentWillMount，onGlobalLoad，onShow。。。页面销毁时，会先触发所有子组件的componentWillUnmount，再到页面的componentWillUnmount，最后是app.js的onGlobalUnload钩子当然，除了页面的生命周期及页面上所有子组件的生命周期，应用本身还有生命周期，实际上我们看到的生命周期触发顺序是这样的。注： 页面组件必须使用 es6 风格来引入依赖与导出自己。它的静态属性 config 会抽取出来生成对应的 JSON 配置对象，有关配置项可以看这里"
        },
        {
          "title": "页面事件",
          "url": "/documents/lifetimes.html#页面事件",
          "content": "页面事件除了生命周期钩子， 有一些页面事件，都是以onXXX命名。如果用户没有定义这些页面事件， 框架还会尝试访问app.js中的以onGlobalXXX命名的方法，作为它的后备方案。\n\n页面事件名\n全局事件名\n说明\n关系\n\n\n\n\nonShow(query)\nonGlobalShow(query)\nquery对象\n总是触发全局事件\n\n\nonHide\nonGlobalHide\n没有参数\n总是触发全局事件\n\n\n页面初次被打开\nonGlobalLoad\n没有参数\n总是触发全局事件\n\n\n页面初次渲染完\nonGlobalReady\n没有参数\n总是触发全局事件\n\n\n页面被销毁\nonGlobalUnload\n没有参数\n总是触发全局事件\n\n\nonResize\nX\n有参数, {size }\n没有全局事件\n\n\nonShare/onShareAppMessage\nonGlobalShare\n有参数, 有返回值,{from,target,webViewUrl}\n有页面就没有全局\n\n\nonPageScroll\nX\n有参数,{scrollTop}\n没有全局事件\n\n\nonReachBottom\nX\n没有参数\n没有全局事件\n\n\nonPullDownRefresh\nX\n没有参数\n没有全局事件\n\n\nonTabItemTap\nX\n有参数{index,pagePath,text}\n没有全局事件\n\n\n"
        },
        {
          "title": "页面组件的JS文件名必须为index.js的原因",
          "url": "/documents/lifetimes.html#页面组件的js文件名必须为index.js的原因",
          "content": "页面组件的JS文件名必须为index.js的原因主要是为了兼容快应用。快应用有一个manifest.json文件, 里面有一个router对象，包含所有页面\"router\": {    \"entry\": \"pages/index\",\n    \"pages\": {\n      \"pages/index\": {\n        \"component\": \"index\"\n      },\n      \"pages/demo/syntax/index\": {\n        \"component\": \"index\"\n      },\n      \"pages/demo/syntax/api\": {\n        \"component\": \"index\"\n      },\n      \"pages/demo/syntax/await\": {\n        \"component\": \"index\"\n      },\n      \"pages/demo/syntax/children\": {\n        \"component\": \"index\"\n      },\n      \"pages/demo/syntax/extend\": {\n        \"component\": \"index\"\n      },\n      \"pages/demo/syntax/if\": {\n        \"component\": \"index\"\n      }\n    }\n}\n然后我们页面切换是通过React.api.redirectTo实现function createRouter(name) {    return function (obj) {\n        var router = require('@system.router');\n        var params = {};\n        var uri = obj.url.slice(obj.url.indexOf('/pages') + 1);\n        uri = uri.replace(/\\?(.*)/, function (a, b) {\n            b.split('=').forEach(function (k, v) {\n                params[k] = v;\n            });\n            return '';\n        }).replace(/\\/index$/, '');\n        console.log(uri, \"createRouter\")\n        router[name]({\n            uri:\"/\"+ uri,\n            params: params\n        });\n    };\n}\n"
        }
      ]
    },
    {
      "title": "页面的各个功能讲解",
      "content": "在娜娜奇中，页面的许多功能是由配置对象与钩子提供。从上到下，划分成几个功能区，标题栏（titleBar）, 右上角按钮（会弹出菜单，里面包含转发，创建快捷方式到桌面，关于等功能），内容区（这是由页面组件的JSX渲染出来的），切换栏(tabBar, 切换小程序、快应用的页面)， 系统导航栏（手机系统级别，放虚拟HOME键, 返回按钮, 切换抽屉）",
      "url": "/documents/page2.html",
      "children": [
        {
          "title": "标题栏",
          "url": "/documents/page2.html#标题栏",
          "content": "标题栏class P extends React.Component{    static config = {\n        navigationBarBackgroundColor: \"#a9ea00\",\n        navigationBarTextStyle: \"back\",\n        navigationBarTitleText: \"用户中心\"\n    }\n    render(){\n        return .....\n    }\n}\n如果页面没有配置标题栏，那么它就会使用app.js中的标题栏。如果想隐藏标题栏，可以在配置对象 navigationStyle:custom， 那么它就会自动消失。在快应用要隐藏某一个页面的titleBar, 需要manifest.json中配置。但放心，娜娜奇已经帮你屏蔽掉。 \"display\": {    \"backgroundColor\": \"#ffffff\", \n    \"fullScreen\": false,\n    \"menu\": true,                         //右上角菜单\n    \"titleBar\": true,                     //app级别\n    \"titleBarBackgroundColor\": \"#000000\", //app级别\n    \"titleBarTextColor\": \"#fffff\",        //app级别\n    \"pages\": {\n      \"Hello\": {  //对应某一个页面的ID\n        \"backgroundColor\": \"#eeeeee\",\n        \"fullScreen\": true,\n        \"titleBarBackgroundColor\": \"#0000ff\",   //page级别\n        \"titleBarText\": \"Hello\",                //page级别\n        \"orientation\": \"landscape\"              //page级别\n        //  \"titleBar\": true/false\n      }\n    }\n  },\n\n\n\n与标题栏相关的配置项\n类型\n默认值\n说明\n\n\n\n\nnavigationBarBackgroundColor\nHexColor\n#000000\n导航栏背景颜色，如 #000000\n\n\nnavigationBarTextStyle\nstring\twhite\t导航栏标题颜色，仅支持 black / white\n\n\n\n\nnavigationBarTitleText\nstring\n导航栏标题文字内容\n\n\n\nnavigationStyle\nstring\ndefault\n显示标题用default，隐藏用custom，这时只保留右上角按钮\n\n\n想动态设置页面的标题栏可以使用下面APIReact.api.setNavigationBarTitle({title})\nReact.api.setNavigationBarColor({frontColor, backgroundColor})\n微信客户端 6.7.2 版本开始，navigationStyle: custom 对  组件无效webview里面的相关操作//仅支持微信小程序document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {\n    // 通过下面这个API隐藏底部导航栏\n    WeixinJSBridge.call('hideToolbar');\n});\n            \ndocument.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {\n    // 通过下面这个API显示底部导航栏\n    WeixinJSBridge.call('showToolbar');\n}）\n"
        },
        {
          "title": "右上角按钮",
          "url": "/documents/page2.html#右上角按钮",
          "content": "右上角按钮在原生微信小程序中，只要onShareAppMessage定义就会出现右上角菜单。在娜娜奇中，右上角菜单则总是存在， 并且这个钩子也改名，简化为更好记的onShare, 如果页面没有定义onShare钩子, 它就会使用app.js的全局钩子onGlobalShareclass P extends React.Component{    static config = {\n        navigationBarBackgroundColor: \"#a9ea00\",\n        navigationBarTextStyle: \"back\",\n        navigationBarTitleText: \"用户中心\"\n    }\n    onShare(){\n        return {\n            title: '预订火车票 - 去哪儿旅行',\n            imageUrl: 'https://s.aaa.com/bbb/ccc.jpg',\n            path: `xx/yy`\n        }\n    }\n    render(){\n        return .....\n    }\n}\n如果想兼容快应用， 还需要在app.js添加一个onShowMenu钩子， 详见转发分享想动态设置右上角按钮可以使用下面APIReact.api.showShareMenu() 快应用不支持\nReact.api.hideShareMenu() 快应用不支持\n隐藏微信网页右上角按钮document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {    // 通过下面这个API隐藏右上角按钮\n    WeixinJSBridge.call('hideOptionMenu');\n});\ndocument.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {\n    // 通过下面这个API显示右上角按钮\n    WeixinJSBridge.call('showOptionMenu');\n})\n"
        },
        {
          "title": "切换栏",
          "url": "/documents/page2.html#切换栏",
          "content": "切换栏这是一个非常复杂的功能，涉及众多配置项，但我们要求遵循微信的配置名。如果当前页面config没有tabBar配置对象， 那么我们就使用app.js中的tabBar配置对象。//app.jsclass Global extends React.Component {\n\tstatic config = {\n\t    window: {\n\t        backgroundTextStyle: 'light',\n\t        navigationBarTitleText: 'mpreact',\n\t\t\tnavigationBarTextStyle: 'white'\n\t    },\n\t    tabBar: {\n\t        color: '#929292',\n\t        selectedColor: '#00bcd4',\n\t        borderStyle: 'black',\n\t        backgroundColor: '#ffffff',\n\t        list: [\n\t            {\n\t                pagePath: 'pages/index/index',\n\t                iconPath: '/assets/image/homepage_normal.png',\n\t                selectedIconPath: '/assets/image/homepage_select.png',\n\t                text: '首页'\n\t            },\n\t            {\n\t                pagePath: 'pages/demo/question/index/index',\n\t                iconPath: '/assets/image/question_normal.png',\n\t                selectedIconPath: '/assets/image/question_select.png',\n\t                text: '问答社区'\n\t            },\n\t            {\n\t                pagePath: 'pages/demo/userCenter/index',\n\t                iconPath: '/assets/image/uc_normal.png',\n\t                selectedIconPath: '/assets/image/uc_select.png',\n\t                text: '我的'\n\t            }\n\t        ]\n\t    }\n\t};\n    render(){\n       return null\n    }\n\n// pages/page1/index.js 由于存在tabBar配置对象，但是list的长度为零，不会显示 tabBar\nclass P1 extends React.Component {\n    static config = { \n\t    tabBar: {\n\t        color: '#929292',\n\t        selectedColor: '#00bcd4',\n\t        borderStyle: 'black',\n\t        backgroundColor: '#ffffff',\n\t        list: []\n        }\n    }\n     render(){\n       return page1\n    }\n}\n\n\n// pages/page2/index.js 由于没有tabBar配置对象，这时此页面有tabBar,为app.js所定义的那样\nclass P2 extends React.Component {\n    static config = { \n    }\n     render(){\n       return page2\n    }\n}\n想动态设置tabBar可以使用下面APIReact.api.showTabBar()  快应用不支持\nReact.api.hideTabBar()  快应用不支持\n"
        },
        {
          "title": "系统导航栏",
          "url": "/documents/page2.html#系统导航栏",
          "content": "系统导航栏它只与快应用页面的onBackPress钩子有关。当用户点击返回实体按键、左上角返回菜单、调用返回API时触发该事件如果事件响应方法最后返回true表示不返回，自己处理业务逻辑（完毕后开发者自行调用 API 返回）；否则：不返回数据，或者返回其它数据：表示遵循系统逻辑：返回到上一页class P2 extends React.Component {    static config = { \n    }\n    onBackPress(){ \n         //让用户操作无效\n        return true\n    }\n    render(){\n       return page2\n    }\n}\n"
        }
      ]
    },
    {
      "title": "通用组件",
      "content": "通用组件必须定义在 components 目录中，里面建一个文件夹与组件名同名，下面 index.js 就是你编写组件的地方。",
      "url": "/documents/component.html",
      "children": [
        {
          "title": "组件的样板",
          "url": "/documents/component.html#组件的样板",
          "content": "组件的样板//components/Animal/index.jsimport React from '@react';\n\nclass Animal extends React.Component { //组件名必须大写开头，与目录名一样\n  constructor(props) {\n    super();\n    this.state = {\n      name: props.name,\n      age: props.age || 1\n    };\n  }\n\n  static defaultProps = {\n    age: 1,\n    name: 'animal'\n  };\n\n  static options = {\n    styleIsolation:\"apply-shared\" //微信，QQ support\n    addGlobalClass: true, //微信，QQ，百度 support\n  };\n\n  changeAge() {\n    this.setState({\n      age: ~~(Math.random() * 10)\n    });\n  }\n\n  componentDidMount() {\n    console.log('Animal componentDidMount');\n  }\n\n  componentWillReceiveProps(props) {\n    this.setState({\n      name: props.name\n    });\n  }\n\n  render() {\n    return (\n      \n        名字：\n        {this.state.name} 年龄：\n        {this.state.age} 岁\n        换一个年龄\n      \n    );\n  }\n}\n\nexport default Animal;\noptions.styleIsolation 被微信，QQ这几个小程序所支持。isolated 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响（一般情况下的默认值）；\napply-shared 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；\nshared 表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 中指定的样式也会影响页面和其他设置了 apply-shared 或 shared 的自定义组件。（这个选项在插件中不可用。）\n由于目录可能比较深，因此 nanachi 比较贴心地提供了两个默认的别名，@react 与 @components, @react 指向专门为小程序优化的 React, @components 指向开发目录下的 components 目录。JSX 只能出现在 render() 方法或无状态组件的函数体中。JSX 的所有填充数据必须带 this.props, this.state, this.context 前缀。render() 方法里不能出现 var/const/let 语句，只能出现 if 语句与三元表达式或 JSX。map() 方法调用的第一个参数最好使用匿名方法（因为这样会自动 bind this），否则它会自动添加上第二个参数 this  {this.state.iconSize.map(function(item) {\n    return ;\n  })}\n\n会变成  {this.state.iconSize.map(function(item) {\n    return ;\n  }, this)}\n\nJSX 禁止出现 instanceUid, classUid, eventUid, 这些是内部绑定事件时在编译阶段自动添加的。render方法的第一个语句只能元素节点，不能是三元表达式或if语句等表示逻辑性的东西错误的写法class Dog extends React.Component{  //....略\n  render(){\n    return this.props.xxx ? 分支1: 分支2\n  }\n}\n正确的写法class Dog extends React.Component{  //....略\n  render(){\n    return {this.props.xxx ? 分支1: 分支2}\n  }\n}\n原因是三元表达式会变成block标签，而快应用与自定义组件方式不支持顶层元素为template/block"
        }
      ]
    },
    {
      "title": "小程序组件规范",
      "content": "",
      "url": "/documents/standard.html",
      "children": [
        {
          "title": "兼容性",
          "url": "/documents/standard.html#兼容性",
          "content": "兼容性微信小程序: 6.7.2 及以上能支持分包的版本\nQQ小程序: 能支持分包的版本\n支付宝小程序： 10.1.60 能支持分包的版本\n百度小程序： 2.2.3 能支持分包的版本\n快应用：小米等厂商1030， 华为1040\n字节跳动小程序：1.6(目前它不支持分包)\n针对小程序的Size限制，挑选各小程序的客户端版本时，以最先支持分包的版本为基准线。"
        },
        {
          "title": "升级",
          "url": "/documents/standard.html#升级",
          "content": "升级如果小程序平台出现新的规范，经TC/业务线TL商议确认，对其中必须的功能，nanachi-cli需要在半个月内完成兼容。nanachi完成兼容之后，需周知业务线在半个月之内做对应的更新调整。\n需要特殊周期的业务线，需提前与所有相关团队达成一致。根据目前小程序的现状，最长不应该超过一个月。如果有紧急bug，nanachi需一天之内进行修复，并周知业务线。相关业务线需配合上线。日常升级，根据目前的情况，最短一个月升级一个版本。"
        },
        {
          "title": "目录规则",
          "url": "/documents/standard.html#目录规则",
          "content": "目录规则如果你的组件想打包到主包中，那么它应该在pages目录的同级文件夹components中\n如果你的组件想打包到分包中，那么它应该放在pages/xxxx/components中，xxxx为业务线的名字，如hotel, flight, vacation\n如果你的组件不包含JSX中，只是普通的工具方法，并且打包到主包中，那么它应该在pages目录的同级文件夹common中\n如果你的组件不包含JSX中，只是普通的工具方法，并且打包到分包中，那么它应该在pages/xxxx/common中\n"
        },
        {
          "title": "组件编写规范",
          "url": "/documents/standard.html#组件编写规范",
          "content": "组件编写规范组件本身如果是用nanachi来写，请必须引入@react  及以React方式编写（因为@react可能编译成ReactWX.js, ReactQuick.js, ReactBu.js, ReactAli.js）。下面是一个经典的组件import React from '@react';import './index.scss';\n\nclass TrainOrderFillRobFooterView extends React.Component {\n    constructor() {\n        super();\n    }\n\n    static defaultProps = {\n        footerData: {}\n    };\n\n    render() {\n        return (\n            \n                \n                    \n                        {this.props.footerData.priceDetailModalData && !this.props.footerData.priceDetailModalData.priceDetailAnimation && }\n                        \n                            \n                                \n                                    抢票成功率\n                                    {this.props.footerData.robSuccessRate ? this.props.footerData.robSuccessRate : '- -'}\n                                \n                            \n                            下一步\n                        \n                    \n                 \n            \n        );\n    }\n}\n\nexport default TrainOrderFillRobFooterView;\n如果以非nanachi编写，希望在命名上符合其他规则。\n有关组件的编写请见这里\n\n\n有关JSX的注意事项请见这里\n\n为了确保组件不应该混杂其他小程序的专有代码，我们提供了 process.env.ANU_ENV  变量用于编译时打包平台相关的逻辑。这个变量只能用于JS，不能用于JSX。详见这里"
        },
        {
          "title": "样式规范",
          "url": "/documents/standard.html#样式规范",
          "content": "样式规范为了良好地兼容快应用，小程序都必须使用flexbox布局，不要使用绝对定位与浮动。所有不支持的样式写法都会在nanachi 编译时发出警告。详见这里"
        },
        {
          "title": "文件引用规范",
          "url": "/documents/standard.html#文件引用规范",
          "content": "文件引用规范页面不能超级引用组件的样式文件。组件也产能超级引用页面的样式文件。"
        },
        {
          "title": "代码规范",
          "url": "/documents/standard.html#代码规范",
          "content": "代码规范使用驼峰命名规范\n业务线带上标识自己业务线的前缀\n符合eslint规范\n编译0 error\n"
        }
      ]
    },
    {
      "title": "使用JSX的注意事项",
      "content": "小程序的 wxml 只支持 view、text 与它的那些内置组件标签，娜娜奇可以让你直接使用 div, span, p, b, strong 等 HTML 标签。块状元素会转换成 view, 内联元素会转换为 text。你不需要管支付宝小程序支持了哪些标签，快应用支持了哪些标签，你就默认为所有平台都用微信小程序的那一套标签，我们会通过\n补丁组件等方式抹平各种小程序的差异。\n如果你使用 React 方式定义组件，那么对应的标签名必须以大写开头。在小程序中，组件不支持包含其他标签，但我们的 React 组件可以充许包含其他标签或组件。有关for循环，多重循环， if分支, 组件套组件 等用法，可以脚手架的 qunar 示例为了兼容所有平台，我们定下这些规则原来打算使用view标签的地方，请使用div,h1这些块状元素代替。\n文本必须包含在text, span, a, option, label这几种标签内\ntext标签下面不能出现text标签或span标签，span标签下面不能出现text标签或span标签\njsx的属性值里面不能出现反斜扛，不能出现模板字符串\njsx中不能出现 声明变量语句，不能出现switch语句\njsx中除了onClick这些事件外， 不能出现除map方法外的方法调用\n不要在标签内部使用纯空白或通过两边的空白撑开空间，即  111 111xxx应该改成xxx，因为在快应用下span只能出现在text标签下，不能放在div下面。\n",
      "url": "/documents/jsx.html",
      "children": [
        {
          "title": "循环中key的定义",
          "url": "/documents/jsx.html#循环中key的定义",
          "content": "循环中key的定义在react中为了提高性能，会用key复用已有节点。但微信小程序的实现不太清楚，它对于要循环的元素都不一样的情况下，使用*this值，但显然这不是符合react的使用方式。因此我们建议，如果元素是一个对象，那么你就这样使用 (title为一个字符串或\n数值字段，都不一样)，否则就不要定义key    {this.state.toolData.map(function(item) {\n        return (\n            \n                \n                {item.title}\n            \n        );\n    })}\n\n\n转译成    \n        \n            {{item.title}}\n    \n\n"
        },
        {
          "title": "文本的使用",
          "url": "/documents/jsx.html#文本的使用",
          "content": "文本的使用在要兼容快应用的情况，文本不能直接放在块状元素之下。错误的用法  我是文本\n\n正确的用法   我是文本\n   我是文本\n\n"
        },
        {
          "title": "数据填充的使用",
          "url": "/documents/jsx.html#数据填充的使用",
          "content": "数据填充的使用错误的用法{this.data.content}正确的用法， 所有数据都只能来自this.props, this.state, this.context{this.state.content}如果这是一个无状态组件，则这样用function AA(props, context){   return {context.content}\n}\n"
        },
        {
          "title": "属性值在转译后出现反斜扛的问题",
          "url": "/documents/jsx.html#属性值在转译后出现反斜扛的问题",
          "content": "属性值在转译后出现反斜扛的问题第一个div的类名同时出现双引号与单引号， 修正办法，都用单引号    \n\nspan的类名同时出现模块字符串与单引号， 修正办法，去掉模板字符串&#xe02d;swiper的duration属性出现非常复杂的字符串拼接，建议在JS里面接好，放到this.state.duration变量中    \n        {this.state.imageUrls.map(function(item, index) {\n            return (\n                \n                    \n                \n            );\n        }, this)}\n    \n\n"
        },
        {
          "title": "三元表达式的用法",
          "url": "/documents/jsx.html#三元表达式的用法",
          "content": "三元表达式的用法错误的用法render() {    return this.state.isOk ? null : Home Page;\n  }\n翻译出的XML会出现 null字样，因为{{null}} 会null +\"\" 变成\"null\"{{null}}Home Page正确的用法三元表达式与&&逻辑语句会转换为block标签，在快应用中，组件的根节点不能为block标签，因此需要包一层render() {    return { this.state.isOk ? Home Page: null }\n  }\n翻译出的XML体积还小这么多Home Page"
        },
        {
          "title": "JSX中不能出现if、switch语句或do表达式",
          "url": "/documents/jsx.html#jsx中不能出现if、switch语句或do表达式",
          "content": "JSX中不能出现if、switch语句或do表达式错误的用法render() {    return if( this.state.isOk ) {\n      return Home Page\n    } else{\n      return \"\" //null会直接输出null,最好改成空字符串\n    }\n  }\ndo表达式也不允许// https://babeljs.io/docs/en/babel-plugin-proposal-do-expressionsconst Component = props =>\n  \n    {do {\n      if(color === 'blue') { ; }\n      else if(color === 'red') { ; }\n      else if(color === 'green') { ; }\n    }}\n  \n如果真的遇上这么复杂的分支判定，可以使用三元套三元// https://babeljs.io/docs/en/babel-plugin-proposal-do-expressionsconst Component = props =>\n  \n    {   color === 'blue' ？  : (\n        color === 'red' ?   :  (\n        color === 'green' ? : \"\"\n         ))\n    }\n  \n"
        },
        {
          "title": "方法调用",
          "url": "/documents/jsx.html#方法调用",
          "content": "方法调用下面用法出错{Object.keys(this.props.list).map(function(el){   return {el}--{this.props.list[el]}\n})}\n\n{this.state.getOrderList()}\n\n"
        },
        {
          "title": "事件绑定的使用",
          "url": "/documents/jsx.html#事件绑定的使用",
          "content": "事件绑定的使用错误的用法点我正确的用法， 事件必须直接以this开头，来源于实例点我"
        },
        {
          "title": "map方法必须将this往里面传递, map的第一个参数不要用箭头函数",
          "url": "/documents/jsx.html#map方法必须将this往里面传递,-map的第一个参数不要用箭头函数",
          "content": "map方法必须将this往里面传递, map的第一个参数不要用箭头函数{this.state.list.map(function(el, index){\n   return {el.name}\n},this)\n}\n"
        },
        {
          "title": "render的使用",
          "url": "/documents/jsx.html#render的使用",
          "content": "render的使用错误的用法class A extends React.Component{  render(){\n    var a = this.props\n    return {a.content}\n  }\n}\n正确的用法class A extends React.Component{  render(){\n    return {this.props.content}\n  }\n}\n在早期的百度小程序中s-for指令不支持数组字面量，1.14.13已经修复class A extends React.Component{  render(){\n    return { \n       [111,222,333].map(function(el){\n          return {el}\n       })\n    }\n  }\n}\n"
        }
      ]
    },
    {
      "title": "使用CSS的注意事项",
      "content": "因为快应用以flexbox布局为主，因此建议使用flexbox布局；不要用浮动定位；可以用绝对定位和相对定位（1040以上版本才支持的），但不支持z-index\n",
      "url": "/documents/style.html",
      "children": [
        {
          "title": "注意点",
          "url": "/documents/style.html#注意点",
          "content": "注意点"
        },
        {
          "title": "样式的继承",
          "url": "/documents/style.html#注意点-样式的继承",
          "content": "样式的继承快应用的样式的继承和 H5 类似，不过需要注意的是在快应用中其基本容器（div）所支持的样式及其有限（见上表）。例如字体相关的样式只有 ，  和  等组件支持并且它们都不支持  这样的块级子组件，所以对于字体的样式来说没法像 H5 那样自由的继承。为了支持快应用下, pages目录下的样式表，不能@import pages目录下的其他样式表，也不能@import components目录下的样式表， 只能引用assets目录下的样式表。components目录下的样式也是如此，想共享一些已有的样式，也能引用assets目录下的样式表，不要引用其他组件的样式表。"
        },
        {
          "title": "组件出现在伸缩盒项目位置时的处理",
          "url": "/documents/style.html#注意点-组件出现在伸缩盒项目位置时的处理",
          "content": "组件出现在伸缩盒项目位置时的处理错误的写法      xxx\n    \n  \n正确的写法      xxx\n    \n      \n    \n  \n"
        },
        {
          "title": "标签选择器要谨慎避开小程序专有的标签",
          "url": "/documents/style.html#注意点-标签选择器要谨慎避开小程序专有的标签",
          "content": "标签选择器要谨慎避开小程序专有的标签为了兼容所有平台，尽量避免在CSS样式表中使用 只有小程序 才有的标签，如image, switch, scroller, scroll-div...这些在小程序特有的标签可能会编译成div或view标签，导致样式失效。"
        },
        {
          "title": "垂直和水平居中",
          "url": "/documents/style.html#注意点-垂直和水平居中",
          "content": "垂直和水平居中由于在快应用中元素组件默认使用横向 flex 布局，因此居中可以很方便的使用 justify-content: center 和 align-items: center 来实现主轴和交叉轴方向上的居中。"
        },
        {
          "title": "单位的转换问题",
          "url": "/documents/style.html#注意点-单位的转换问题",
          "content": "单位的转换问题有的平台支持px与rpx，有的只支持px。但如果你不想转换px，你需要将px改成PX;text标签的line-height 不能写line-height: 1; 快应用会自动加px 只能写 line-height: 52px; 这样 最近小米快应用本体可能有更新 导致之前样式ok的会挂 大家注意改下"
        },
        {
          "title": "flex 元素的宽度问题",
          "url": "/documents/style.html#注意点-flex-元素的宽度问题",
          "content": "flex 元素的宽度问题当 flex 元素为垂直方向时（ flex-direction: column），其宽度并不会默认占满父元素的宽度，有些情况下你需要设置 width: 100% 来然他满父元素的宽度：  \n    \n      \n      \n    \n  \n\n\n\n  .row, .col {\n    display: flex;\n  }\n  .row {\n    border: 1px solid black;\n    flex-direction: row;\n  }\n  .col {\n    width: 100%;\n    border: 1px solid red;\n    flex-direction: column;\n  }\n  .item {\n    border: 1px solid blue;\n    height: 300px;\n  }\n\n"
        },
        {
          "title": "样式表",
          "url": "/documents/style.html#样式表",
          "content": "样式表\n\n名称\n类型\n默认值\n描述\n\n\n\n\nwidth\n | \n-\n未设置时使用组件自身内容需要的宽度\n\n\nheight\n | \n-\n未设置时使用组件自身内容需要的高度\n\n\npadding\n\n0\n简写属性，在一个声明中设置所有的内边距属性，该属性可以有1到4个值\n\n\npadding-[left|top|right|bottom]\n\n0\n\n\n\nmargin\n\n0\n简写属性，在一个声明中设置所有的外边距属性，该属性可以有1到4个值\n\n\nmargin-[left|top|right|bottom]\n\n0\n\n\n\nborder\n-\n0\n简写属性，在一个声明中设置所有的边框属性，可以按顺序设置属性width style color，不设置的值为默认值\n\n\nborder-style\ndotted | dashed | solid\nsolid\n暂时仅支持1个值，为元素的所有边框设置样式\n\n\nborder-width\n\n0\n简写属性，在一个声明中设置元素的所有边框宽度，或者单独为各边边框设置宽度\n\n\nborder-[left|top|right|bottom]-width\n\n0\n\n\n\nborder-color\n\nblack\n简写属性，在一个声明中设置元素的所有边框颜色，或者单独为各边边框设置颜色\n\n\nborder-[left|top|right|bottom]-color\n\nblack\n\n\n\nborder-radius\n\n0\n圆角时只使用border-width，border-[left|top|right|bottom]-width无效圆角时只使用border-color，border-[left|top|right|bottom]-color无效\n\n\nborder-[top|bottom]-[left|right]-radius\n\n0\n\n\n\nbackground\n\n-\n支持 渐变样式，暂时不能与background-color、background-image同时使用\n\n\nbackground-color\n\n-\n\n\n\nbackground-image\n\n-\n暂时不支持与background-color，border-color同时使用；不支持网络图片资源，请使用本地图片资源；1010+版本支持9-patch图，详情见背景图样式\n\n\nbackground-size 1000+\ncontain | cover | auto |  | \n100% 100%\n设置背景图片大小，详情见背景图样式\n\n\nbackground-repeat 1000+\nrepeat | repeat-x | repeat-y | no-repeat\nrepeat\n设置是否及如何重复绘制背景图像，详情见背景图样式\n\n\nbackground-position 1010+\n || left | right | top | bottom | center\n0px 0px\n描述了背景图片在容器中绘制的位置，支持1-4个参数，详情见背景图样式\n\n\nopacity\n\n0xff\n\n\n\ndisplay\nflex | none\nflex\n\n\n\nvisibility\nvisible | hidden\nvisible\n\n\n\nflex\n\n-\n父容器为、、时生效\n\n\nflex-grow\n\n0\n父容器为、时生效\n\n\nflex-shrink\n\n1\n父容器为、时生效\n\n\nflex-basis\n\n-1\n父容器为、时生效\n\n\nposition\nnone | fixed\nnone\n父容器为、时不生效\n\n\n[left|top|right|bottom]\n\n-\n-\n\n\n"
        },
        {
          "title": "示例",
          "url": "/documents/style.html#示例",
          "content": "示例"
        },
        {
          "title": "左中右分栏",
          "url": "/documents/style.html#示例-左中右分栏",
          "content": "左中右分栏  \n    \n    \n    \n  \n\n\n\n  .main {\n    display: flex;\n    flex-direction: row;\n  }\n  .cell {\n    flex: 1;\n    height: 200px;\n    background-color: rgb(78, 192, 245);\n    border: 2px solid #444;\n  }\n\n"
        },
        {
          "title": "上中下分栏",
          "url": "/documents/style.html#示例-上中下分栏",
          "content": "上中下分栏  \n    \n    \n    \n  \n\n\n\n  .main {\n    display: flex;\n    flex-direction: column;\n    height: 600px;\n  }\n  .cell {\n    flex: 1;\n    background-color: rgb(78, 192, 245);\n    border: 2px solid #444;\n  }\n\n"
        },
        {
          "title": "格子",
          "url": "/documents/style.html#示例-格子",
          "content": "格子  \n    \n    \n    \n    \n    \n    \n    \n    \n    \n  \n\n\n\n  .main {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n  }\n  .cell {\n    width: 33.333%;\n    height: 200px;\n    background-color: rgb(78, 192, 245);\n    border: 2px solid #444;\n  }\n\n"
        },
        {
          "title": "图片里面有文字",
          "url": "/documents/style.html#示例-图片里面有文字",
          "content": "图片里面有文字  \n    \n    Hero\n  \n\n\n\n  .stack {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n  }\n  .stack__cover, .stack__content {\n    height: 300px;\n  }\n  .stack__cover {\n    width: 100%;\n\n  }\n  .stack__content {\n    margin: -300px 0 0 0;\n  }\n  .text {\n    color: red;\n    font-size: 80px;\n    font-weight: bold;\n  }\n\n由于快应用不支持 absolute 布局。对于图片里面有文字的这种堆叠样式可以使用负的 margin 或者背景图片来布局，不过需要注意的是快应用的背景图片暂时不支持网络资源。上面就是一个负 margin 的实现，我们可以抽取出其中可复用的样式，把它变成一个 scss mixin：@mixin stack($height) {  display: flex;\n  flex-direction: column;\n  .stack__cover, .stack__content {\n    height: $height;\n  }\n  .stack__cover {\n    width: 100%;\n\n  }\n  .stack__content {\n    margin: -$height 0 0 0;\n  }\n}\n然后上面的样式就可以写成这样：  .stack {    align-items: center;\n    @include stack(300px);\n  }\n  .text {\n    color: red;\n    font-size: 80px;\n    font-weight: bold;\n  }\n"
        }
      ]
    },
    {
      "title": "React Hooks的支持",
      "content": "从nanachi 1.2.3开始，我们引入对React Hooks的支持。所谓React Hooks，就是在无状态组件的方法体里面添加几个内置方法，实现只有原有状态组件才能实现的功能。自更新能力（setState，使用useState，它会返回一个数组，一个是新数据，一个是更新数据的方法），\n访问context(使用useContext)，\n使用更高级的setState设置（useReducer）\n更新完的回调（useEffect）\nsetState的升级版， useCallback\nuseMemo，取得上次缓存的数据，它可以说是useCallback的另一种形式。\n目前就支持这6种，其他三种或与ref有关，或与渲染时期有关，对小程序没有什么意思就不支持了。在开始之前，我们还需要深入理解一下的无状态组件。 有的无状态组件是会返回text, div这些构建界面的标签，它们应该放到components目录下，有的无状态组件则直接返回另一个组件或props.children，那么应该放到common目录下，比如或var ThemeContext = React.createContext(); 注意：由于小\b程序的语法限制，无法实现props render, 因此也无法使用Context.Consumer，你只能用useContext或static contextType下面是一个简单的例子：我们用nanachi建立一个hello world模块（最后那个），改写pages/index/index.jsimport React from '@react';import {GlobalTheme} from '@common/GlobalTheme/index';\nimport Layout from '@components/Layout/index';\nimport AnotherComponent from '@components/AnotherComponent/index';\nimport './index.scss';\nclass P extends React.Component {\n    props = {\n        anyVar: {color:'red'}\n    }\n    componentDidMount() {\n        // eslint-disable-next-line\n        console.log('page did mount!');\n    }\n    render() {\n        return  \n                 \n                   \n                       \n                   \n                \n                \n    }\n}\n\nexport default P;\n\ncommon/GlobalTheme/index.js// eslint-disable-next-lineimport React from '@react';\n\nexport const GlobalTheme = React.createContext();//它要表示为一个组件，因此必须 大写开头\ncomponents/AnotherComponent/index// eslint-disable-next-lineimport React from '@react';\n\nexport default function AnotherComponent(){//它要表示为一个组件，因此必须 大写开头\n   console.log(\"AnotherComponent init\" )  //debug\n    return  Foo ;\n  };\ncomponents/Layout/indeximport React from '@react';import {GlobalTheme} from '@common/GlobalTheme/index';\nexport default function Layout (props) {\n    const globalStyle = React.useContext(GlobalTheme);\n    console.log(\"Layout init\",globalStyle ) //debug\n    return {props.children};\n};\n\n",
      "url": "/documents/hooks.html",
      "children": []
    },
    {
      "title": "开发目录结构与输出目录指定",
      "content": "在开始之前，提一下两种重要的概念。带JSX的页面组件与通用组件，它们分别放在pages与components目录下，它们具有巨大的转换成本（毕竟JSX会被提取出来转换成wxml, axml, swan或ux文件），还有一种不带JSX的纯JS文件，建议放在common目录,  当然还有一些通用的东西可以通过npm安装，但不要使用那些有JSX的第三方依赖。静态资图（图片，iconfont, 样式文件）放在assets目录。开发目录如下src   |--components\n   |    |--HotelDialog     // 这里的组件是不打算分包，会全部打入主包中\n   |    |     └──index.js  //必须以index.js命名，里面的类名 必须 与文件夹名一样, 如HotelDialog\n   |    |--HotelXXX\n   |    |--FlightYYY\n   |    └── ...\n   |--assets \n   |    |--style\n   |--common\n   |    |--hotel\n   |    |--flight\n   |    |--holiday\n   |    |--strategy\n   |    └── ...\n   |--pages\n   |    |--hotel\n   |    |--flight\n   |    |--holiday\n   |    |--strategy\n   |    └── ...\n   |--app.js\n   |--sign \n   |--wxConfig.json\n   |--qqConfig.json\n   |--quickConfig.json\n   |--aliConfig.json\n   |--buConfig.json\ncomponents目录下为了扁平化管理，以事业部为前缀+组件名的方式定义组子目录，目录下面就是index.js, index.scss或index.less。index.js里面必须是React组件，需要显式引入｀import React from \"@react\"`components目录下不要使用Fragments来命名子目录，这留给系统用。\npages目录下每个事业部各建一个目录，以事业部的名字命名，里面结构为了分包需要，也包含自己的components,common, assets, index目录，及其他页面的目录。source中的sign目录是快应用的签名目录，在发布时拷贝到外面页面目录应该只包含index.js与index.css(也可以改成index.less, index.scss). 注意，必须用index命名，并且里面必须是有状态的React组件（转译器会转换成页面组件。）页面的index.js各种引入通用组件与common目录的依赖   |--pages   |    |--hotel\n            |--index\n            |    └──index.js //当前频道的首页, 最好统一叫index\n            |--page1         //page1目录下只能存在**2**个以index命名的文件，一个是js，一个是样式\n            |    |---index.js\n            |    └── index.scss\n            |--page2\n            |    |---index.js\n            |    └── index.scss\n            |--page3\n            |    |---index.js\n            |    └── index.scss\n            |--about\n            |    |---index.js\n            |    └── index.scss\n            └──-components //这里的组件要分包，会全部打入hotel分包中\n                |--HotelDialog\n                |     └──index.js  \n                |--HotelXXX\n                |--HotelYYY\n                └── ...\ncommon目录下每个事业部各建一个目录，以事件部的名字命名，里面为各种JS文件，它们只是纯业务逻辑，没有JSX，只会经过es67的语法糖转换。source/app.js会引入pages每个事件的index.js, 只要稍微分析就得到整个应用全部有效的页面，放到app.json的pages数组中，或快应用的manifest.json的router对象的pages对象中共享数据的处理， 大家都在globalData对象中放一些命名空间对象. globalData不能放函数。大家不要放在其他全局对象上，因此在快应用等个别小程序中，页面跳转时，会清空掉除globalData之外的数据与变量。qqConfig.json , wxConfig.json这些平台特有的配置项{    globalData: {\n        flight: {\n            xxx:111,222:444\n        },\n        hotel: {\n\n        }\n    }\n}\n",
      "url": "/documents/publish.html",
      "children": [
        {
          "title": "自定义输出目录",
          "url": "/documents/publish.html#自定义输出目录",
          "content": "自定义输出目录nanachi 默认打包目录是dist, 可以在package.json中自定义配置 buildDir 来定义打包目录。{    \"nanachi\": {\n        \"alias\": {\n            \"@style\": \"source/assets/style\"\n        },\n        \"buildDir\": \"yourDir\"\n    }\n}\n"
        },
        {
          "title": "压缩打包",
          "url": "/documents/publish.html#压缩打包",
          "content": "压缩打包执行 nanachi build -c 会将项目中css, js进行压缩。"
        }
      ]
    },
    {
      "title": "按平台打包代码或样式",
      "content": "很多场景下可能需要差异化打包不同平台的代码，娜娜奇提供环境变量process.env.ANU_ENV来识别不同平台。在编译前，ANU_ENV变量已静默配置。componentDidMount(){    let ANU_ENV = process.env.ANU_ENV;//wx ali bu quick h5 360\n    if(ANU_ENV === 'wx'){\n        //微信小程序业务逻辑\n    }else if(ANU_ENV === 'ali'){\n        //支付宝小程序业务逻辑\n    }else {\n        \n    }\n}\n又如我们在微信小程序要获取用户信息， 需要这样实现 this.state = {     isWx: process.env.ANU_ENV == 'wx'\n }\n{ this.state.isWx && }\n有时候需要按平台引入相关模块，在写法上有所不同，必须通过注释节点来匹配相关的import引入。例如:// if process.env.ANU_ENV == 'wx';import wx from './wx.js';\n// if process.env.ANU_ENV == 'ali';\nimport ali from './ali.js';\n// if process.env.ANU_ENV == 'wx';\nimport 'wx_specific.css'\n编译结果(ANU_ENV:wx):import wx from './wx.js';",
      "url": "/documents/import_js.html",
      "children": []
    },
    {
      "title": "",
      "content": "",
      "url": "/documents/tabBar.html",
      "children": [
        {
          "title": "据平台设置tabBar",
          "url": "/documents/tabBar.html#据平台设置tabbar",
          "content": "据平台设置tabBartabBar是小程序、快应用下面可能出现的按钮列表，用于快速回到首页或某一重要页面。默认是使用tabBar.list数组class Global extends React.Component {   static config = {\n\t    window: {\n\t        backgroundTextStyle: 'light',\n\t        // navigationBarBackgroundColor: '#0088a4',\n\t        navigationBarTitleText: 'mpreact',\n\t        navigationBarTextStyle: '#fff'\n\t    },\n\t    tabBar: {\n\t        color: '#929292',\n\t        selectedColor: '#00bcd4',\n\t        borderStyle: 'black',\n\t        backgroundColor: '#ffffff',\n\t        list: [ /*略*/]\n        }\n   }\n   render(){\n       //略\n   }\n}\nexport default App(new Global());\n如果你想在快应用下，list的内容有点不一样，那么你可以添加一个quickList. 在转译阶段，会用quickList覆盖list, 并把quickList删掉。同理，你可以添加wxList, buList, ttList进行不同的设置。class Global extends React.Component {   static config = {\n\t    window: {\n\t        backgroundTextStyle: 'light',\n\t        // navigationBarBackgroundColor: '#0088a4',\n\t        navigationBarTitleText: 'mpreact',\n\t        navigationBarTextStyle: '#fff'\n\t    },\n\t    tabBar: {\n\t        color: '#929292',\n\t        selectedColor: '#00bcd4',\n\t        borderStyle: 'black',\n\t        backgroundColor: '#ffffff',\n\t        list: [ /*略*/],\n            buList:  [ /*略*/],\n            quickList:  [ /*略*/],\n            aliList:  [ /*略*/]\n        }\n   }\n   render(){\n       //略\n   }\n}\nexport default App(new Global());\n"
        }
      ]
    },
    {
      "title": "隐藏标题栏",
      "content": "标题栏又叫titleBar, navigationBar, 在webview或某些特殊场合下，我们想隐藏它我们只要设置成空字符就行了（注意，如果不设置会统一使用app.js的标题）class P extends React.Component{    static config = {\n        navigationBarTitleText: \"\"\n    }\n    render(){\n        return 隐藏标题栏\n    }\n}\n",
      "url": "/documents/titleBar.html",
      "children": []
    },
    {
      "title": "Redux与Mobx的支持",
      "content": "想使用Redux与Mobx，我们需要对app.js添加render方法，返回Provider组件就行了。这样全局就可以共用一个store。其他想用store数据的页面，则需要通过装修器或connect方法，将原来的页面类或组件类包裹成高阶组件export 出来。具体可通过nanachi init命令初始化相应模板，查看Redux、Mobx示例代码",
      "url": "/documents/redux.html",
      "children": [
        {
          "title": "Redux",
          "url": "/documents/redux.html#redux",
          "content": "Redux"
        },
        {
          "title": "App组件处理",
          "url": "/documents/redux.html#redux-app组件处理",
          "content": "App组件处理app.js由于不支持jsx语法，我们需要用React.createElement来创建对应的组件import React from '@react';import { Provider } from 'react-redux';\nimport { createStore } from 'redux';\n\n//--------[begin]------------\n//这部分代码可以独立到一个store.js\nconst reducer = function (state, action) {\n    switch(action.type) {\n        case 'ADD': \n            return {\n                ...state,\n                value: state.value + 1\n            };\n        case 'MINUS': \n            return {\n                ...state,\n                value: state.value - 1\n            };\n        case 'CHANGE': \n            return {\n                ...state,\n                inputVal: action.payload\n            };\n        default:\n            return state;\n    }\n}\n\nconst initState = {\n    value: 12,\n    inputVal: 100\n}\nconst store = new createStore(reducer, initState);\n//------------[end]--------------\nclass Global extends React.Component {\n    globalData = {\n        _GlobalApp: typeof Provider === 'function' ? Global: null //重点, \n    }\n    static config = {\n        window: {\n            navigationBarBackgroundColor: '#00afc7',\n            backgroundTextStyle: 'light',\n            backgroundColor: '#00afc7',\n            navigationBarTitleText: 'nanachi',\n            navigationBarTextStyle: 'white'\n        }\n    };\n    onLaunch() {\n        //针对快应用的全局getApp补丁\n        if (this.$data && typeof global === 'object') {\n            var ref = Object.getPrototypeOf(global) || global;\n            var _this = this;\n            this.globalData = this.$def.globalData;\n            ref.getApp = function() {\n                return _this;\n            };\n        }\n        console.log('App launched');//eslint-disable-line\n    }\n\n}\nif(typeof Provider === 'function'){\n    // 正常nanachi项目app中不需要render，如需使用状态库Provider，需要添加render方法 \n    Global.prototype.render = function() {\n      //  var {store} = React.getApp().globalData\n        return React.createElement(Provider, {store: store}, this.props.children )\n    }\n}\n\nexport default App(new Global());\nglobalData._GlobalApp非常重要，它对应的ReactWX里面的源码   let GlobalApp;   function _getGlobalApp(app) {\n       return GlobalApp || app.globalData._GlobalApp;\n    }\n    let GlobalApp = _getGlobalApp(app);\n    app.$$pageIsReady = false; //pageIsReadyg与delayMounts是专门给快应用\n    app.$$page = this;\n    app.$$pagePath = path;\n    var dom = PageClass.container;\n    var pageInstance;\n    if (typeof GlobalApp === \"function\") {//拿到app.js的Global类，目的是注入store\n        this.needReRender = true;\n        render(\n            createElement(\n                GlobalApp,\n                {},\n                createElement(PageClass, {\n                    path: path,\n                    key: path,\n                    query: query,\n                    isPageComponent: true\n                })\n            ),\n            dom,\n            function() {\n                var fiber = get(this).child;\n                while (!fiber.stateNode.classUid) {\n                    fiber = fiber.child;\n                }\n                pageInstance = fiber.stateNode;\n            }\n        );\n    } else {\n        pageInstance = render(\n            //生成页面的React对象\n            createElement(PageClass, {\n                path: path,\n                query: query,\n                isPageComponent: true\n            }),\n            dom\n        );\n    }\n    \n"
        },
        {
          "title": "Pages/Components组件处理",
          "url": "/documents/redux.html#redux-pagescomponents组件处理",
          "content": "Pages/Components组件处理页面、组件的写法与原生redux基本一致，需要注意不要将connect语句写到export default中，而是要在export default之前调用。import React, {Component} from '@react';import { connect } from 'react-redux';\n\nconst mapStateToProps = function (state) {\n    return {\n        value: state.value\n    }\n}\n\nconst mapDispatchToProps = function (dispatch) {\n    return {\n        add: function() {\n            dispatch({\n                type: 'ADD'\n            });\n        },\n        minus: function() {\n            dispatch({\n                type: 'MINUS'\n            });\n        }\n    }\n}\n\nclass P extends Component {\n    render() {\n        return (\n                {this.props.value}\n                 {this.props.add()}}>+\n                 {this.props.minus()}}>-\n        \n        );\n    }\n}\n\n// connect需要写到export default语句前包裹页面。\nP = connect(mapStateToProps, mapDispatchToProps)(P);\n\nexport default P;\n"
        },
        {
          "title": "Mobx",
          "url": "/documents/redux.html#mobx",
          "content": "Mobx"
        },
        {
          "title": "App组件处理",
          "url": "/documents/redux.html#mobx-app组件处理",
          "content": "App组件处理与redux处理方式相同import React from '@react';import { Provider } from 'mobx-react';\nimport Store from './store/index';\nimport './pages/index/index';\n\nconst store = new Store();\n\nclass Global extends React.Component {\n    globalData = {}\n    static config = {\n        window: {\n            navigationBarBackgroundColor: '#00afc7',\n            backgroundTextStyle: 'light',\n            backgroundColor: '#00afc7',\n            navigationBarTitleText: 'nanachi',\n            navigationBarTextStyle: 'white'\n        }\n    };\n    onLaunch() {\n        //针对快应用的全局getApp补丁\n        if (this.$data && typeof global === 'object') {\n            var ref = Object.getPrototypeOf(global) || global;\n            var _this = this;\n            this.globalData = this.$def.globalData;\n            ref.getApp = function() {\n                return _this;\n            };\n        }\n        console.log('App launched');//eslint-disable-line\n    }\n    render() {\n        return React.createElement(Provider, {store: store}, this.props.children )\n    }\n}\n// eslint-disable-next-line\nexport default App(new Global());\n\n"
        },
        {
          "title": "Pages/Components组件处理",
          "url": "/documents/redux.html#mobx-pagescomponents组件处理",
          "content": "Pages/Components组件处理与传统mobx装饰器写法一致注意必须使用inject方法\nimport React, {Component} from '@react';import { observer, inject } from 'mobx-react';\n\n@inject(\n    state => ({\n        num: state.store.num,\n        add: state.store.add,\n        minus: state.store.minus\n    })\n)\n@observer\nclass P extends Component {\n    render() {\n        return (\n                {this.props.num}\n                 {this.props.add()}}>+\n                 {this.props.minus()}}>-\n        \n        );\n    }\n}\n\nexport default P;\n在百度小程序中，如果你使用mobx可能会报一堆错误,说找不到react, react-dom，\n那么我们需要在工程的node_modules下建立一个react, react-dom目录，里面只有index.js，内容为ReactBu的代码\n或者使用以下方式： https://zhuanlan.zhihu.com/p/90015927\n![./redux.png]"
        }
      ]
    },
    {
      "title": "智能webview化",
      "content": "有一些场合，我们不得不使用webview. 虽说webview有很多缺点，比如它都是远程加载的，没有直接停驻于被寄生的APP上，导致页面加载慢，一些高级的APP特性用不了，需要跳转到小程序才能支付云云。但webview也有一个重要的不可忽视的优势，开发简单——就是我们熟悉的HTML开发。",
      "url": "/documents/webview.html",
      "children": [
        {
          "title": "webview的使用场合",
          "url": "/documents/webview.html#webview的使用场合",
          "content": "webview的使用场合CSS兼容难度大，一些样式不支持需要调整，尤其是快应用，没有display:block/inline, position:absolute/relative, float:left/right,  只能用flexbox布局。这需要小公司来说，大大提高研发成本。\n小程序/快应用的size问题， 尤其是快应用只有1MB大小，很容易超出大小，而webview加载的页面不计入它的size.\n特定平台的限制问题，比如说支付宝不能使用video标签，你想做直播类，需要特殊申请，并必须用优酷上传视频，这时就可以将这个页面变成webview.\n"
        },
        {
          "title": "使用",
          "url": "/documents/webview.html#使用",
          "content": "使用在对应频道的页面对象的 config 添加一个参数。其中 pages 字段可能存在两种类型值，数组和布尔值。当为数组时，数组中的各项为 webview 化的页面路径。nanachi 会将这些路径编译成 webview。当为布尔值，且值为 true 时，nanachi 将这个页面所在文件夹（频道）的所有页面及子页面都 webview 化。class Demo extends React.Component {    static config = {\n        webview: {\n            quick: {\n                pages: true,  \n                showTitleBar: false, //是否隐藏快应用的 titlebar\n                allowthirdpartycookies: false,\n                trustedurl: []\n            }\n        }\n    }\n}\n频道就是 pages下面的某个文件夹的意思\n既然是智能 webview 化，之前页面跳转的路径也会自动变成访问 H5 的 URL。需要注意的是，要手动在package.json中配置有效H5_HOST字段。用于访问\b H5 页面对应的 URL。{    \"nanachi\" : {\n        \"H5_HOST\": \"https://www.qunar.com\"\n    }\n}\n如在应用中从pages/a/b/index路由跳转pages/c/d/index。其中pages/c/d/index会变成一个对应的 H5 访问地址（比如：https://www.qunar.com/pages/c/d/index）。运行nanachi watch:h5, 会将pages/c/d/index页面编译成一个H5, 并启动一个运行 H5 页面的 server 服务。注：智能 webview 化目前只支持快应用，其他平台正在陆续支持中。"
        },
        {
          "title": "webview标签的兼容",
          "url": "/documents/webview.html#webview标签的兼容",
          "content": "webview标签的兼容webview标签在不同平台，它的名称与事件名有点出入\n\nwx\nali\nbu\ntt\nquick\n\n\n\n\nweb-view\nweb-view\nweb-view\nweb-view\nweb\n\n\n"
        }
      ]
    },
    {
      "title": "自定义项目配置",
      "content": "用户可以自定义项目配置需要在项目根目录里新建类似quickConfig.json,wxConfig这样独立的配置文件。├── package.json├── quickConfig.json\n└── source\n比如 quickConfig.json，需要指定快应用引擎，微信支付，分包配置文件内容参照快应用 manifest.json 配置文档。{    \"package\": \"com.qunar.quick\",\n    \"name\": \"去哪儿旅行\",\n    \"versionName\": \"3.0.7\",\n    \"versionCode\": 57,\n    \"minPlatformVersion\": 1030,\n    \"icon\": \"/assets/image/qlog.png\",\n    \"features\": [\n        {\n            \"name\": \"service.wxpay\",\n            \"params\": {\n                \"url\": \"https://xxx.yyy.com/touch/wechatTransition\"\n            }\n        }\n    ],\n    \"subpackages\": [\n        {\n            \"name\": \"hotel\",\n            \"resource\": \"pages/hotel\"\n        },\n        {\n            \"name\": \"ticket\",\n            \"resource\": \"pages/ticket\"\n        },\n        {\n            \"name\": \"train\",\n            \"resource\": \"pages/train\"\n        },\n        {\n            \"name\": \"vacation\",\n            \"resource\": \"pages/vacation\"\n        }\n    ]\n}\n又如 wxConfig.json需要处理权限参见https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html{    \"permission\": {\n    \"scope.userLocation\": {\n      \"desc\": \"你的位置信息将用于小程序位置接口的效果展示\"\n    }\n  }\n}\n",
      "url": "/documents/customConfig.html",
      "children": []
    },
    {
      "title": "自定义打包配置",
      "content": "我们提供了node api供用户调用。",
      "url": "/documents/customBuildConfig.html",
      "children": [
        {
          "title": "nanachi api",
          "url": "/documents/customBuildConfig.html#nanachi-api",
          "content": "nanachi apiconst nanachi = require('nanachi-cli');nanachi({\n    /**\n     * @Boolean\n     * 是否使用watch模式，默认值：false\n     */\n    watch,\n    /**\n     * @Enum ['wx', 'ali', 'bu', 'tt', 'quick']\n     * 平台，默认值：wx\n     */\n    platform,\n    /**\n     * @Boolean\n     * 是否使用线上beta核心库，默认值：false\n     */\n    beta,\n    /**\n     * @Boolean\n     * 是否使用最新schnee-ui，默认值：false\n     */\n    betaUi,\n    /**\n     * @Boolean\n     * 是否使用压缩模式，默认值：false\n     */\n    compress,\n    /**\n     * @Object\n     * 压缩图片参数（压缩率等）\n     */\n    compressOption,\n    /**\n     * @Boolean\n     * 是否是huawei平台，默认值：false\n     */\n    huawei,\n    /**\n     * @Array\n     * 自定义预处理loaders(同时作用于Js、css)，默认值：[]\n     */\n    prevLoaders,\n    /**\n     * @Array\n     * 自定义后处理loaders(同时作用于Js、css)，默认值：[]\n     */\n    postloaders,\n    /**\n     * @Array\n     * 自定义Js预处理loaders，默认值：[]\n     */\n    prevJsLoaders,\n    /**\n     * @Array\n     * 自定义Js后处理loaders，默认值：[]\n     */\n    postJsloaders,\n    /**\n     * @Array\n     * 自定义样式预处理loaders，默认值：[]\n     */\n    prevCssLoaders,\n    /**\n     * @Array\n     * 自定义样式后处理loaders，默认值：[]\n     */\n    postCssloaders,\n    /**\n     * @Array\n     * 自定义添加webpack module.rules规则，默认值：[]\n     */\n    rules,\n    /**\n     * @Array\n     * 自定义webpack插件，默认值：[]\n     */\n    plugins,\n    /**\n     * @function complete\n     * 解析完成回调\n     * (err, result) => { }\n     * err: 错误\n     * result: webpack打包信息\n     */ \n    complete\n});\n/**\n * compressOption:\n * {\n *  jpg: {} // 具体参考 https://github.com/imagemin/imagemin-mozjpeg/blob/master/readme.md\n *  png: {} // 具体参考 https://github.com/imagemin/imagemin-optipng/blob/master/readme.md\n *  gif: {} // 具体参考 https://github.com/imagemin/imagemin-gifsicle/blob/master/readme.md\n *  svg: {} // 具体参考 https://github.com/imagemin/imagemin-svgo/blob/master/readme.md\n * }\n */\n"
        },
        {
          "title": "自定义loader",
          "url": "/documents/customBuildConfig.html#自定义loader",
          "content": "自定义loader用户可以使用nanachi api编译nanachi应用，同时支持自定义预处理loader和后处理loader。compress压缩模式就是使用后处理loader实现的，链接：https://www.npmjs.com/package/nanachi-compress-loader我们规定了loader的输入和输出格式{    queues: // 需要生成的文件数组，如nanachi中的js文件在微信转义中会同时生成wxml和js文件还有可能生成json文件\n        [{\n            code, // 生成文件内容\n            type, // 生成文件类型\n            path // 生成文件相对路径\n        }],\n    exportCode // 标准js代码，包含了文件的依赖信息，用于webpack解析文件依赖\n}\n"
        },
        {
          "title": "nanachi config",
          "url": "/documents/customBuildConfig.html#nanachi-config",
          "content": "nanachi config自定义loader应用到项目中，有两种方式供选择：在项目根目录下创建nanachi配置文件，nanachi.config.js\n// nanachi.config.jsmodule.exports = {\n    postLoaders: ['nanachi-compress-loader']\n}\n正常运行nanachi命令，即可将自定义配置应用到项目中npm install nanachi-compress-loader --save-devnanachi build\n使用nanachi api，自定义编译脚本\n// build.jsconst nanachi = require('nanachi-cli');\n\nnanachi({\n    platform: 'ali',\n    postLoaders: ['nanachi-compress-loader']\n});\nnode build.js"
        }
      ]
    },
    {
      "title": "",
      "content": "",
      "url": "/documents/nativeComponents.html",
      "children": [
        {
          "title": "不转译某些标签名",
          "url": "/documents/nativeComponents.html#不转译某些标签名",
          "content": "不转译某些标签名像微信，支付宝，它们总是不断推出新的标签，如live-player,live-pusher...对于这些原生组件签标，nanachi是不做转译，因此我们有一个列表来放置这些标签，告诉转译器不做处理，否则都转换成view但是我们可能盯得没有这么紧，当厂商推出一个新标签时，我们还没有新版本时，用户怎么办，不能干等吧。因此我们推出一个新配置，在wxConfig.json, aliConfig.json, buConfig.json, quickConfig.json, 360Config.json ...叫做nativeComponents，它对应一个字符串数组，里面是你不想转译的标签名{    \"package\": \"com.qunar.quick\",\n    \"name\": \"去哪儿旅行\",\n    \"versionName\": \"3.0.7\",\n    \"versionCode\": 57,\n    \"minPlatformVersion\": 1030,\n    \"icon\": \"/assets/image/qlog.png\",\n     \"nativeComponents\": [\"life-follow\",\"xxxx\"],\n    \"features\": [\n        {\n            \"name\": \"service.wxpay\",\n            \"params\": {\n                \"url\": \"https://xxx.yyy.com/touch/wechatTransition\"\n            }\n        }\n    ],\n}\n"
        }
      ]
    },
    {
      "title": "拆库开发",
      "content": "拆库开发亦称分仓库开发。",
      "url": "/documents/chaika.html",
      "children": [
        {
          "title": "拆库开发能解决哪些问题？",
          "url": "/documents/chaika.html#拆库开发能解决哪些问题？",
          "content": "拆库开发能解决哪些问题？想象一下，如果一个小程序非常大，涉及多条业务线，每条业务线有自己的开发一个频道。 如果没有拆库功能，本地开发时，需要将整个工程全量 clone 到本地然后进行开发。一旦项目体量大起来（业务线多起来），上面这种方式很容易不小心误触别业务线的代码，并且全量编译的时间更长，效率低。在开发时：如何能让自己业务线代码保持独立，只专注于本业务线代码？\n如何自由安装在开发中所依赖的其他业务线代码呢？\n\n这，就是 nanachi 拆库开发所要解决的问题。"
        },
        {
          "title": "如何对代码进行拆库？",
          "url": "/documents/chaika.html#如何对代码进行拆库？",
          "content": "如何对代码进行拆库？要使用 nanachi 拆库功能，首先要把各业务线拆分成“拆库工程”。我们允许每个业务线都独立建一个github/gitlab仓库进行独立开发，每个仓库需要保持 nanachi 工程所必须的目录结构（这是必须的）。建立自己业务线的 git 工程。\n将自己的业务线代码抽成符合 nanachi 规范的目录结构。\n注意事项：应该拆库出一个“主包拆库工程”，主包中必须含有app.js。这是开发依赖，当用户开发自己的项目时，必须先要安装含有app.js的主包\n举个栗子：比如我们 qunar 有的火车票业务线和酒店业务线，如何针对这两个业务线进行拆库呢？"
        },
        {
          "title": "一：拆库主包工程（包含app.js）",
          "url": "/documents/chaika.html#如何对代码进行拆库？-一：拆库主包工程（包含app.js）",
          "content": "一：拆库主包工程（包含app.js）工程地址：yourAddress/nanachi_app_home.git\n工程结构：\n\n"
        },
        {
          "title": "二：酒店业务线拆库工程",
          "url": "/documents/chaika.html#如何对代码进行拆库？-二：酒店业务线拆库工程",
          "content": "二：酒店业务线拆库工程工程地址：yourAddress/nanachi_app_hotel.git\n工程结构：\n\n"
        },
        {
          "title": "三：火车票业务线拆库工程",
          "url": "/documents/chaika.html#如何对代码进行拆库？-三：火车票业务线拆库工程",
          "content": "三：火车票业务线拆库工程工程地址：yourAddress/nanachi_app_train.git\n工程结构：\n\n"
        },
        {
          "title": "四：在业务线的 package.json 需要进行简单配置",
          "url": "/documents/chaika.html#如何对代码进行拆库？-四：在业务线的-package.json-需要进行简单配置",
          "content": "四：在业务线的 package.json 需要进行简单配置{  \"nanachi\": {\n    \"chaika\": true //这是告诉 nanachi，当前快发模式为“拆库”模式。\n  }\n}\n"
        },
        {
          "title": "拆库关键文件说明",
          "url": "/documents/chaika.html#拆库关键文件说明",
          "content": "拆库关键文件说明app.json：注意上面的拆库目录结构都有一个app.json，内容为：{    \"pages\": [\n        \"pages/plat/pageA/index\",\n        \"pages/plat/pageB/index\"\n    ],\n    \"nanachi\":{\n        \"alias\": {\n            \"@hotel/common\": \"source/common/hotel\"\n        }\n    },\n    \"order\": 100\n}\npages 字段为数组，pages 里面的路由将会被注入到 app.js 中，用以被 nanachi 编译。\nnanachi 字段即为 package.json 中的 nanachi 的配置，会被合并到 package.json 中。\norder 字段为路由排序标识，order值越大，最后打包到app.json中的这些路由排序越靠前。\n"
        },
        {
          "title": "如何使用 nanachi 拆库",
          "url": "/documents/chaika.html#如何使用-nanachi-拆库",
          "content": "如何使用 nanachi 拆库\nclone 你自己的业务线代码: git clone git@xxx.git.\n\n\n安装你的项目依赖的其他业务线拆卡工程：nanachi install git@otherProject.git -b branchName（跟git   clone一回事）。\n注意：首先要安装“拆库主包工程”，即包含 app.js 的拆卡工程，这是所有业务线的开发，运行依赖。再根据实际场景决定是否需要安装其他拆卡工程。\n\n\nnanachi watch\n\n相比之前的普通模式开发，其实就多了步骤2。"
        },
        {
          "title": "自定义 install 拆库工程",
          "url": "/documents/chaika.html#自定义-install-拆库工程",
          "content": "自定义 install 拆库工程nanachi默认只支持install git 工程（nanachi install xx@yyy.git --branch yourBranch)。但 nanachi 支持用户可以自定义安装方式，比如 install 压缩包。命令行：nanachi install tarName@version但需要一些额外配置。在你的项目工程跟目录中新建一个 nanachi.config.js 配置文件。module.exports = {    chaikaConfig: {\n        onInstallTarball: function(tarName, version){\n            let preUrl = 'http://xxx/yyy';\n            let tarUrl = `${preUrl}/${version}/${version}/${tarName}-${version}.zip`;\n            return tarUrl;\n        }\n    }\n}\n在该配置中生命周期 onInstallTarball 有两个参数。分别代表压缩包名，已经压缩包版本。该函数返回值就是压缩包的远程地址。当执行命令nanachi install tarName@version时候，配置中的  onInstallTarball函数会劫持命令行中 tarName 和 version, 并作为函数的参数。你只需要在该函数中返回一个压缩包的远程地址，nanachi 就会帮你下载。"
        },
        {
          "title": "批量 install 拆库工程。",
          "url": "/documents/chaika.html#批量-install-拆库工程。",
          "content": "批量 install 拆库工程。此功能需在你当前项目的package.json中配置modules字段{   \"modules\": {\n    \"yourModuleName\": \"yourBranch\",\n    \"yourModuleName\": \"yourTag\"\n  }\n}\n然后命令行执行 nanachi install, 则会批量安装modules字段里面配置的所有拆卡工程。"
        },
        {
          "title": "之前使用 \"chaika\" 工具的同学如何迁移？",
          "url": "/documents/chaika.html#之前使用-\"chaika\"-工具的同学如何迁移？",
          "content": "之前使用 \"chaika\" 工具的同学如何迁移？安装依赖拆库工程的方式变为：nanachi install ...\n在自己业务线拆库工程package.json中配置字段。   {\n     \"nanachi\": {\n       \"chaika\": true //这是告诉 nanachi，当前快发模式为“拆库”模式。\n     }\n\n\n\n"
        },
        {
          "title": "注意事项",
          "url": "/documents/chaika.html#注意事项",
          "content": "注意事项配置文件，如wxConfig.json，aliConfig.json, ..., app.json需要放在拆库工程的source目录下, project.config.json, package.json等需要放在拆库工程根目录下。\nnanachi拆卡模式对各配置文件合并时，\bnanachi会将冲突暴露。如果遇到配置冲突，需用户自行解决冲突。\n\n"
        }
      ]
    },
    {
      "title": "alias别名配置",
      "content": "在项目package.json中，可配置别名， 减少引用的麻烦。假设我们有一个叫xxx的项目，用nanachi init xxx 创建后，大概是这个样子我们打开package.json在里面添加nanachi对象，nanachi下面再添加alias对象假设我们在assets目录下有一个global.scss，我们不想在pages在很深层次的目录中每次都要\n../../../assets/global.scss 地引用它。可以定义一个@assets别名，指向assets目录。\n由于当前执行命令在xxx目录下，assets又在source里，于是其路径为 source/assets所有向上跨级的路径（出现../开头的路径）都强烈要求使用别名机制, 它们应该都以source/assets, source/pages开头默认已经存在@react（视平台它会替换为ReactWX,ReaxtAli, ReactQuick, ReactBu）,\n@components (主包的组件)\n@assets (主包的静态资源)\n@common（主包的共公方法）\n{    \"license\": \"MIT\",\n    \"version\": \"1.0.0\",\n    \"name\": \"qunar\",\n    \"nanachi\": {\n        \"alias\":  {\n            \"@assets\":\"source/assets\", //主包的静态资源\n            \"@common\":\"source/common\", //主包的公共方法，注意这里的JS文件不能出现 JSX\n            \"@hotelStyle\":\"source/pages/hotel/assets/style\",//hotel分包的样式\n            \"@hotelCommon\":\"source/pages/hotel/common\",//hotel分包的公共方法\n        }\n    },\n    \"dependencies\": {\n        \"regenerator-runtime\": \"^0.12.1\"\n    }\n}\n使用方式，我们在某一个页面(/pages/xxx/yyy/index.js)添加一个index.scss, 其位置为pages/xxx/yyy/index.scss//index.jsimport React from '@react';\nimport './index.scss';\nclass P extends React.Component {\n    //略\n}\nexport default P\n//-------------- 略\n\n//index.scss\n\n@import '@assets/global.scss'\n.aaa {//其他样式\n  color:red;\n}\n在默认情况下， 每个项目的package.json/ nanachi / alias对象会添加两个别名@components与@react。因此添加别名时不要与它们冲突。在业务开发中，我们把一些没有视图的业务逻辑放到common目录下，建议不同部门都有自己的XXXCommon.src   |--components\n   |    |--HotelDialog\n   |    |     └──index.js  //必须以index.js命名，里面的类名 必须 与文件夹名一样, 如HotelDialog\n   |    |--HotelXXX\n   |    |--FlightYYY\n   |    └── ...\n   |--pages\n   |    |--hotel\n   |    |--flight\n   |    |--holiday\n   |    |--strategy\n   |    └── ...\n   |--common\n   |    |--hotelCommon\n   |    |    └── ...\n   |    |--flightCommon\n   |    |--holidayCommon\n   |    |--strategyCommon\n   |    └── ...\n   |--app.js\n那么各部门可以这样定义自己的别名{    \"license\": \"MIT\",\n    \"version\": \"1.0.0\",\n    \"name\": \"qunar\",\n    \"nanachi\": {\n        \"alias\":  {\n            \"@assets\":\"source/assets\",\n            \"@hotel\" :\"source/common/hotelCommon\",\n            \"@train\" :\"source/common/trainCommon\",\n            \"@flight\" :\"source/common/flightCommon\"\n        }\n    },\n    \"dependencies\": {\n        \"regenerator-runtime\": \"^0.12.1\"\n    }\n}\n使用方式：import React from '@react'import trainPay from '@train/pay';\n//....其他代码\n\n",
      "url": "/documents/alias.html",
      "children": []
    },
    {
      "title": "vscode插件",
      "content": "我们开发了针对nanachi的js和样式代码检查的插件，可以在vscode中高亮显示不符合nanachi规范的语法，case还未完善，大家可以先试用下nanachi eslint插件，结合vscode使用，智能提示错误语法https://www.npmjs.com/package/eslint-plugin-nanachinanachi stylelint插件，结合vscode使用，智能提示错误样式语法https://www.npmjs.com/package/stylelint-plugin-nanachi",
      "url": "/documents/vscode.html",
      "children": []
    },
    {
      "title": "日志收集与上传",
      "content": "出于运营的需要，我们需要将页面的流转信息，用户点击分布，错误，页面渲染情况发送到后端小程序编译阶段，会将所有事件转换为一个全局的dispatchEvent方法，因此我们可以这里做统一的日志的收集      震动\n \n如果我们发现这事件类型是click/tap/change/blur, 我们就会为这些元素添加一个data-beacon-uid, 值为default,(如果你已经写了，它就不会添加)，然后在dispatchEvent执行app.js的全局对象的onCollectLogs方法，让用户整理成一个对象，放到一个数组中, 并尝试使用onReportLogs自动发送；//dispatchEvent的源码export function dispatchEvent(e) {\n    const instance = this.reactInstance;\n    if (!instance || !instance.$$eventCached) {\n        return;\n    }\n    const eventType = toLowerCase(e.type);\n    const app = _getApp();\n    const target = e.currentTarget;\n    const dataset = target.dataset || {};\n    const eventUid = dataset[eventType + 'Uid'];\n    const fiber = instance.$$eventCached[eventUid + 'Fiber'] || {\n        props: {},\n        type: 'unknown'\n    };\n    if (app && app.onCollectLogs && /click|tap/.test(eventType) ) {\n        app.onCollectLogss(dataset, eventType, fiber && fiber.stateNode);\n    }\n   \n    //....略\n}\n当用户退出APP时，会进入onHide事件，这时我们就会上传剩余的所有日志因此用户只需要在app.js定义好这两个事件，框架帮你搞定日志上传。下面是示例：import React from '@react';import './pages/index/index';\nimport './pages/demo/base/index';\nimport './pages/demo/native/index/index';\nimport './app.scss';\nfunction computeXpath(node){ //通过xpath实现自动埋点\n    var xpath = [];\n    while (node.parentNode){\n        var index = node.parentNode.children.indexOf(node);\n        var tag = node.type == 'div' ? 'view': node.type;\n        xpath.unshift(tag+'['+index+']');\n        node = node.parentNode;\n    }\n    return  '/page/'+ xpath.join('/');\n}\nfunction computeCompressedXpath(node){ //压缩后的xpath\n    var xpath = [];\n    while (node.parentNode){\n        var index = node.parentNode.children.indexOf(node);\n        xpath.unshift(index);\n        node = node.parentNode;\n    }\n    return xpath.join('/');\n}\nvar openChange = false;\nclass Global extends React.Component {\n    static config = {\n        window: {\n            backgroundTextStyle: 'light',\n            navigationBarBackgroundColor: '#0088a4',\n            navigationBarTitleText: 'mpreact',\n            navigationBarTextStyle: '#fff'\n        }\n    };\n    // 全局数据\n    globalData = {\n        ufo: 'ufo'\n    };\n    onCollectLogs(dataset, eventType, node){ //这里会在框架的dispatchEvent自动调起，实现自动理点\n        var beaconId = dataset.beaconUid;\n        if( beaconId == 'default' && node ){\n            beaconId = computeCompressedXpath(node);\n        }\n        if (eventType === 'input') {//input事件触发太频繁了，我们只想收集一次\n            if (openChange) return;\n            openChange = true;\n            setTimeout(() => {\n                openChange = false;\n            }, 1000);\n        }\n\n        var otherData = dataset.xxx//data-xxxx\n        var otherData2 = dataset.xxx2;\n        var timeStamp = new Date - 0;\n        var path = React.getCurrentPage().props.path;//页面路径\n        var logs =  this.globalData.logs || (this.globalData.logs = [])\n        logs.push({\n            pid: beaconId,\n            path: path,\n            timeStamp: timeStamp\n            action: eventType\n        });\n        if(logs.length > 20){\n            var uploadLogs = logs.splice(0, 10);//截取前十条；\n            if(this.onReportLogs){\n                this.onReportLogs(uploadLogs)\n            }\n        }\n    };\n    onHide(){\n      this.onReportLogs(); //微信，支付宝，百度\n    };\n    onDistory(){\n      this.onReportLogs(); //快应用\n    };\n    onReportLogs(logs){ //自己实现\n        if(!logs){\n            var existLogs = this.globalData.logs\n            if(!Array.isArray(existLogs) || existLogs.length == 0){\n               return\n            }\n            logs = existLogs;\n            this.globalData.logs = [];\n        }\n        if(!logs.length){\n            return\n        }\n        var buildType = this.globalData.buildType;// wx, bu, ali\n        var info =  this.globalData.systemInfo | React.api.getSystemInfornSync();\n        var { brand, model, version, platform} = info ;//获取手机品牌，手机型号， 微信版本号, 客户端平台;\n        React.api.request({\n            url: \"/fdsfdsf/sdfds\",\n            type: 'GET',\n            data： {\n                logs,  //logData\n                buildType,//wx, bu, ali, quick, tt, qq\n                brand, //commonData\n                model, //commonData\n                version,//commonData\n                platform,//commonData\n             //other\n            } \n        })\n    }, \n    onLaunch() {\n        console.log('App launched');\n    }\n}\n\nexport default App(new Global());\n在common目录下import React from '@react'//此方法用于手动埋点\nfunction createLog(dataset, eventType){\n    var app =  React.getApp();\n    if(typeof app.onCollectLogs === 'function' ){\n        app.onCollectLogs(dataset, eventType, null)\n    }\n}\n",
      "url": "/documents/report.html",
      "children": [
        {
          "title": "各种日志的处理",
          "url": "/documents/report.html#各种日志的处理",
          "content": "各种日志的处理订单 等这样重要的行为， 要业务中进行手动埋点，使用上面的createLog方法\n点击，输入这样的事件，使用自动埋点，框架会在内部的dispatchEvent方法中自行调用全局的\nonCollectLogs方法\n页面流转情况， 建议对React.api.redirectTo等四个方法进行再包装，里面封入onCollectLogs方法，\n页面渲染时间，通过全局的onGlobalLoad, onGlobalReady等到某一页的渲染时间\n页面停留时间，通过全局的onGlobalShow onGlobalHide等到某一页的停留时间\n如果一些页面没有使用nanachi,可以通过下面的方法调用app.js的全局钩子：\n    var appHook = {        onLoad: \"onGlobalLoad\",\n        onReady: \"onGlobalReady\",\n        onShow: \"onGlobalShow\",\n        onHide: \"onGlobalHide\"\n     }\n     function addGlobalHooks(obj){\n         \"onLoad,onReady,onShow,onHide\".replace(/\\w+/g,function(method){\n             var fn = obj[method] || Number\n             obj[method] = function(param){\n                fn.call(obj, param);\n                var app = getApp();\n                var hook = appHook[method];\n                if(typeof app[hook] === 'function'){\n                    app[hook](param)\n                }\n             }\n         })\n     }\n     Page(addGlobalHooks({\n         \n     }))\n"
        },
        {
          "title": "快应用的UUID",
          "url": "/documents/report.html#快应用的uuid",
          "content": "快应用的UUID咱们的uv统计 以及未登录下单就是用的这玩意 andid就是ime号"
        }
      ]
    },
    {
      "title": "npm模块管理",
      "content": "针对小程序无法友好管理npm第三方模块问题，nanachi给与了最大限度支持，当文件中引入第三方npm模块，nanachi监听到后会自动安装，并且最小量打包你所依赖的npm模块。例如import cookie from 'cookie';打包后dist/npm/└── cookie\n    └── index.js\n微信小程序或快应用的JS环境 与浏览器的JS环境是不一样，不支持许多全局方法，比如fetch, requestAnimationFrame, location, 因此需要自行检测一下\n第三方库的可用性。\n",
      "url": "/documents/npm.html",
      "children": []
    },
    {
      "title": "微信插件",
      "content": "nanachi从1.2.7中支持微信插件相关介绍https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx56c8f077de74b07c&token=1011820682&lang=zh_CN#-",
      "url": "/documents/wxplugin.html",
      "children": [
        {
          "title": "使用",
          "url": "/documents/wxplugin.html#使用",
          "content": "使用在wxConfig.json添加{    \"plugins\": {\n        \"goodsSharePlugin\": {\n          \"version\": \"2.1.4\",\n          \"name\": \"share-button\",\n          \"provider\": \"wx56c8f077de74b07c\"\n        }\n     }\n}\n我们在内部就转换成一个对象plugin:{  \"share-button\": \"plugin://goodsSharePlugin/share-button\"\n}\n后面的值的计算公式为 plugin://${pluginName}/{tagName}{ this.state.ANU_ENV == 'wx'  && \n   }\n\n微信小程序的插件需要在后台中配置使用，可以用wx799d4d93a341b368 这个appid进行测试\n"
        }
      ]
    },
    {
      "title": "Iconfont 的支持情况",
      "content": "",
      "url": "/documents/iconfont.html",
      "children": [
        {
          "title": "使用方式",
          "url": "/documents/iconfont.html#使用方式",
          "content": "使用方式定义 iconfont 样式：// 本地字体@font-face {\n    font-family: 'fontLocal';\n    src: url('../../../assets/fonts/font.ttf');\n}\n// 远程地址\n@font-face {\n    font-family: 'fontOnline';\n    src: url(https://ss.qunarzz.com/yo/font/1.0.3/font.ttf);\n}\n\n.iconfont-local {\n    font-family: 'fontLocal';\n}\n.iconfont-online {\n    font-family: 'fontOnline';\n}\n定义组件：import React from '@react';import './index.scss';\n\nclass P extends React.Component {\n\n    render() {\n        return (\n            本地字体\n            &#xe351;\n            &#xe351;\n            远程字体\n            &#xf077;\n            &#xf078;\n        );\n    }\n}\n\nexport default P;\n"
        },
        {
          "title": "需要注意的点",
          "url": "/documents/iconfont.html#需要注意的点",
          "content": "需要注意的点\n字体图标文件必须放在 assets 目录下。\n\n\n为了兼容快应用，字体文件应仅使用 ttf(TrueType) 格式字体且不要加 format 属性，参考上面的示例。\n\n\n使用远程 iconfont 时必须填写完整的 url 地址，不能省略前面的 http 或者 https。\n\n\n因为娜娜奇的样式是组件封闭的，为了能够共用 iconfont 相关的样式，我们推荐建立一个公共的 iconfont 样式文件，然后在需要使用 iconfont 的组件里通过 @import 引入该样式。\n\n\n如果本地路径出错，建议使用兼容性更好的远程路径\n\n如果出错，可以参考这篇文章 https://blog.csdn.net/u013022210/article/details/80926383"
        },
        {
          "title": "支持情况",
          "url": "/documents/iconfont.html#支持情况",
          "content": "支持情况\n\n\n本地\n远程\n\n\n\n\n微信小程序\n✗\n✓\n\n\n支付宝小程序\n✓\n✓\n\n\n百度小程序\n✗\n✓\n\n\n快应用\n✓\n✓\n\n\n"
        }
      ]
    },
    {
      "title": "async/await",
      "content": "nanachi可自由使用async/await语法import React from '@react';\nclass P extends React.Component {\n    constructor(){\n        super();\n        this.state = {\n            status: ''\n        };\n        this.tapHander = this.tapHander.bind(this);\n    }\n    say(){\n        return new Promise((resolve)=>{\n            setTimeout(()=>{\n                resolve('hello nanachi');\n            }, 2000);\n        });\n    }\n    async tapHander(){\n        this.setState({status: 'waiting...' });\n        let result = await this.say();\n        this.setState({\n            status: result\n        });\n    }\n    render() {\n        return (\n            \n                status: {this.state.status}\n                click me\n            \n        );\n    }\n}\n\nexport default P;\n",
      "url": "/documents/async.html",
      "children": []
    },
    {
      "title": "Sass、Less、PostCSS支持",
      "content": "nanachi支持less, sass。对于sass解析，我们内置sass的新一代解析器dart-sass解析sass语法。dart-sass: https://github.com/sass/dart-sass\n各大样式预处理器对被依赖的@import资源内容打包到当前文件，在很多场景下，这种打包策略会造成应用体积臃肿，比如每个样式文件都引用了基础样式。nanachi对这种策略做了改进，实现了模块化打包。例如:\nSass:   //sass   @import './moduleA.scss';\n   @import './moduleB.scss';\n   .box {\n     color: #333;\n   }\n编译结果：   //sass   @import './moduleA.wxss';\n   @import './moduleB.wxss';\n   .box {\n     color: #333;\n   }\nLess:   //less   @import (reference) './moduleA.less';\n   @import (reference) './moduleB.less';\n   .box {\n     color: #333;\n   }\n编译结果：   //less   @import './moduleA.wxss';\n   @import './moduleB.wxss';\n   .box {\n     color: #333;\n   }\n注: postcss暂不支持该特性。",
      "url": "/documents/lesssass.html",
      "children": [
        {
          "title": "注意!!!",
          "url": "/documents/lesssass.html#注意!!!",
          "content": "注意!!!pages目录下需要引用公用样式，请将公用样式放入source/assets目录下。禁止pages目录下的文件以任何方式引入components目录下的任何样式表, components目录下的样式表也不能引用pages目录下的样式表。错误的用法1, pages下的JS文件引用components下的样式表//pages/xxx/index.jsimport '../../components/Dog/index.scss'\nimport React form '@react'\n\nclass P extends React.Component{\n错误的用法2，pages下的CSS文件（csss, wxss, acss）引用components下的样式表/*pages/xxx/index.scsss*/import '../../components/Dog/index.scss'\n.xxx{\n  border: 1px solid red\n}\n错误的用法3，component下的CSS文件引用pages目录下的样式表/*compoents/xxx/index.scsss*/import '../../pages/train/index.scss'\n.xxx{\n  border: 1px solid red\n}\n组件的样式必须在组件里面引用，禁止在pages页面样式文件中@import组件样式。"
        }
      ]
    },
    {
      "title": "内置UI库: Schnee UI",
      "content": "不是所有小程序都照着微信的那一套抄的，并且微信小程序的个别组件是基于native，他们（支付宝，百度等）拿不到源码，因此实现有所差异或延迟，并且为了以后让娜娜奇也运行于H5端，我们也需要实现那些不是H5标签的组件，因此就 Schnee UISchnee UI包含了微信weui所有组件，不同之外是它是基于flexbox布局。用户可以自主引用，或在框架编译用户代码时，发现当前的目标编译平台（如快应用），不支持某种标签，就自动用Schnee UI的组件偷偷替换它。如快应用下的，nanachi会自动转换成, 并且自动引入XIcom组件的依赖。外部组件:https://qunarcorp.github.io/schnee-ui/index.html",
      "url": "/documents/patchComponent.html",
      "children": [
        {
          "title": "快应用 Demo（需要先扫码下载，然后在快应用调试器里选择本地安装打开）",
          "url": "/documents/patchComponent.html#快应用-demo（需要先扫码下载，然后在快应用调试器里选择本地安装打开）",
          "content": "快应用 Demo（需要先扫码下载，然后在快应用调试器里选择本地安装打开）"
        }
      ]
    },
    {
      "title": "rpx &lt;--&gt;px互转",
      "content": "",
      "url": "/documents/units.html",
      "children": [
        {
          "title": "小程序中",
          "url": "/documents/units.html#小程序中",
          "content": "小程序中小程序行内样式 会根据屏幕比例将 px 转换成rpx如果你希望部分 px 单位不被转换成 rpx ，最简单的做法就是在px单位中增加一个大写字母，例如 PX这样，则会被转换插件忽略。"
        },
        {
          "title": "快应用中",
          "url": "/documents/units.html#快应用中",
          "content": "快应用中如果用户书写的是 1px，  则会转译成  2px， 如果用户写的是rpx， 则会转译成 px 。"
        }
      ]
    },
    {
      "title": "事件系统",
      "content": "小程序有两种绑定事件的方式。bindtap 绑定一个会冒泡的 tap 事件\ncatchtap 绑定一个不会冒泡的 tap 事件\nnanachi 为了大家方便，还是换回大家熟悉的风格，但不能冒泡的限制还没有搞定，因此也是两种绑定风格。onClick 绑定一个会冒泡的 click 事件, 小程序上会自动转换成tap 事件\ncatchClick 绑定一个不会冒泡的 click 事件, 小程序上会自动转换成tap 事件\n我们的转译器会扫描所有on/catch开头的属性， 进行事件绑定，因此如果你直接用bindTap、bindChange的方式来编写，会导致错误。//转译器中的相关源码if (/^(?:on|catch)[A-Z]/.test(attrName) &&!/[A-Z]/.test(nodeName) ) {\n    //内置标签的nodeName都是小写的，如果它的某个属性以on/catch开头，我们会认为它可能是事件\n    var prefix = attrName.charAt(0) == 'o' ? 'on' : 'catch';\n    var eventName = attrName.replace(prefix, '');\n    var otherEventName = utils.getEventName(\n        eventName,\n        nodeName,\n        buildType\n    ）\n    //....\n}\n",
      "url": "/documents/event.html",
      "children": [
        {
          "title": "映射事件名",
          "url": "/documents/event.html#映射事件名",
          "content": "映射事件名有的小程序的原生组件的事件非常坑，你绑定的事件与它触发时的事件对象的type并一致，比如说微信的小程序的map组件https://developers.weixin.qq.com/miniprogram/dev/component/map.html它有一个bindregionchange事件，你使用时是这样的{ console.log(e)}} />其实它是不会触发onRegionChange事件，而是触发两种事件，分别为begin与end, 因此我们需要使用data-xxx-alias来映射一下, 为它添加两个属性{ console.log(e)}} data-begin-alias=\"regionchange\" data-end-alias=\"regionchange\" />"
        },
        {
          "title": "事件对象",
          "url": "/documents/event.html#事件对象",
          "content": "事件对象由于小程序存在千差万别的差别，它的事件对象没有像PC有那么多属性与方法，最大的区别是没有stopPropagation 与 preventDefault。但娜娜奇会帮你抹平了 PC 与小程序的差异， 为它添加上伪装的 stopPropagation 与 preventDefault() 方法。注意 stopPropagation() 是没有效果的，你想并且冒泡还需要用 catchClick 的方式来绑定事件。如果 你想它转译成H5，那么catchXXX的回调内部需要大家执行 e.stopPropagation()。小程序事件对象的属性如下：{    target,//里面有dataset\n    pageX,\n    pageY,\n    value, //不一定有，但input, change事件有\n    timeStamp,\n    type,\n    stopPropagation,\n    preventDefault,\n    //还可能有其他属性，不同的事件类型会产生额外的属性\n}\n在一些小程序平台中，事件对象有detail这个对象，但建议不要使用它，因为当你想跨平台到webview/H5/快应用时，是没有这个对象的。并且我们也会将这个detail的属性下放到event上。//创建事件对象function createEvent(e, target) {\n    let event = Object.assign({}, e);\n    if (e.detail) {\n        Object.assign(event, e.detail);\n    }\n    //需要重写的属性或方法\n    event.stopPropagation = function () {\n        // eslint-disable-next-line\n        console.warn(\"小程序不支持这方法，请使用catchXXX\");\n    };\n    event.nativeEvent = e;\n    event.preventDefault = returnFalse;\n    event.target = target;\n    event.timeStamp = Date.now();\n    let touch = e.touches && e.touches[0];\n    if (touch) {\n        event.pageX = touch.pageX;\n        event.pageY = touch.pageY;\n    }\n    return event;\n}\n比如说微信小程序的onGetUserInfo方法onGetUserInfo: function(e){   console.log(e.userInfo)\n}\n"
        },
        {
          "title": "事件回调",
          "url": "/documents/event.html#事件回调",
          "content": "事件回调事件回调本身必须定义在类的原型里，不能在视图中使用 this.props.onClick ,只能this.onClick"
        },
        {
          "title": "注意事项",
          "url": "/documents/event.html#注意事项",
          "content": "注意事项定义了事件的标签，可能会自动添加data-beacon-uid, data-instance-uid这些属性，注意不要与它们冲突2018.11.14起 定义了事件的标签， 只会添加上data-beacon-uid属性，后面三者不再添加，从而减少视图的体积\ninput标签 统一使用onChange事件，不要用onInput\ndiv标签 统一使用onClick事件，不要用onTap\n"
        }
      ]
    },
    {
      "title": "包大小限制",
      "content": "\n\n平台\n主包与分包\n总size\n\n\n\n\n微信小程序\n2M\n8MB\n\n\nQQ小程序\n2M\n16MB\n\n\n支付宝小程序\n1M\n4M\n\n\n百度智能小程序\n2M\n8M\n\n\n字节跳动小程序\n4MB,不支持分包\n\n\n\n快应用\n1M\n4MB（华为没分包，10MB）\n\n\n",
      "url": "/documents/size.html",
      "children": [
        {
          "title": "微信小程序",
          "url": "/documents/size.html#微信小程序",
          "content": "微信小程序整个小程序所有分包大小不能超过8M； 单个分包、主包大小不能超过2M开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小"
        },
        {
          "title": "支付宝小程序的大小查看",
          "url": "/documents/size.html#支付宝小程序的大小查看",
          "content": "支付宝小程序的大小查看https://docs.alipay.com/mini/framework/subpackages降级的整包产物大小限制为 4M，每个分包的大小限制为 2M体积检测"
        },
        {
          "title": "百度智能小程序",
          "url": "/documents/size.html#百度智能小程序",
          "content": "百度智能小程序整个小程序所有分包大小不超过 8M，单个分包/主包大小不能超过 2M。https://smartprogram.baidu.com/docs/develop/framework/subpackages/开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小"
        },
        {
          "title": "QQ小程序",
          "url": "/documents/size.html#qq小程序",
          "content": "QQ小程序整个小程序所有分包大小不能超过24M； 单个分包、主包大小不能超过2M开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小"
        },
        {
          "title": "快应用的大小查看",
          "url": "/documents/size.html#快应用的大小查看",
          "content": "快应用的大小查看https://doc.quickapp.cn/framework/subpackage.html整个快应用的所有分包大小不超过 4M单个分包/基础包大小不能超过 1M如果项目中没有配置subpackages，那么打包最终仅生成rpk后缀的文件，称为整包，拥有全部的页面与资源(即没有启用分包功能)。如果项目中正确配置了subpackages，并且该版本的编译工具支持分包功能，那么打包最终会生成rpks后缀的文件，文件内部包含一个整包，以及所有的分包。分包文件后缀名为srpk。为了做到开发时兼容老版本调试平台，生成rpks文件的同时，也会生成rpk整包文件。快应用还有专门的发布命令npm run release\n查看rpk的大小"
        },
        {
          "title": "字节跳动小程序的大小查看",
          "url": "/documents/size.html#字节跳动小程序的大小查看",
          "content": "字节跳动小程序的大小查看代码不能超过4M，不支持分包开发完成后可从开发者工具中点击发布上传代码包， 上传失败或上传完输出大小"
        }
      ]
    },
    {
      "title": "分包加载",
      "content": "某些情况下，开发者需要将小程序划分成不同的子包，在构建时打包成不同的分包，用户在使用时按需进行加载。此功能已经被各种小程序支持了，这个能有效提升我们打开小程序的速度。",
      "url": "/documents/subpackages.html",
      "children": [
        {
          "title": "小程序使用",
          "url": "/documents/subpackages.html#小程序使用",
          "content": "小程序使用微信上，在source/app.js目录下建立一个wxConfig.json或 buConfig.json...假设我们的目录结构是这样：src   |--components\n   |    |--HotelDialog     // 这里的组件会全部打入主包中\n   |    |--HotelUm\n   |    |--Flight2\n   |    └── ...\n   |--pages\n   |    |--hotel\n   |    |   └── components\n   |    |         |--HotelXX1     // 这里的组件会打到hotel分包中\n   |    |         |--HotelXX2\n   |    |         |--HotelXX3\n   |    |         └── ...\n   |    |--flight\n   |    |   └── components\n   |    |         |--FlightXX1     // 这里的组件会打到flight分包中\n   |    |         |--FlightXX2\n   |    |         |--FlightXX3\n   |    |         └── ...\n   |    |--holiday\n   |    |--strategy\n   |    └──platform\n   |         |--index\n   |         |--page1\n   |         └── ...\n   |--assets \n   |    |--style\n   |--common\n   |    |--hotel\n   |    |--flight\n   |    |--holiday\n   |    |--strategy\n   |    └──platform\n   |--app.js\n   |--wxConfig.json\n   |--qqConfig.json\n   |--quickConfig.json\n   |--aliConfig.json\n   |--buConfig.json\n我们将pages/platform目录当成主包，那应该包含首页，tabBar list里面指向几个页面， 收银台，订单中心，会员中心，卡包等重要功能。主包也会包含src下面的components， common，assets 的所有功能。而其他子包， 则只能在pages的直接目录，hotel，ticket， holiday，strategy各自成包。wxConfig.json中的subpackages数组只用定义这几个目录就行了。{    \"subpackages\": [\n        {\n            \"name\": \"hotel\",\n            \"resource\": \"pages/hotel\"\n        },\n        {\n            \"name\": \"ticket\",\n            \"resource\": \"pages/ticket\"\n        },\n        {\n            \"name\": \"train\",\n            \"resource\": \"pages/train\"\n        },\n        {\n            \"name\": \"vacation\",\n            \"resource\": \"pages/vacation\"\n        }\n    ]\n}\n会自动翻译成下面的内容放到app.json中{     \"subpackages\": [ //百度下会编译为subPackages\n    {\n      \"root\": \"pages/hotel\",\n      \"name\": \"hotel\",\n      \"pages\": [\"index\",\"page1\",\"page2\",\"page3\",\"page4\"]\n    },\n    {\n      \"root\": \"pages/ticket\",\n      \"name\": \"ticket\",\n      \"pages\": [\"index\",\"list\",\"coupon/coupon\", \"detail\" ]\n    },\n    {\n      \"root\": \"pages/train\",\n      \"name\": \"train\",\n      \"pages\": [\"index\",\"aaa\",\"bbb\",\"ccc\"]\n    },\n    {\n      \"root\": \"pages/vacation\",\n      \"name\": \"vacation\",\n      \"pages\": [\"index\",\"aaa\",\"bbb\",\"ccc\"]\n    },\n  ]\n}\nsubpackages 中，每个分包的配置有以下几项：\n\n字段\n类型\n说明\n\n\n\n\nroot\nString\n分包根目录\n\n\nname\nString\n分包别名，分包预下载时可以使用\n\n\npages\nStringArray\n分包页面路径，相对与分包根目录\n\n\nindependent\nBoolean\n分包是否是独立分包\n\n\n"
        },
        {
          "title": "快应用的分包加载",
          "url": "/documents/subpackages.html#快应用的分包加载",
          "content": "快应用的分包加载在app.js同一目录下，建一个quickConfig.json。里面内部为{    \"subpackages\": [\n        {\n            \"name\": \"hotel\",\n            \"resource\": \"pages/hotel\"\n        },\n        {\n            \"name\": \"ticket\",\n            \"resource\": \"pages/ticket\"\n        },\n        {\n            \"name\": \"train\",\n            \"resource\": \"pages/train\"\n        },\n        {\n            \"name\": \"vacation\",\n            \"resource\": \"pages/vacation\"\n        }\n    ]\n}\n它们会自动加入manifest.json中没错，我们的wxConfig.json, buConfig.json, quickConfig.json里面的分包配置就是根据快应用的设计过来的，然后我们再转译成各个平台要求的样式。\n"
        },
        {
          "title": "打包原则",
          "url": "/documents/subpackages.html#打包原则",
          "content": "打包原则声明 subpackages 后，将按 subpackages 配置路径进行打包，subpackages 配置路径外的目录将被打包到 app（主包） 中app（主包）也可以有自己的 pages（即最外层的 pages 字段）\nsubpackage 的根目录不能是另外一个 subpackage 内的子目录\ntabBar 页面必须在 app（主包）内"
        },
        {
          "title": "引用原则",
          "url": "/documents/subpackages.html#引用原则",
          "content": "引用原则packageA 无法 require packageB JS 文件，但可以 require app、自己 package 内的 JS 文件packageA 无法 import packageB 的 template，但可以 require app、自己 package 内的 template\npackageA 无法使用 packageB 的资源，但可以使用 app、自己 package 内的资源\n主包会包含所有source/components中的所有组件， 为了减少主包的大小， 某些频道涉及的页面与组全应该放在pages下的某一目录下。详见这里快应用分包体积过大时的警告\n"
        },
        {
          "title": "坑",
          "url": "/documents/subpackages.html#坑",
          "content": "坑小程序的打包机制仅仅是根据文件目录打包，分包内require/import的任何文件，只要不在同一个目录下面，都不会被打进分包，也就是说，类库及一些公共文件，只能放在主包里面，如果主包分包划分不好的话，主包的大小也很难降下来安卓系统进入分包页面时，会出现一个丑陋的系统级的loading层，这一定程度上影响了安卓的体验"
        },
        {
          "title": "低版本兼容",
          "url": "/documents/subpackages.html#低版本兼容",
          "content": "低版本兼容由微信后台编译来处理旧版本客户端的兼容，后台会编译两份代码包，一份是分包后代码，另外一份是整包的兼容代码。 新客户端用分包，老客户端还是用的整包，完整包会把各个 subpackage 里面的路径放到 pages 中。目前 字节跳动小程序不支持分包"
        }
      ]
    },
    {
      "title": "分包预加载",
      "content": "开发者可以通过配置，在进入小程序某个页面时，由框架自动预下载可能需要的分包，提升进入后续分包页面时的启动速度。对于独立分包，也可以预下载主包。分包预加载有只支持通过配置方式使用，暂不支持通过调用API完成。vConsole 里有preloadSubpackages开头的日志信息，可以用来验证预下载的情况。\n{  \"pages\": [\"pages/platform/index/index\",\n       \"pages/platform/pay/index\",\n       \"pages/platform/about/index\"],\n  \"subpackages\": [\n    {\n      \"root\": \"flight\",\n      \"pages\": [\"index\"],\n    },\n    {\n      \"root\": \"train\",\n      \"pages\": [\"index\"],\n    },\n    {\n      \"name\": \"hotel\",\n      \"root\": \"index\",\n      \"pages\": [\"index\"]\n    },\n    {\n      \"root\": \"strategy\",\n      \"pages\": [\"index\"]\n    },\n     {\n      \"root\": \"boat\",\n      \"pages\": [\"index\"]\n     },\n      {\n      \"root\": \"taxi\",\n      \"pages\": [\"index\"]\n     },\n  ],\n  \"preloadRule\": {\n    \"pages/platform/index/index\": { //首页\n      \"network\": \"all\",\n      \"packages\": [\"flight\", \"train\",\"hotel\"] //一级分包或随机加载一级分包\n    },\n    \"pages/flight/index/index\": { \n      \"packages\": [\"strategy\",\"boat\", \"taxi\"] //二级分包或随机加载二级分包\n    },\n    \"pages/train/index/index\": {\n      \"packages\":  [\"strategy\",\"boat\", \"taxi\"] //二级分包或随机加载二级分包\n    },\n    \"pages/hotel/index/index\": {\n      \"packages\":  [\"strategy\",\"boat\", \"taxi\"] //二级分包或随机加载二级分包\n    },\n     \"pages/strategy/index/index\": {\n      \"packages\":  [ \"boat\", \"taxi\"] //二级分包中除自己的包\n    },\n     \"pages/boat/index/index\": {\n      \"packages\":  [\"strategy\", \"taxi\"] //二级分包中除自己的包\n    },\n     \"pages/taxi/index/index\": {\n      \"packages\":  [\"strategy\", \"boat\"] //二级分包中除自己的包\n    }\n  }\n}\n比较新的支付宝，百度的开发者工具，preloadRule的分包可以简略成以包名开头，即{  \"pages\": [\"pages/platform/index/index\",\n       \"pages/platform/pay/index\",\n       \"pages/platform/about/index\"],\n  \"subpackages\": [\n    {\n      \"root\": \"flight\",\n      \"pages\": [\"index\"],\n    },\n    {\n      \"root\": \"train\",\n      \"pages\": [\"index\"],\n    },\n    {\n      \"name\": \"hotel\",\n      \"root\": \"index\",\n      \"pages\": [\"index\"]\n    },\n    {\n      \"root\": \"strategy\",\n      \"pages\": [\"index\"]\n    },\n     {\n      \"root\": \"boat\",\n      \"pages\": [\"index\"]\n     },\n      {\n      \"root\": \"taxi\",\n      \"pages\": [\"index\"]\n     },\n  ],\n  \"preloadRule\": {\n    \"pages/platform/index/index\": { //首页\n      \"network\": \"all\",\n      \"packages\": [\"flight\", \"train\",\"hotel\"] //一级分包或随机加载一级分包\n    },\n    \"flight/index/index\": { \n      \"packages\": [\"strategy\",\"boat\", \"taxi\"] //二级分包或随机加载二级分包\n    },\n    \"train/index/index\": {\n      \"packages\":  [\"strategy\",\"boat\", \"taxi\"] //二级分包或随机加载二级分包\n    },\n    \"hotel/index/index\": {\n      \"packages\":  [\"strategy\",\"boat\", \"taxi\"] //二级分包或随机加载二级分包\n    },\n     \"strategy/index/index\": {\n      \"packages\":  [ \"boat\", \"taxi\"] //二级分包中除自己的包\n    },\n     \"boat/index/index\": {\n      \"packages\":  [\"strategy\", \"taxi\"] //二级分包中除自己的包\n    },\n    \"taxi/index/index\": {\n      \"packages\":  [\"strategy\", \"boat\"] //二级分包中除自己的包\n    }\n  }\n}\n|--pages\n     |--platform //这里我们将platform当作主包\n     |   |--index //index目录总是对应某个业务线的主页\n     |   |    └──index.js //当前频道的首页, 最好统一叫index\n     |   |--about\n     |   |    |---index.js\n     |   |    └── index.scss\n     |   └──pay\n     |        |---index.js\n     |        └── index.scss\n     |--train \n     |--hotel  \n     |--taxi  \n\npreloadRule 中，key 是页面路径，value 是进入此页面的预下载配置，每个配置有以下几项：\n\n字段\n类型\n必填\n默认值\n说明\n\n\n\n\npackages\nStringArray\n是\n无\n进入页面后预下载分包的 root 或 name。APP 表示主包。\n\n\nnetwork\nString\n否\nwifi\n在指定网络下预下载，可选值为：all: 不限网络 wifi: 仅wifi下预下载\n\n\n支付宝的分包与分包预加载都是支持得比较晚，支付宝客户端 10.1.60+ 或 小程序开发者工具 0.40+才开始支持。到2019.6.3，才升级到10.1.65，\n因此不建议对支付宝小程序进行分包。\n大家可以建一个去哪儿模板来体验一下nanachi init aaa选中qunar\ncd aaa && npm i\nnanachi watch\n",
      "url": "/documents/preload.html",
      "children": []
    },
    {
      "title": "真机调试",
      "content": "如果在真机中显示日志非常麻烦。建立一个页面用于显示错误信息// pages/error/indeximport React from '@react';\n\nclass P extends React.Component {\n    constructor(props){\n       super(props)\n       console.log(props)\n    }\n    render() {\n        return \n            错误页面\n            {this.props.query.filename}\n            {this.props.query.msg}\n            \n       \n    }\n}\n\nexport default P;\n在app.js添加一个onError钩子, 用于捕获错误并且跳转到刚才的页面将它显示出来 onError(e) {\n    console.log(\"捕获到错误\",e)\n    React.api.navigateTo({\n        url: \"/pages/error/index?msg=\" + e.message+\"&filename=\"+e.filename\n    });\n}\n最后别忘了在要app.js的上面添加import \"./pages/error/index\";像百度小程序在真机调试时，需要在项目信息中填入真实的appid才能用",
      "url": "/documents/debug.html",
      "children": []
    },
    {
      "title": "",
      "content": "",
      "url": "/documents/bu.html",
      "children": [
        {
          "title": "百度小程序环境判定",
          "url": "/documents/bu.html#百度小程序环境判定",
          "content": "百度小程序环境判定百度小程序userAgent 会有 swan， swan-baiduboxapp。这俩个其中的一个有可以稳定判断百度小程序环境的么。 baiduboxapp，在百度客户端，小程序都会有，我马上发截图"
        }
      ]
    },
    {
      "title": "快应用的scroll-view兼容",
      "content": "快应用没有scroll-view，它是通过refresh, list, list-item这三种标签实现的比如像下面复杂的代码，list里面有复杂的分支，而当前list-item是不请允许存在if, for语句。唯一能绕开的方法是能list-item添加上type属性，并且type的值都不一样。 {        this.state.orders.map(function (item, index) {\n            return (\n          \n            {item.businessType == 'hotel_hour' || item.businessType == 'hotel' || item.businessType == 'hotel_group_w' || item.businessType == 'new_apartment' ?\n                 : item.businessType == 'flight' ?\n                     : item.businessType == 'train' ?\n                             : item.businessType == 'bus' && item.orderType !== 5002002 ?\n                                 : item.businessType == 'carcar' ?\n                                         : item.businessType == 'bus' && item.orderType == 5002002 ?\n                                             : item.businessType == 'sight' || item.businessType == 'hotel_sight' ?\n                                                 : item.businessType == 'vacation' ?\n                                                     : ''\n                                }\n                            \n                        );\n                    })\n    }\n    底部\n\n改造如下： {        this.state.orders.map(function (item, index) {\n            return (\n          \n            {item.businessType == 'hotel_hour' || item.businessType == 'hotel' || item.businessType == 'hotel_group_w' || item.businessType == 'new_apartment' ?\n                 : item.businessType == 'flight' ?\n                     : item.businessType == 'train' ?\n                         : item.businessType == 'bus' && item.orderType !== 5002002 ?\n                             : item.businessType == 'carcar' ?\n                                     : item.businessType == 'bus' && item.orderType == 5002002 ?\n                                         : item.businessType == 'sight' || item.businessType == 'hotel_sight' ?\n                                             : item.businessType == 'vacation' ?\n                                                 : ''\n                            }\n                        \n                    );\n                })\n        \n    }\n      底部\n\n然后我们在转换阶段，在快应用下，list-item标签不变，scroll-view标签转译成list标签，onScrollToUpper转译成onScrollTop,\nonScrollToLower转译成onScrollBottom。在其他小程序下， list-item标签变div，scroll-view标签不变， 事件名不变如果想要refresh的功能， 即页面onPullDownRefresh功能，那你在scroll-view包一个refresh标签，这个在其他小程序会变成div。",
      "url": "/documents/quicklist.html",
      "children": []
    },
    {
      "title": "快应用下模拟同步Stroage APi",
      "content": "快应用没有strorageXxxSync，它们需要一些巧妙的方法进行模拟。但即使这样，我们也需要你在打开每个页面上初始化一下这个方法。ReactQuick.js中的实现const storage = require('@system.storage')import { noop } from 'react-core/util'\n\nfunction saveParse (str) {\n  try {\n    return JSON.parse(str)\n  } catch (err) {\n    // eslint-disable-line\n  }\n  return str\n}\n\nfunction setStorage ({ key, data, success, fail = noop, complete }) {\n  let value = data\n  if (typeof value === 'object') {\n    try {\n      value = JSON.stringify(value)\n    } catch (error) {\n      return fail(error)\n    }\n  }\n\n  storage.set({ key, value, success, fail, complete})\n}\n\nfunction getStorage ({ key, success, fail, complete }) {\n  function dataObj (data) {\n    success({\n      data: saveParse(data)\n    })\n  }\n  storage.get({ key, success: dataObj, fail, complete})\n}\n\nfunction removeStorage (obj) {\n  storage.delete(obj)\n}\n\nfunction clearStorage (obj) {\n  storage.clear(obj)\n}\n\nvar initStorage = false\nexport function initStorageSync (storageCache) {\n  if (typeof ReactQuick !== 'object') {\n    return\n  }\n  var apis = ReactQuick.api; // eslint-disable-line\n  var n = storage.length\n  var j = 0\n  for (var i = 0; i < n; i++) {\n    storage.key({\n      index: i,\n      success: function (key) {\n        storage.get({\n          key: key,\n          success: function (value) {\n            storageCache[key] = value\n            if (++j == n) {\n              console.log('init storage success')\n            }\n          }\n        })\n      }\n    })\n  }\n  apis.setStorageSync = function (key, value) {\n    setStorage({\n      key: key,\n      data: value\n    })\n    return storageCache[key] = value\n  }\n\n  apis.getStorageSync = function (key) {\n    return saveParse(storageCache[key])\n  }\n\n  apis.removeStorageSync = function (key) {\n    delete storageCache[key]\n    removeStorage({key: key})\n  }\n  apis.clearStorageSync = function () {\n    for (var i in storageCache) {\n      delete storageCache[i]\n    }\n    clearStorage({})\n  }\n}\nfunction warnToInitStorage () {\n  if (!initStorage) {\n    console.log('还没有初始化storageSync'); // eslint-disable-line\n  }\n}\nexport var setStorageSync = warnToInitStorage\nexport var getStorageSync = warnToInitStorage\nexport var removeStorageSync = warnToInitStorage\nexport var clearStorageSync = warnToInitStorage\n\nexport { setStorage, getStorage, removeStorage, clearStorage }\napp.js这样初始化它， 因为快应用是一个多页应用，不是SPA，只有globalData中的数据在每次页面打开时不会清空，globalData.__storage作为一个缓存可以加快我们读写的速度。    globalData = {\t    ufo: 'ufo'\n        __storage: {} \n\t};\n\tonGlobalLoad() {\n\t    if (process.env.ANU_ENV === 'quick') {\n\t        React.api.initStorageSync(this.globalData.__storage);\n\t    }\n\t}\n",
      "url": "/documents/quickstorage.html",
      "children": []
    },
    {
      "title": "微信/快应用盒子模型的区别",
      "content": "",
      "url": "/documents/boxDifferent.html",
      "children": [
        {
          "title": "box-sizing 的区别",
          "url": "/documents/boxDifferent.html#box-sizing-的区别",
          "content": "box-sizing 的区别在微信小程序中，盒子的 box-sizing 属性默认是 content-box\n在快应用中，盒子的 box-sizing 属性默认是 border-box\n很明显在快应用下：为元素设定的宽度和高度决定了元素的边框盒，元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制\n在微信小程序下：在宽度和高度之外绘制元素的内边距和边框，如有需要，在微信下可以手动加上 box-sizing: border-box; 让其和快应用表现一致\n"
        },
        {
          "title": "margin-top 的区别",
          "url": "/documents/boxDifferent.html#margin-top-的区别",
          "content": "margin-top 的区别如图，在快应用下：.inner{margin-top:25px} 是如我们期望的方式呈现的\n在微信小程序里面：子层和父层贴边了，而父层和上部层却间隔 25px\n\n当两个容器嵌套时,如果外层容器和内层容器之间没有别的元素,编辑器会把内层元素的margin-top作用与父元素，也就是说因为子层是父层的第一个非空子元素，在微信里面使用margin-top会发生这个错误\n解决办法：可以给父层 加 padding-top\n\n\n"
        }
      ]
    },
    {
      "title": "页面参数的获取",
      "content": "小程序与快应用没有location对象，想获取上一个页面跳转后带过来的参数有以下两种方式：onShow(queryObject)\n在React的各种生命周期钩子中访问this.props.query\nimport React from '@react';import Welcome from '@components/Welcome/index';\nimport './index.scss';\nclass P extends React.Component {\n    static innerQuery = { // 针对华为快应用的hack\n        a: 1,\n        b: 1\n    }\n    componentDidMount() {\n        // eslint-disable-next-line\n       console.log('page did mount!', this.props.query); //{a:111, b: false}\n    }\n    onShow(queryObject){\n        console.log(queryObject) // {a: 111, b: false}\n    }\n    render() {\n        return (\n            \n                \n            \n        );\n    }\n}\n\nexport default P;\n快应用分别两大派系， 小米快应用与华为快应用，小米与oppo, vivo, 魅族等公司进行技术共享，华为则自成一派，有自己单独的IDE。\n华为快应用是不能直接拿到页面参数，需要我们在app.js与页面上做一些配置，才能拿到参数，详见这里nanachi内部获取参数的方式function getQuery(wx, huaweiHack) {\n    var page = wx.$page;\n    if (page.query) { //小米 1050\n        return page.query;\n    }\n    var query = {};\n    if (page.uri) { //小米 1040\n        getQueryFromUri(page.uri, query);\n        for (var i in query) {\n            return query;\n        }\n    }\n    if (huaweiHack && Object.keys(huaweiHack).length) {\n        for (var _i in huaweiHack) {\n            query[_i] = wx[_i];\n        }\n        return query;\n    }\n    var data = _getApp().globalData; //路由跳转前把参数保存在globalData中，跳转后重新拿出来\n    return data && data.__quickQuery && data.__quickQuery[page.path] || query;\n}\n\n",
      "url": "/documents/query.html",
      "children": []
    },
    {
      "title": "华为快应用获取页面参数",
      "content": "华为快应用是无法获取页面参数，我们需要给页面添加一个protected对象与public对象。但我们又不可能每个页面都添加这两个对象，因此我们提供下面的方式给用户获取参数。在app.js添加两个静态对象innerQuery与outerQuery, innerQuery是用来接受页面间的跳转参数，outerQuery是用来接收外面跳进快应用的参数（比如H5跳快应用，卡片快应用跳快应用）。这两个参数对象的里面键名不能出现重复，比如innerQuery有a,b, outerQuery只能是c与d,不能加a.在app.js添加两个静态对象是对所有页面都生效。内外参数的设置详见快应用文档protected 内定义的属性，允许被应用内部页面请求传递的数据覆盖，不允许被应用外部请求传递的数据覆盖\n若希望参数允许被应用外部请求传递的数据覆盖，请在页面的 ViewModel 的public属性中声明使用的属性\nclass Global extends React.Component {    globalData = {}\n    static config = {\n        window: {\n            navigationBarBackgroundColor: '#00afc7',\n            backgroundTextStyle: 'light',\n            navigationBarTitleText: 'nanachi',\n            navigationBarTextStyle: 'white'\n        }\n    };\n    static innerQuery = { //这里的值是随意的\n      a: 1,\n      b: 1\n    }\n    static outerQuery = { //这里的值是随意的\n      c: 1,\n      d: 1\n    }\n}\n在某个需要获取参数的页面中也可以添加静态对象innerQuery与outerQuery， 它们是对app.js的同名参数对象的一些补充。import React from '@react';import { GlobalTheme } from '@common/GlobalTheme/index'; //@common 别名在package.json中配置\nimport Layout from '@components/Layout/index';\nimport AnotherComponent from '@components/AnotherComponent/index';\nimport './index.scss';\nclass P extends React.Component {\n    state = {\n        anyVar: { color: 'red' }\n    };\n    static innerQuery = {\n       k: 1\n    }\n    componentDidMount() {\n        // eslint-disable-next-line\n        console.log('page did mount!', this.props.query);\n        //由于我们在app.js指定了要获取a,b参数，在页面又指定获取c参数，因此这对象里面有a,b,c三个key\n    }\n    render() {\n        console.log(this.state.anyVar, '!!')\n        return (\n            \n                \n                    \n                \n            \n        \n        );\n    }\n}\n\nexport default P;\npublic, protected, innerQuery, outerQuery的关系详见源码export function registerPage(PageClass, path) {    var def = _getApp().$def\n    var appInner = def.innerQuery;\n    var appOuter = def.outerQuery;\n    var pageInner = PageClass.innerQuery;\n    var pageOuter = PageClass.outerQuery;\n    \n    var innerQuery = pageInner ?  Object.assign({}, appInner, pageInner ): appInner;\n    var outerQuery = pageOuter ?  Object.assign({}, appOuter, pageOuter ): appOuter;\n    let config = {\n        private: {\n            props: Object,\n            context: Object,\n            state: Object\n        },\n        //华为快应用拿不到页面参数，在$page.uri拿不到，manifest.json加了filter也不行\n        protected: innerQuery, //页面间的参数\n        public: outerQuery,    //外面传过来的参数\n        dispatchEvent,\n        onInit() { },\n        onReady: onReady,\n        onDestroy: onUnload\n    }\n    return config\n}\n",
      "url": "/documents/huaweiQuery.html",
      "children": []
    },
    {
      "title": "转发分享",
      "content": "小程序寄生在大流量的App中，因此转发共享功能非常重要，能实现病毒性传播。在原生的微信小程序有一个onShareAppMessage方法，它会返回一个对象。只要定义这个方法，那页面顶部就会自动出一个转发按钮，让用户进行转发。而快应用是没有这样的API，也没有这样的按钮，一切都需要手动实现。我们可以通过 React.api.showActionSheet创建一个右上角菜单，然后让某一栏为一个转发按钮，当用户点击它时实现这个功能。与onShow 一样，我们娜娜奇除了提供页面级别的分享钩子，也提供全局级别的分享钩子，分别称为onShare与onGlobalShare。// pages/pagexx/index.jsimport React from '@react';\nclass P extends React.Component {\n    constructor(props) {\n        super(props);\n        this.state = {\n            text: 'this is first line\\nthis is second line'\n        };\n    }\n\n    onShare() {\n            var navigateToUrl = this.props.path;\n            return {\n                title: '预订火车票 - 携程',\n                imageUrl: 'https://s.aaa.com/bbb/ccc.jpg',\n                path: navigateToUrl\n            };\n    }\n\n    remove() {\n        var textAry = this.state.text.split('\\n');\n        if (!textAry.length) return;\n        textAry.pop();\n        this.setState({\n            text: textAry.join('\\n')\n        });\n    }\n\n    render() {\n        return (\n            \n                \n                    progress\n                    \n                        \n                        \n                        \n                        \n                    \n                \n            \n        );\n    }\n}\n\nexport default P;\napp.js中需要添加一个onShowMenu方法，专门给快应用生成右上角菜单。class Demo extends React.Component {\n    static config = {\n        window: {\n            backgroundTextStyle: 'light',\n            // navigationBarBackgroundColor: '#0088a4',\n            navigationBarTitleText: 'mpreact',\n            navigationBarTextStyle: '#fff'\n        },\n        tabBar: {\n            'color': '#929292',\n            'selectedColor': '#00bcd4',\n            'borderStyle': 'black',\n            'backgroundColor': '#ffffff',\n            'list': [/**/ ]\n        }\n    };\n    globalData = {\n        ufo: 'ufo'\n    };\n    onGlobalShare() {\n        if (process.env.ANU_ENV === 'wx') {\n                return null; //微信直接使用默认的分享，没有写onShare也有\n          }\n          // 快应用的分享比较特殊\n          if (process.env.ANU_ENV === 'quick') {\n                        return {\n                            shareType: 0,\n                            title: '携程',\n                            summary: '携程，总有你要的低价',\n                            imagePath: '/assets/image/qlog.png',\n                            targetUrl: 'https://miniapp.tujia.com/quickShare?%2Fpages%2Fplatform%2Findex%3Fbd_origin%3Dfrom-quick-share',\n                            platforms: ['WEIXIN'],\n                            success: function(data) {\n                                        console.log('handling success')\n                            },\n                            fail: function(data, code) {\n                                        console.log(`handling fail, code = ${code}`)\n                            }\n                        };\n            }\n            const reactInstance = React.getCurrentPage();\n            let path = reactInstance && reactInstance.props && reactInstance.props.path;\n            let query = reactInstance && reactInstance.props && reactInstance.props.query;\n            return {\n                        title: '携程',\n                        content: '携程，总有你要的低价',\n                        path: 'pages/platform/indexWx/index',\n                        success: res => {\n                            Log({\n                                        name: 'share',\n                                        channel: res.channelName,\n                                        page: path,\n                                        query: JSON.stringify(query || {}),\n                                        to: 'pages/platform/indexWx/index',\n                            });\n                        },\n            };\n    }\n    onLaunch() {\n        // eslint-disable-next-line\n        console.log('App launched');\n    },\n    //快应用想实现 分享转发， 关于， 保存桌面\n    onShowMenu(pageInstance, app){\n         if(process.env.ANU_ENV === 'quick'){\n            var api = React.api;\n            api.showActionSheet({\n                itemList: ['转发', '保存到桌面', '关于', '取消'],\n                    success: function (ret) {\n                        switch (ret.index) {\n                            case 0: //分享转发\n                                var fn = pageInstance.onShare || app.onGlobalShare;\n                                var obj = fn && fn();\n                                if (obj){\n                                    api.share(obj);\n                                }\n                                break;\n                            case 1:\n                                // 保存桌面\n                                api.createShortcut();\n                                break;\n                            case 2:\n                                // 关于\n                                    api.getSystemInfo({\n                                        success: function(appInfo){\n                                            api.redirectTo({\n                                                url: `pages/about/index?brand=${appInfo.brand}&version=${appInfo.version}`\n                                            });\n                                        }\n                                    });\n                                break;\n                            case 3:\n                                // 取消\n                                break;\n                        }\n                    }\n               });\n            }\n        }\n    }\n}\n\n// eslint-disable-next-line\nexport default App(new Demo());\n",
      "url": "/documents/share.html",
      "children": [
        {
          "title": "快应用的分享",
          "url": "/documents/share.html#快应用的分享",
          "content": "快应用的分享1、界面交互 → 分享   import share from '@system.share'    这个分享主要用于不同APP之间的数据传递，因此归到“界面交互”中，可以传递文本数据或文件数据2、第三方服务 →  第三方分享  import share from '@service.share'这个分享主要用于将快应用中的信息通过社交工具（微信、QQ、新浪微博等）分享出去，可以以图文、纯文字、纯图文、音乐、视频等形式进行分享，分享前需要在manifest.json 的 features 中对service.share进行appSign、wxkey、qqkey、sinakey等参数参数的设置，否则分享出去的内容都将以纯文字方式进行展示。（微信分享时的appSign和wxkey设置可以参照关于微信分享的实现，亲测可用）"
        }
      ]
    },
    {
      "title": "快应用的onblur",
      "content": "快应用的onblur事件不会自动触发需要为此元素添加一个ID，然后在某个类似失去焦点的时机触发它emitBlur(){    if (process.env.ANU_ENV === 'quick') {\n        this.wx.$element('ANU_INPUT').focus({ focus: false });\n    }\n}\n",
      "url": "/documents/onblur.html",
      "children": []
    },
    {
      "title": "场景值的兼容",
      "content": "场景值用来描述用户进入小程序的路径。完整场景值的含义请查看场景值列表。由于Android系统限制，目前还无法获取到按 Home 键退出到桌面，然后从桌面再次进小程序的场景值，对于这种情况，会保留上一次的场景值。获取场景值开发者可以通过下列方式获取场景值：对于小程序，可以在 App 的 onLaunch 和 onShow，或wx.getLaunchOptionsSync 中获取上述场景值。// app.jsonShow(e){\n   console.log(e.scene)\n}\n\n\n场景值\n场景\nappId含义\n\n\n\n\n1020\n公众号 profile 页相关小程序列表\n来源公众号\n\n\n1035\n公众号自定义菜单\n来源公众号\n\n\n1036\nApp 分享消息卡片\n来源App\n\n\n1037\n小程序打开小程序\n来源小程序\n\n\n1038\n从另一个小程序返回\n来源小程序\n\n\n1043\n公众号模板消息\n来源公众号\n\n\n快应用比较相似的API就是app.getInfoapp.getInfo({   success(a){\n     console.log(a.type) \n     //来源类型，二级来源，值为 shortcut、push、url、barcode、nfc、bluetooth、other\n   }\n})\n\n\n场景值\n场景\n\n\n\n\nshortcut\n快捷方式\n\n\npush\n手机弹出的广告\n\n\nurl\n浏览器\n\n\nbarcode\n条形码、二维码？\n\n\nnfc\nNFC\n\n\nbluetooth\n蓝牙\n\n\nhttps://doc.quickapp.cn/features/system/app.html?h=getInfo",
      "url": "/documents/scene.html",
      "children": []
    },
    {
      "title": "卡片",
      "content": "卡片就是一个阉割版的快应用，许多功能与标签都不支持，体积还特别少，放在负一屏中",
      "url": "/documents/card.html",
      "children": [
        {
          "title": "VIVO负一屏卡片",
          "url": "/documents/card.html#vivo负一屏卡片",
          "content": "VIVO负一屏卡片卡片使用的是vivo的打包工具 vivo-hap-toolkit\n手机端需要安装卡片调试器、卡片引擎\n卡片开发是单独一个项目，不要和原有的快应用项目混在一起\n"
        },
        {
          "title": "努比亚卡片",
          "url": "/documents/card.html#努比亚卡片",
          "content": "努比亚卡片卡片调试需要安装：1、 Nubia最新快应用引擎nubiaHybridxxx.apk 1.0.3.1以上版本\n2、 快应用调试器QuickCardTest.apk具体调试步骤如下：1.在手机的sd目录下新建一个文件夹 名称为：quickcard2.将需要验证的rpk文件拷贝到上面目录下3.打开QuickCardTest应用加载卡片查看运行效果4.若rpk有修改调试仅重复步骤2,并最近任务中kill QuickCardTest重新打开即可注：quickcard下同时只能有一个rpk文件"
        },
        {
          "title": "OPPO卡片",
          "url": "/documents/card.html#oppo卡片",
          "content": "OPPO卡片OPPO 官方指南OPPO 调试指南\nOPPO 卡片规范1.从官方指南中(第一个链接）下载快应用引擎和卡片运行环境安装包到手机上，并分别安装；2.在手机根目录，创建名称为 rpks 的文件夹；\n3.把包含卡片的快应用 rpk 包复制到 rpks 文件夹中；\n4.在桌面上找到名为「快应用」的 App 并打开，选择「快应用卡片」，点击相应的卡片（秒开）即可看到卡片；\n5.打开卡片后，快应用首页、卡片设置页面（如有）、帐号绑定页面（如有）等，可以在卡片预览页面的最右上角打开。"
        },
        {
          "title": "华为搜索卡片",
          "url": "/documents/card.html#华为搜索卡片",
          "content": "华为搜索卡片此项目可独立于快应用运行。使用华为快应用 IDE 打开当前目录，连接华为手机，点击 IDE 上方的预览按钮，即可进行调试。调试工具每次只会显示一张卡片，在 IDE 上方的入口中可以选择需要调试的卡片。所有卡片都在目录 huaweiCard/ 中。华为卡片应和快应用主程序一同发布，发布时需要将将卡片合并进主程序中："
        },
        {
          "title": "卡片的配置参数",
          "url": "/documents/card.html#卡片的配置参数",
          "content": "卡片的配置参数\n\n属性\n类型\n必填\n描述\n\n\n\n\nname\nString\n是\n卡片名称\n\n\ndescription\nString\n否\n卡片描述\n\n\ncomponent\nString\n是\n卡片对应的组件名，与 ux 文件名保持一致，例如'hello' 对应'hello.ux'\n\n\npath\nString\n是\n卡片对应的唯一标识，例如“/user”，不填则默认为/。path 必须唯一，不能和其他 page/widget 的 path 相同。\n\n\nfeatures\nArray\n否\n本卡片使用的接口列表，卡片的接口列表单独定义，在某些场景下可以做提前申请（例如负一屏）\n\n\nminPlatformVersion\nInteger\n否\n支撑的最小平台版本号，不提供则同 rpk 的版本号\n\n\n"
        },
        {
          "title": "VIVO/努比亚卡片manifest.json配置",
          "url": "/documents/card.html#vivo努比亚卡片manifest.json配置",
          "content": "VIVO/努比亚卡片manifest.json配置{    \"router\": {\n        \"widgets\": {\n            \"Card\": {\n                \"name\": \"nanachi\",\n                \"description\": \"nanachi快应用，聪明你的旅行\",\n                \"component\": \"index\",\n                \"path\": \"/Card\",\n                \"features\": [{\n                    \"name\": \"system.router\"\n                }, {\n                    \"name\": \"system.fetch\"\n                }],\n                \"params\": {\n                    \"title\": \"noTitle\",\n                    \"height\": \"53.333%\",\n                    \"enableFold\": \"false\"\n                },\n                \"minPlatformVersion\": \"1032\",\n                \"targetManufactorys\": [\n                    \"vivo\"\n                ]\n            }\n        }\n    },\n    \"display\": {}\n}\n"
        },
        {
          "title": "OPPO卡片manifest.json配置",
          "url": "/documents/card.html#oppo卡片manifest.json配置",
          "content": "OPPO卡片manifest.json配置{    \"router\": {\n        \"widgets\": {\n            \"Card\": {\n                \"name\": \"nanachi\",\n                \"description\": \"nanachi快应用，聪明你的旅行\",\n                \"component\": \"index\",\n                \"path\": \"/oppoCard\",\n                \"features\": [{\n                    \"name\": \"system.router\"\n                }, {\n                    \"name\": \"system.fetch\"\n                }],\n                \"params\": {\n                    \"title\": \"noTitle\",\n                    \"height\": \"53.333%\",\n                    \"enableFold\": \"false\"\n                },\n                \"minPlatformVersion\": \"1032\",\n                \"targetManufactorys\": [\n                    \"oppo\"\n                ]\n            }\n        }\n    },\n    \"display\": {}\n}\n"
        },
        {
          "title": "华为卡片manifest.json配置",
          "url": "/documents/card.html#华为卡片manifest.json配置",
          "content": "华为卡片manifest.json配置{  \"package\": \"com.tujia.quick\",\n  \"name\": \"nanachi\",\n  \"versionName\": \"1.0.1\",\n  \"versionCode\": 2,\n  \"icon\": \"/assets/image/qlog.png\",\n  \"config\": {},\n  \"router\": {\n    \"pages\": {\n      \"huaweiCard/hotel\": {\n        \"component\": \"index\",\n        \"path\": \"/huaweiCard/hotel\"\n      },\n      \"huaweiCard/flight\": {\n        \"component\": \"index\",\n        \"path\": \"/huaweiCard/flight\"\n      },\n      \"huaweiCard/travel\": {\n        \"component\": \"index\",\n        \"path\": \"/huaweiCard/travel\"\n      },\n      \"huaweiCard/ticket\": {\n        \"component\": \"index\",\n        \"path\": \"/huaweiCard/ticket\"\n      },\n      \"huaweiCard/train\": {\n        \"component\": \"index\",\n        \"path\": \"/huaweiCard/train\"\n      },\n      \"huaweiCard/vacation\": {\n        \"component\": \"index\",\n        \"path\": \"/huaweiCard/vacation\"\n      }\n    }\n  },\n  \"widgets\": [\n    {\n      \"name\": \"tujiaHotel\",\n      \"id\": \"tujiaHotel\",\n      \"path\": \"/huaweiCard/hotel\",\n      \"component\": \"index\",\n      \"targetManufactorys\": [\n        \"huawei\"\n      ],\n      \"params\": [],\n      \"uses-permission\": [],\n      \"minPlatformVersion\": 1020\n    },\n    {\n      \"name\": \"tujiaFlight\",\n      \"id\": \"tujiaFlight\",\n      \"path\": \"/huaweiCard/flight\",\n      \"component\": \"index\",\n      \"targetManufactorys\": [\n        \"huawei\"\n      ],\n      \"params\": [],\n      \"uses-permission\": [],\n      \"minPlatformVersion\": 1020\n    },\n    {\n      \"name\": \"tujiaTravel\",\n      \"id\": \"tujiaTravel\",\n      \"path\": \"/huaweiCard/travel\",\n      \"component\": \"index\",\n      \"targetManufactorys\": [\n        \"huawei\"\n      ],\n      \"params\": [],\n      \"uses-permission\": [],\n      \"minPlatformVersion\": 1020\n    },\n    {\n      \"name\": \"tujiaTicket\",\n      \"id\": \"tujiaTicket\",\n      \"path\": \"/huaweiCard/ticket\",\n      \"component\": \"index\",\n      \"targetManufactorys\": [\n        \"huawei\"\n      ],\n      \"params\": [],\n      \"uses-permission\": [],\n      \"minPlatformVersion\": 1020\n    },\n    {\n      \"name\": \"tujiaTrain\",\n      \"id\": \"tujiaTrain\",\n      \"path\": \"/huaweiCard/train\",\n      \"component\": \"index\",\n      \"targetManufactorys\": [\n        \"huawei\"\n      ],\n      \"params\": [],\n      \"uses-permission\": [],\n      \"minPlatformVersion\": 1020\n    },\n    {\n      \"name\": \"tujiaVacation\",\n      \"id\": \"tujiaVacation\",\n      \"path\": \"/huaweiCard/vacation\",\n      \"component\": \"index\",\n      \"targetManufactorys\": [\n        \"huawei\"\n      ],\n      \"params\": [],\n      \"uses-permission\": [],\n      \"minPlatformVersion\": 1020\n    }\n  ],\n  \"minPlatformVersion\": 1040,\n  \"display\": {\n    \"backgroundColor\": \"#f2f2f2\",\n    \"titleBarBackgroundColor\": \"#f2f2f2\"\n  },\n  \"features\": [\n    {\n      \"name\": \"system.router\"\n    },\n    {\n      \"name\": \"system.fetch\"\n    }\n  ]\n}\n"
        }
      ]
    },
    {
      "title": "快应用如何模拟movable-area与movalbe-view",
      "content": "下面例子由小米官方(王操大神)提供  \n  \n    \n      \n        movable-area\n      \n      \n        movable-view\n      \n    \n  \n\n\n\n  import router from \"@system.router\";\n\n  export default {\n    // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖\n    private: {\n      title: \"示例页面\",\n      initx: 100,\n      inity: 100,\n      delayx: 0,\n      delayy: 0,\n      touchx: 0,\n      touchy: 0,\n      boxwidth: 200,\n      boxheight: 200\n    },\n    touch (env) {\n      this.touchx = env.touches[0].pageX\n      this.touchy = env.touches[0].pageY\n      this.delayx = this.initx\n      this.delayy = this.inity\n    },\n    touchend (env) {\n      this.canmove = false\n      this.delayx = this.initx\n      this.delayy = this.inity\n\n    },\n    move(env) { \n      this.initx = this.delayx + env.touches[0].pageX- this.touchx\n      this.inity = this.delayy + env.touches[0].pageY- this.touchy    \n    }\n  };\n\n\n\n  .bk {\n    width: 100%;\n    height: 100%;\n    background-color: #aaa;\n  }\n  .box {\n    width: 200px;\n    height: 200px;\n    background-color: #ffffff;\n  }\n\n\n",
      "url": "/documents/movable.html",
      "children": []
    },
    {
      "title": "各种小程序的差异点",
      "content": "\n\n项目\n微信小程序\n百度小程序\n支付小程序\n快应用\n\n\n\n\n命名空间\nwx\nswan\nmy\n无,需要 require 它提供的所有接口按 wx 形式封装\n\n\nif 指令\nwx:if\ns-if\na:if\nif\n\n\nfor 指令\nwx:for wx:for-index wx:for-item\n将wx:改成s-\n将wx:改成a:\nfor=\"(personIndex, personItem) in list\"\n\n\nkey 指令\nwx:key\ns-key\nkey\ntid\n\n\n容器标签\n存在\n存在\n存在\n存在\n\n\n事件绑定\nbind/catch[事件名全小写]=\"回调名\"\nbind/catch[事件名全小写]=\"回调名\"\non/catch[事件名驼峰]=\"回调名\"\non[事件名全小写]=\"回调名/回调(arguments)\"\n\n\n{{}}插值是否支持函数\n不支持\n不支持\n不支持\n支持\n\n\n模块中使用脚本\n\n\n\n\n\n\n模板文件后缀\nwxml\nswan\naxml\n没有独立的文件 放 template 中\n\n\n样式文件后缀\nwxss\ncss\nacss\n没有独立的文件 放 style 中，不需要处理 less,sass\n\n\ntemplate 包含 template\n支持\n不支持循环中使用 template\n支持\n未知\n\n\ntemplate 的 data 是否支持...\n{{...aaa}}\n{{{...aaa}}} 三个括号\n{{...aaa}}\n只能一个个数据分开写\n\n\n缺省的组件(视图容器)\nmovable-view、cover-view\n\nmovable-view、cover-view\n未知\n\n\n缺省的组件(基础内容)\nrich-text\n\n\n未知\n\n\n缺省的组件(导航)\nfunctional-page-navigator\n\n\n未知\n\n\n缺省的组件(媒体组件)\naudio、video、camera、live-player、live-pusher\n\n\n未知\n\n\nopen-data\n\n\n不支持\n未知\n\n\n样式单位 rpx 支持情况\n支持\n不支持（用 rem，最新的基础库版本已经支持）\n支持\n不支持\n\n\nAPIs 的这么多方法都不一样，可能以后针对不同的平台打包不同的 api.js 来屏蔽差异性",
      "url": "/documents/diff.html",
      "children": [
        {
          "title": "微信小程序与快应用差异(更新中...)",
          "url": "/documents/diff.html#微信小程序与快应用差异更新中...",
          "content": "微信小程序与快应用差异(更新中...)\n\n差异\n微信小程序\n快应用\n\n\n\n\n入口文件\napp.js, app.json\napp.ux, manifest.json\n\n\n结构，表现，行为组织方式\n分离：如 page.js, page.wxss, page.wxml\n聚合：类似 vue\n\n\n文件扩展名\n.js, .json, .wxml, .wxss\n.ux, .json\n\n\n路由注册\napp.json 中配置 pages 字段 例如\"pages\": [\"path1\", \"path2\"]\nmanifest.json 中配置 router 字段 详见文档\n\n\n路由跳转\n1.组件跳转[navigator 组件] 2.五种 js 跳转方式详见文档\n1. 组件跳转[a 组件] 2. router.push(OBJECT)\n\n\n获取应用实例\n调用函数：getApp()\n访问变量：this.$app\n\n\n模板逻辑渲染\n配置命名空间： 例如：wx:if/wx:elif/wx:else\n不需要 例如：if/elif/else\n\n\n钩子函数\nonLoad: 页面加载时触发\nonInit: 页面加载时触发\n\n\n\nonDestroy: 页面卸载\nonUnload: 页面卸载\n\n\n\nonBackPress：不支持\nonBackPress：支持\n\n\n\nonPageScroll：支持\nonPageScroll：不支持\n\n\n\nonPullDownRefresh： 支持\nonPullDownRefresh：不支持\n\n\n初始化状态(state)\ndata: {list: []}\nprivate: { list: [] }\n\n\n更新组件状态\nsetData 函数更新\n类 vue 语法\n\n\nUI 事件绑定方式\nbindEventName\n（on|@)EventName\n\n\nUI 事件自定义传参\n不支持\n支持\n\n\nAPI\n挂载在 wx 命名空间下：如 wx.showShareMenu(OBJECT)\n需引用相关模块：import share from '@system.share'\n\n\n盒子的box-sizing\n默认 content-box\n默认 border-box\n\n\n组件机制Component 构造器可用于定义组件，调用 Component 构造器时可以指定组件的属性、数据、方法等。\n\n字段\n说明\n微信\n支付宝\n百度\n轻应用\n\n\n\n\nproperties\n接收的数据\n同名\n同名\n同名\nprops\n\n\ndata\n内部数据\n同名\n同名\n同名\nprivate\n\n\nmethods\n方法集合\n同名\n同名\n同名\n不存在\n\n\ncreated\n组件创建时\n同名\n同名\n同名\nonInit\n\n\nattached\n组件插入时\n同名\n同名\n同名\n不存在\n\n\nready\n组件完成布局后\n同名\n同名\n同名\nonReady\n\n\ndetached\n组件移除时\n同名\n同名\n同名\nonDestroy\n\n\n思路：properties 定义两个属性 {props: Object, context: Object}created 或 onInit 时，抓取小程序实例与对应的 react 实例，将 props, state, context 给小程序实例"
        },
        {
          "title": "各平台的组件差异",
          "url": "/documents/diff.html#各平台的组件差异",
          "content": "各平台的组件差异点我查看"
        },
        {
          "title": "快应用",
          "url": "/documents/diff.html#快应用",
          "content": "快应用禁止使用top: 50%这样的写法，华为会跳出编译；\nborder: solid 1px red 只能按这个顺序写，写反会跳出编译\nbackground-image: url(\"bgimage.gif\"); 小括号里面的 url 不加引号会跳出编译\nborder-radius: 要用rpx, 不能使用百分比\n"
        },
        {
          "title": "页面组件在快应用的模拟",
          "url": "/documents/diff.html#页面组件在快应用的模拟",
          "content": "页面组件在快应用的模拟\nonShow onHide （大家都有）\n\n\n切换卡的支持，\n\n快应用需要外包 tabs 组件  这样唤起 onTabItemTap\nnavigationBarBackgroundColor\nnavigationBarTextStyle\nnavigationBarTitleText\n\n\n\n滚动下拉刷新相关的事件唤起\n\nonPullDownRefresh onReachBottom onPageScroll\nenablePullDownRefresh disableScroll\ntab-content 里面包含 list 组件与 refresh 组件\nlist.scroll--> onPageScroll\nlist.scrollbottom --> onReachBottom\nrefresh.refresh --> onPullDownRefresh\n\n\n\n转发按钮事件的唤起 onShareAppMessage\n\n如果用户定义了 onShareAppMessage，那么我们就添加 onMenuPress，这样右上角就会出现分享按钮\n或在编译期扫描　对其 onTap 事件加上 onShareAppMessage 钩子\n详见这里\n与 这里\n\n\n\n支付宝小程序 button 兼容\n\n微信，百度小程序获取用户信息，  通过 open-type 和  onGetuserinfo  来获取 用户的小程序信息        立即领取\n \n支付宝小程序  中 open-type = \"getAuthorize\"  触发事件 onGetAuthorize={this.onGetAuthorize}， scope='userInfo'完整的获取用户信息的button参数是        立即领取\n \n文档： https://docs.alipay.com/mini/api/ch8chhhttps://docs.alipay.com/mini/component/button"
        }
      ]
    },
    {
      "title": "",
      "content": "",
      "url": "/documents/link.html",
      "children": [
        {
          "title": "各种小程序的官网与调试工具地址",
          "url": "/documents/link.html#各种小程序的官网与调试工具地址",
          "content": "各种小程序的官网与调试工具地址微信小程序文档\n百度小程序文档\n支付小程序文档\n快应用文档\n快应用调试工具\n快应用 demo1\n快应用 demo2\n快应用的一个UI库\n华为开发者工具\n华为快应用引擎异常情况汇总\n微信小程序升级日志\n快应用升级日志\n百度小程序升级日志\n支付宝小程序升级日志\nQQ小程序开发工具\nQQ小程序文档\n360小程序文档\n头条小程序文档\n"
        }
      ]
    },
    {
      "title": "nanachi 项目反馈",
      "content": "",
      "url": "/documents/feedback.html",
      "children": [
        {
          "title": "下面是关于您的预编译语言使用情况",
          "url": "/documents/feedback.html#下面是关于您的预编译语言使用情况",
          "content": "下面是关于您的预编译语言使用情况    // 修改提交按钮文案为中文\n    document.addEventListener(\"DOMContentLoaded\", function(){\n      const els = document.querySelectorAll('form div[align=\"center\"] *');\n      if(els.length > 2){\n          var button1 = els[0]\n          var button2 = els[els.length-1];\n          button1.value = \"提交投票\";\n          button1.style.backgroundColor = \"#1890ff\";\n          button1.style.color = \"white\";\n          button1.style.padding = \"2px 8px\";\n          button1.style.cursor = \"pointer\";\n          button2.innerHTML = '查看结果';\n      }\n    });\n"
        },
        {
          "title": "下面区域是关于 nanachi 的反馈，如果你有什么意见或建议欢迎在评论区留言:",
          "url": "/documents/feedback.html#下面区域是关于-nanachi-的反馈，如果你有什么意见或建议欢迎在评论区留言",
          "content": "下面区域是关于 nanachi 的反馈，如果你有什么意见或建议欢迎在评论区留言:  const gitalk = new Gitalk({\n    clientID: \"c94e12373b38435e378a\",\n    clientSecret: \"497ad5ef73ba031b895f56cc1d73d0bf87d981d3\",\n    repo: \"nanachi\",\n    owner: \"RubyLouvre\",\n    admin: [\"RubyLouvre\", \"xuhen\"],\n    id: location.pathname,\n    distractionFreeMode: false\n  });\n\ngitalk.render(\"gitalk-container\");\n\n"
        }
      ]
    },
    {
      "title": "微信小程序的双线程架构",
      "content": "节选自微保@梁沛聪 的《 微信小程序渲染性能调优》\n@梁沛聪，微保技术部-架构平台中心高级前端开发，负责微保小程序基础库搭建、车险业务开发等工作，对小程序性能优化有深入地实践。\n为了叙述方便，下文会把微信小程序简称为小程序。\n与传统的浏览器Web页面最大区别在于，小程序的是基于 双线程 模型的，在这种架构中，小程序的渲染层使用 WebView 作为渲染载体，而逻辑层则由独立的 JsCore 线程运行 JS 脚本，双方并不具备数据直接共享的通道，因此渲染层和逻辑层的通信要由 Native 的 JSBrigde 做中转。",
      "url": "/documents/two-threaded.html",
      "children": [
        {
          "title": "小程序更新视图数据的通信流程",
          "url": "/documents/two-threaded.html#小程序更新视图数据的通信流程",
          "content": "小程序更新视图数据的通信流程每当小程序视图数据需要更新时，逻辑层会调用小程序宿主环境提供的 setData 方法将数据从逻辑层传递到视图层，经过一系列渲染步骤之后完成UI视图更新。完整的通信流程如下：小程序逻辑层调用宿主环境的 setData 方法。\n逻辑层执行 JSON.stringify 将待传输数据转换成字符串并拼接到特定的JS脚本，并通过evaluateJavascript 执行脚本将数据传输到渲染层。\n渲染层接收到后， WebView JS 线程会对脚本进行编译，得到待更新数据后进入渲染队列等待 WebView 线程空闲时进行页面渲染。\nWebView 线程开始执行渲染时，待更新数据会合并到视图层保留的原始 data 数据，并将新数据套用在WXML片段中得到新的虚拟节点树。经过新虚拟节点树与当前节点树的 diff 对比，将差异部分更新到UI视图。同时，将新的节点树替换旧节点树，用于下一次重渲染。\n"
        },
        {
          "title": "引发渲染性能问题的一些原因",
          "url": "/documents/two-threaded.html#引发渲染性能问题的一些原因",
          "content": "引发渲染性能问题的一些原因在上述通信流程中，一些不恰当的操作可能会影响到页面渲染的性能。"
        },
        {
          "title": "setData传递大量的新数据",
          "url": "/documents/two-threaded.html#setdata传递大量的新数据",
          "content": "setData传递大量的新数据数据的传输会经历跨线程传输和脚本编译的过程，当数据量过大，会增加脚本编译的执行时间，占用 WebView JS 线程。下图是我们做的一组测试统计：在相同网络环境下，各个机型分别对大小为1KB、2KB、3KB的数据执行 setData 操作所消耗的时间。从图中可以看出， setData 数据传输量越大，数据传输所消耗的时间越大。"
        },
        {
          "title": "频繁的执行setData操作",
          "url": "/documents/two-threaded.html#频繁的执行setdata操作",
          "content": "频繁的执行setData操作频繁的执行 setData 会让 WebView JS 线程一直忙碌于脚本的编译、节点树的对比计算和页面渲染。导致的结果是：页面渲染结果有一定的延时。\n用户触发页面事件时，因 WebView JS 线程忙碌，用户事件未能及时的传输到逻辑层而导致反馈延迟。\n"
        },
        {
          "title": "过多的页面节点数",
          "url": "/documents/two-threaded.html#过多的页面节点数",
          "content": "过多的页面节点数页面初始渲染时，渲染树的构建、计算节点几何信息以及绘制节点到屏幕的时间开销都跟页面节点数量成正相关关系，页面节点数量越多，渲染耗时越长。\n每次执行 setData 更新视图，WebView JS 线程都要遍历节点树计算新旧节点数差异部分。当页面节点数量越多，计算的时间开销越大，减少节点树节点数量可以有效降低重渲染的时间开销。\n"
        },
        {
          "title": "渲染性能优化",
          "url": "/documents/two-threaded.html#渲染性能优化",
          "content": "渲染性能优化基于引发渲染性能问题的原因，我们可以制定一些优化策略来避免性能问题的发生。"
        },
        {
          "title": "setData优化",
          "url": "/documents/two-threaded.html#setdata优化",
          "content": "setData优化setData 作为逻辑层与视图层通信的媒介，是最容易造成渲染性能瓶颈的 API 。我们在使用 setData时应该遵循一些规则来尽可能避免性能问题的发生："
        },
        {
          "title": "减少 setData 数据传输量",
          "url": "/documents/two-threaded.html#减少-setdata-数据传输量",
          "content": "减少 setData 数据传输量仅传输视图层使用到的数据，其他 JS 环境用到的数据存放到 data 对象外。\n合理利用局部更新。setData 是支持使用 数据路径 的方式对对象的局部字段进行更新，我们可能会遇到这样的场景：list 列表是从后台获取的数据，并展示在页面上，当 list 列表的第一项数据的 src 字段需要更新时，一般情况下我们会从后台获取新的 list 列表，执行 setData 更新整个 list 列表。\n// 后台获取列表数据const list = requestSync(); \n\n// 更新整个列表\nthis.setData({ list });\n实际上，只有个别字段需要更新时，我们可以这么写来避免整个 list 列表更新:// 后台获取列表数据const list = requestSync(); \n\n// 局部更新列表\nthis.setData({ \n  'list[0].src': list[0].src\n});\n"
        },
        {
          "title": "降低 setData 执行频率",
          "url": "/documents/two-threaded.html#降低-setdata-执行频率",
          "content": "降低 setData 执行频率在不影响业务流程的前提下，将多个 setData 调用合并执行，减少线程间通信频次。当需要在频繁触发的用户事件(如 PageScroll 、 Resize 事件)中调用 setData ，合理的利用 函数防抖(debounce) 和 函数节流(throttle) 可以减少 setData 执行次数。函数防抖（debounce）：函数在触发n秒后才执行一次，如果在n秒内重复触发函数，则重新计算时间。\n函数节流（throttle）：单位时间内，只会触发一次函数，如果同一个单位时间内触发多次函数，只会有一次生效。\n除了让开发者自觉遵循规则来减少 setData 数据传输量和执行频率之外，我们还可以自己设计一个 diff 算法，重新对 setData 进行封装，使得在 setData 执行之前，让待更新的数据与原 data 数据做 diff 对比，计算出数据差异 patch 对象，判断 patch 对象是否为空，如果为空则跳过执行更新，否则再将 patch 对象执行 setData 操作，从而达到减少数据传输量和降低执行 setData 频率的目的。// setData重新封装成新的方法，使得数据更新前先对新旧数据做diff对比，再执行setData方法this.update = (data) => {\n    return new Promise((resolve, reject) => {\n        const result = diff(data, this.data);\n        if (!Object.keys(result).length) {\n            resolve(null);\n            return;\n        } \n        this.setData(result, () => {\n            resolve(result);\n        });\n    });\n}\n具体流程如下图："
        },
        {
          "title": "善用自定义组件",
          "url": "/documents/two-threaded.html#善用自定义组件",
          "content": "善用自定义组件小程序自定义组件的实现是由小程序官方设计的 Exparser 框架所支持，框架实现的自定义组件的组件模型与 Web Components 标准的 Shadow DOM 相似：在页面引用自定义组件后，当初始化页面时，Exparser 会在创建页面实例的同时，也会根据自定义组件的注册信息进行组件实例化，然后根据组件自带的 data 数据和组件WXML，构造出独立的 Shadow Tree ，并追加到页面 Composed Tree 。创建出来的 Shadow Tree 拥有着自己独立的逻辑空间、数据、样式环境及setData调用：基于自定义组件的 Shadow DOM 模型设计，我们可以将页面中一些需要高频执行 setData 更新的功能模块（如倒计时、进度条等）封装成自定义组件嵌入到页面中。当这些自定义组件视图需要更新时，执行的是组件自己的 setData ，新旧节点树的对比计算和渲染树的更新都只限于组件内有限的节点数量，有效降低渲染时间开销。下图是我们在微保小程序WeDrive首页中，将倒计时模块抽取自定义组件前后的setData更新耗时对比：从图中可以看出，使用自定义组件后，倒计时模块 setData 平均渲染耗时有了非常明显的下降，实际在低端安卓机中体验会感觉明显的更流畅。当然，并不是使用自定义组件越多会越好，页面每新增一个自定义组件， Exparser 需要多管理一个组件实例，内存消耗会更大，当内存占用上升到一定程度，有可能导致 iOS 将部分 WKWebView 回收，安卓机体验会变得更加卡顿。因此要合理的使用自定义组件，同时页面设计也要注意不滥用标签。总结小程序双线程架构决定了数据通信优化会是性能优化中一个比较重要的点。而上述提到的几个优化建议只是优化渲染性能中的一部分，要想让你的页面体验变得更加丝滑，就要熟悉小程序框架的底层原理，根据小程序框架的特点，编写出“合身”的前端代码。"
        }
      ]
    },
    {
      "title": "常见问题",
      "content": "暂时不支持 redux,请使用 React.getApp().globalData 来在页面间交换数据\nrender 里面不能定义变量,即不能出现 var, const, let 语句。render() 里只能使用 JSX 来描述结构，不能使用 React.createElement()。\n组件必须定义在 components 中\n为什么底部不出现 TabBar？ 这是小程序自身的 BUG，详见这里\n路由跳转时，如何拿到当前路径与参数，原来是通过 onLoad 方法拿，现在你可以通过任何一个页面组件的生命周期钩子，访问 this.props，里面就有 path 与 query 属性\n静态资源统一放到 src 目录下的 assets 目录下\nwxml 模板部分，如果使用了箭头函数，那么它里面不能出现 this 关键字\n不要在 props, state, context 里面放 JSX，因为 JSX 的结构容易出现环引用，导到微信小程序内部的 JSON.stringify 出错\ninput组件 统一使用onChange事件，因为有的平台支持onInput, 有的平台支持onChange, 转译器会翻译相应支持的事件\n业务有涉及拿globalData.systemInfo里面高度的，改为React.api.getSystemInfoSync()。第一次进入页面有底bar的话 高度会拿错，导致业务液面高度计算错误，下面空一块。\nReact.getCurrentPage() 能得到当前页面的react实例， instance.props.query, instance.props.path为当前路径与参数对象\n更多问题请到 GitHub 提 Issue。\n",
      "url": "/documents/questions.html",
      "children": []
    },
    {
      "title": "关于",
      "content": "此项目由 Qunar.com 提供支持。大约从11月份开始，我们切换到branch3开发，正式启动自定义组件机制实现nanachi的组件机制原来master上使用 template标签来编写组件，它其实规避了许多问题，因为4大小程序的自定义组件机制都各有不同，template则是兼容成本最低的方案。但是用template标签编写组件，其实那不是组件，对于小程序来说就是视图片段。换言之，一个页面只有一个组件，而这个组件的数据则是非常庞大。果不其然，它在支付宝小程序的IOS8/9中因为性能问题挂掉，只好匆匆启动后备方案简单回顾一下四大小程序的模板\n  \n    \n       获取头像昵称 \n    \n    \n      \n         {{el.title}}\n      \n    \n  \n\n\n\n\n  \n   \n      获取头像昵称 \n    \n    \n      \n         {{el.title}}\n      \n    \n  \n\n\n\n\n  \n    \n       获取头像昵称 \n    \n    \n      \n         {{el.title}}\n      \n    \n  \n\n\n\n\n  \n    \n     \n       \n          获取头像昵称\n       \n      \n      \n        \n          {{el.title}}\n        \n      \n    \n  \n\n\n\n\n  \n    \n       获取头像昵称 \n    \n      \n         {{el.title}}\n      \n    \n  \n\n\n从模板来看，其实差别不大，改一下属性名，每个公司都想通过它们来标识自己的存在。但内部实现完全不一样，因为\b源码并没有公开或者混淆了。使用自定义组件机制的风险就比标签大很多。 BAT三公司都暴露了一个Component入口函数，让你传入一个配置对象实现组件机制，而以小米为首的快应用则是内部走vue，没有Component这个方法，只需你export一个配置对象。//微信Component({\n  data: {},\n  lifetimes: {//钩子必须放在lifetimes\n    created(){},//拿不到实例的UUID\n    attached(){},//钩子触发顺序与元素在文档位置一致\n    dettached(){}\n  },\n  methods: {//事件句柄必须放在methods\n    onClick(){}\n  }\n})\n//支付宝\nComponent({\n  data: {},\n  //没有与created对应的didCreate/willMount钩子\n  didMount(){},//能拿到实例的UUID\n  didUpdate(){},//钩子触发顺序是随机的\n  didUnmount(){},\n  methods: {\n    onClick(){}\n  }\n})\n//支付宝 生命周期V2\nComponent({\n  data: {},\n  onInit(){},//对应 react constructor， 只可以读取 this.props 设置 this.data 或调用 this.setData/$spliceData 修改 已有data\n  deriveDataFromProps(props){},//对应 react getDerivedStateFromProps，只可以调用 this.setData/$spliceData 修改 data\n  didMount(){},//对应 react componentDidMount\n  didUpdate(){},//对应 react componentDidUpdate\n  didUnmount(){},//对应 react componentWillUnmount\n  methods: {\n    onClick(){}\n  }\n})\n\n//百度\nComponent({\n  data: {},\n  created(){},//应该是微信自定义组件的早期格式，没有lifetimes，methods\n  attached(){},//拿不到实例的UUID\n  dettached(){},//钩子触发顺序与元素在文档位置一致\n  onClick(){}\n})\n//小米（快应用都是由小米提供技术方案）\nexport {\n   props: {},//基本与百度差不多\n   onInit(){},\n   onReady(){},\n   onDestroy(){},\n   onClick(){}\n}\n//头条小程序\nComponent({\n  data: {},\n  created(){},//拿不到实例的UUID\n  attached(){},//钩子触发顺序与元素在文档位置一致\n  dettached(){}\n  methods: {//事件句柄必须放在methods\n    onClick(){}\n  }\n})\n从内部实现来看，BAT 都是走迷你React虚拟DOM， 快应用走迷你 vue虚拟DOM， 但支付宝的实现不好，钩子的触发顺序是随机的。因此在非随机的三种中，我们内部有一个迷你React, anu，产生的组件实例放进一个队列中，而BTM （百度，微信，小米）的created/onInit钩子再逐个再出来，执行setData实现视图的更新。而支付宝需要在编译层，为每个自定义组件标签添加一个UUID ，然后在didMount匹配取出。//anu onBeforeRender(fiber){\n   var type = fiber.type;\n   var reactInstances = type.reactInstances;\n   var instance = fiber.stateNode;\n   if(!instance.wx && reactInstances){\n     reactInstances.push(instance)\n   }\n}\n\n//BTM的created/onReady  \ncreated(){\n   var reactInstances = type.reactInstances;\n   var reactInstance = reactInstances.shift();\n   reactInstance.wx = this;\n   this.reactInstance = reactInstance;\n   updateMiniApp(reactInstance)\n}\n\n//支付宝  \ndidMount(){\n  var reactInstances = type.reactInstances;\n  var uid = this.props.instanceUid;\n  for (var i = reactInstances.length - 1; i >= 0; i--) {\n      var reactInstance = reactInstances[i];\n      if (reactInstance.instanceUid === uid) {\n          reactInstance.wx = this;\n          this.reactInstance = reactInstance;\n          updateMiniApp(reactInstance);\n          reactInstances.splice(i, 1);\n          break;\n      }\n  }\n}\n\n其实如果一个页面的数据量不大，template标签实现的组件机制比自定义组件的性能要好，自定义组件标签会对用户的属性根据props配置项进行过滤，还要传入slot，启动构造函数等等。但数据量大，自定义组件机制由于能实现局部更新，性能就反超了。但支付宝是个例，由于它延迟到在didMount钩子才更新数据，即视图出来了又要刷新视图，比其他小程序多了一次rerender与伴随而来的reflow。快应用就更麻烦些，主要有以下问题\n快应用要求像vue那样三种格式都放在同一个文件中，但script标签是无法export出任何东西，于是我只好将组件定义单独拆到另一个文件， 才搞定引用父类的问题。\n\n\n快应用在标签的使用上更为严格，文本节点必须放在a, span, text, option这4种标签中，实际上span的使用限制还严厉些，于是我们在编译时，只用到a, text, option。而a是对标BAT的navigator，因此一般也用不到。\n\n\n最大的问题是对CSS支持太差，比如说不支持display: block, display: line, 不支持浮动，不支持相对绝对定位，不支持.class1.class2的写法……\n\n\nAPI也比BAT的API少这么多东西，兼容起来非常吃力。\n\n",
      "url": "/documents/about.html",
      "children": [
        {
          "title": "娜娜奇提供的核心组件及他们对应的关系，核心的技术内幕",
          "url": "/documents/about.html#娜娜奇提供的核心组件及他们对应的关系，核心的技术内幕",
          "content": "娜娜奇提供的核心组件及他们对应的关系，核心的技术内幕娜娜奇主要分为两大部分， 编译期的转译框架， 统一将以React为技术栈的工程转换为各种小程序认识的文件与结构转译框架又细分为4部分， react组件转译器，es6转译器， 样式转译器及各种辅助用的helpers.运行时的底层框架与补丁组件， 底层框架为ReactWx, ReactBu, ReactAli, ReactQuick,分别对标微信，百度，支付宝小程序及快应用，因为官方React的size太大，并没有适用的钩子机制，让我们在渲染前将数据传给原生组件进行\nsetData() (setData是小程序实例更新视图的核心方法)，因此我们基于我们早已成熟的迷你React框架anu进行一下扩展\n去掉DOM渲染层，加上各种对应的渲染层，从而形成 对应的React.补丁组件是指， 小程序都自带一套UI组件，它们存在一些无法抹平的差异或在个别平台直接没有这个组件，我们需要用原生的view ,text等基础组件元素封装成缺省组件，比如Icon, Button, Navigator."
        },
        {
          "title": "娜娜奇的目录结构以及对应的工程规范，cli以及发布打包，如何控制size",
          "url": "/documents/about.html#娜娜奇的目录结构以及对应的工程规范，cli以及发布打包，如何控制size",
          "content": "娜娜奇的目录结构以及对应的工程规范，cli以及发布打包，如何控制size娜娜奇的目录结构以微信的标准为蓝图，大概分为app.js, pages目录， components目录，针对我们的业务，还添加了commons目录与assets目录。app.js是全工程的配置，以react组件形式呈现， 全局共享对象，全局的分享函数都在这实例上\npages目录 放所有页面组件， 组件在index.js中， 这里目录存在层次\ncomponents目录 放所有有视图的业务组件， 组件在index.js中， 这里的目录只有两层， components/ComponentName/index.js\nindex.js 要exports与目录名同名的类名\ncommons目录 放所有没有视图的业务组件，没有文件名与目录名的限制，\n但希望每个业务线的组件都放在与业务线同名的目录下\nassets目录， 放静态资源\napp.js pages目录，components目录会应用react转译器与样式转译器， commons目录应用es6转译器，assets目录应用样式转译器直观的效果见 这里的两个图cli 命令见 这里build后的大小 见开发工具的预览"
        },
        {
          "title": "娜娜奇提供的重要功能组件和模块，如何帮助开发者做到快速开发",
          "url": "/documents/about.html#娜娜奇提供的重要功能组件和模块，如何帮助开发者做到快速开发",
          "content": "娜娜奇提供的重要功能组件和模块，如何帮助开发者做到快速开发提供了 @react, @components，@assets这几个别名，用法如import React from '@react' 这样在很深的目录下，大家就不需要\nimport React from '../../../../ReactAli'这样写\n@components指向components目录\n@assets 则用在css, sass, less文件中指向assets目录React.getApp(), React.getCurrentPage()方便大家得到当前APP配置对象与页面组件的实例React.api 将对所有平台的上百个API进行抹平，API是wx, swan, my这几个对象，它们里面提供了访问底层的能力如通信录，电池，音量，地理信息, 上传下载，手机型号信息等一大堆东西React.api 里的所有异步方法，都Promise化，方便大家直接用es7 的async ,await语法样式转译器，帮用户处理样式表中的rpx/px之间的转换。"
        },
        {
          "title": "为了保证跨平台，设计娜娜奇技术方案的重要原则和开发规范，哪些不支持",
          "url": "/documents/about.html#为了保证跨平台，设计娜娜奇技术方案的重要原则和开发规范，哪些不支持",
          "content": "为了保证跨平台，设计娜娜奇技术方案的重要原则和开发规范，哪些不支持所有接口访问必须 使用React.api的方法，不要直接在wx, swan, my对象中取React组件的只有render方法才能使用JSX，它们需要遵守一下规范，详见这里样式方面，为了兼容快应用，布局统一使用flexbox, 不能使用display:block/inline, float,position:absolute/relative"
        },
        {
          "title": "娜娜奇如何和原生小程序兼容，以及其他有用的辅助功能或者工具",
          "url": "/documents/about.html#娜娜奇如何和原生小程序兼容，以及其他有用的辅助功能或者工具",
          "content": "娜娜奇如何和原生小程序兼容，以及其他有用的辅助功能或者工具娜娜奇不与某一种原生小程序兼容，因为它要照顾4种小程序如果你的目录名，样式不符合规范，我们在转译阶段会给出友好提示快应用的文本节点要求放在text, a, option, label下，娜娜奇会在编译阶段自动对没有放在里面的文本包一个text标签页面配置对象的许多配置项（如tabBar, titBar的配置参数，页面背景参数）， 我们也进行了抹平，用户只需要以微信方式写，我们自动转换为各个平台对应的名字，在快应用中，是没有tabBar, 我们直接让每个页面组件继承了一个父类，父类里面\n有tabBar, 令它长得与其他小程序一模一样"
        }
      ]
    }
  ],
  "已兼容处理的API": [
    {
      "title": "API",
      "content": "",
      "url": "/apis/index.html",
      "children": [
        {
          "title": "概述",
          "url": "/apis/index.html#概述",
          "content": "概述\n\nAPI\n类型\n说明\n\n\n\n\nReact.createElement\n内部 API\n创建元素, 由于只允许你使用JSX，因此无法使用\n\n\nReact.cloneElement\n内部 API\n复制元素, 由于只允许你使用JSX，因此无法使用\n\n\nReact.createFactory\n内部 API\n包装组件, 由于只允许你使用JSX，因此无法使用\n\n\nReact.createRef\n \n不存在\n\n\nReact.forwardRef\n \n不存在\n\n\nReact.api\n \n相当于微信的 wx, 支付宝小程序的 my，百度小程的 swan, 字节跳动的tt, QQ小程序的qq, 为了方便编译，请不要在业务代码中直接用 wx,要用 React.api\n\n\nReact.getApp\n \n相当于微信的 getApp\n\n\nReact.Component\n \n所有组件的基类\n\n\nReact.useComponent\n内部 API\n用来创建组件\n\n\nReact.getCurrentPage\n\n得到当前页面的react实例， instance.props.query, instance.props.path为当前路径与参数对象\n\n\nReact.toClass\n内部 API\n用来转译 es6 类\n\n\nReact.toStyle\n内部 API\n用来转译样式\n\n\nReact.registerPage\n内部 API\n页面组件会自动在底部添加这方法\n\n\nReact.registerComponent\n内部 API\n通用组件会自动在底部添加这方法\n\n\nonShow\n页面组件的生命周期钩子\n\n\n\nonHide\n页面组件的生命周期钩子\n\n\n\nonPageScroll\n页面组件的事件\n监听用户滑动页面事件\n\n\nonShareAppMessage/onShare\n页面组件的事件\n用于返回分享的内容,建议改用onShare\n\n\nonReachBottom\n页面组件的事件\n监听用户上拉触底事件\n\n\nonPullDownRefresh\n页面组件的事件\n监听用户下拉刷新事件\n\n\ncomponentWillMount\n组件的生命周期钩子\n相当于小程序的onLoad  props 中有 path, query 等路由相关信息\n\n\ncomponentWillUpdate\n组件的生命周期钩子\n没有对应的小程序生命周期钩子\n\n\ncomponentDidMount\n组件的生命周期钩子\n相当于小程序的onReady\n\n\ncomponentDidUpdate\n组件的生命周期钩子\n没有对应的小程序生命周期钩子\n\n\ncomponentWillUnmount\n组件的生命周期钩子\n相当于小程序的onUnload\n\n\ncomponentWillRecieveProps\n组件的生命周期钩子\n\n\n\nshouldComponentUpdate\n组件的生命周期钩子\n\n\n\ncomponentDidCatch\n组件的生命周期钩子\n\n\n\ngetChildContext\n组件的方法\n\n\n\nsetState\n组件的方法\n更新页面\n\n\nforceUpdate\n组件的方法\n更新页面\n\n\nrefs\n组件实例上的对象\n里面保存着子组件的实例（由于没有 DOM，对于普通标签来说， 虽然也能保存着它的虚拟 DOM )\n\n\nrender\n组件的方法\n里面必须使用 JSX ，其他方法不能存在 JSX，不能显式使用 createElement\n\n\n"
        }
      ]
    },
    {
      "title": "网络",
      "content": "",
      "url": "/apis/network.html",
      "children": [
        {
          "title": "request",
          "url": "/apis/network.html#request",
          "content": "request支付宝： 向指定服务器发起一个跨域 http 请求， 微信： 发起 HTTPS 网络请求参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n\n是\n开发者服务器接口地址\n都支持\n\n\nheader\n\bObject\n\n否\n设置请求的 header，header 中不能设置 Referer。 微信默认值： content-type 默认为 application/json 支付宝是 application/x-www-form-urlencoded\n都支持\n\n\nmethod\nString\nGET\n否\nHTTP 请求方法\n都支持\n\n\ndata\nObject\n\n否\n请求的参数\n都支持\n\n\ndataType\nString\njson\n否\n返回的数据格式\n都支持\n\n\nresponseType\nString\ntext\n否\n响应的数据类型\n微信\n\n\ntimeout\nNumber\n30000\n否\n超时时间\n支付宝\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n\nobject.success 回调函数Object res\n\n属性\n类型\n描述\n\n\n\n\ndata\nstring\n响应数据，格式取决于请求时的 dataType 参数\n\n\nstatusCode\nNumber\n开发者服务器返回的 HTTP 状态码\n\n\nheader\nObject\n开发者服务器返回的 HTTP Response Header\n\n\n"
        },
        {
          "title": "uploadFile(Object object)",
          "url": "/apis/network.html#uploadfileobject-object",
          "content": "uploadFile(Object object)将本地资源上传到开发者服务器参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n\n是\n开发者服务器接口地址\n都支持\n\n\nfilePath\n\bString\n\n是\n要上传文件资源的路径\n都支持\n\n\nname\nString\n\n是\n文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容\n都支持\n\n\nheader\nObject\n\n否\nHTTP 请求 Header，Header 中不能设置 Referer\n都支持\n\n\nformData\nObject\n\n否\nHTTP 请求中其他额外的 form data\n都支持\n\n\nfileType\nString\n\n是\n文件类型，image / video / audio\n支付宝\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n\ngetRawResult\nfunction\n\n否\n用于获取原始的uploadTask对象，上面可以添加进度回调\n\n\n\nobject.success 回调函数Object res\n\n属性\n类型\n描述\n\n\n\n\ndata\nstring\n响应数据，格式取决于请求时的 dataType 参数\n\n\nstatusCode\nNumber\n开发者服务器返回的 HTTP 状态码\n\n\n"
        },
        {
          "title": "downloadFile(Object object)",
          "url": "/apis/network.html#downloadfileobject-object",
          "content": "downloadFile(Object object)下载文件资源到本地注意：请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。\n参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n\n是\n下载资源的 url\n都支持\n\n\nheader\n\bObject\n\n否\nHTTP 请求的 Header，Header 中不能设置 Referer\n都支持\n\n\nfilePath\nString\n\n否\n指定文件下载后存储的路径\n微信\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n\ngetRawResult\nfunction\n\n否\n用于获取原始的uploadTask对象，上面可以添加进度回调\n\n\n\nobject.success 回调函数Object res\n\n属性\n类型\n描述\n\n\n\n\ntempFilePath\nstring\n临时文件路径。如果没传入 filePath 指定文件存储路径，则下载后的文件会存储到一个临时文件\n\n\nstatusCode\nNumber\n开发者服务器返回的 HTTP 状态码\n\n\n"
        },
        {
          "title": "connectSocket(Object object)",
          "url": "/apis/network.html#connectsocketobject-object",
          "content": "connectSocket(Object object)创建一个 WebSocket 的连接；一个支付宝小程序同时只能保留一个 WebSocket 连接，如果当前已存在 WebSocket 连接，会自动关闭该连接，并重新创建一个新的 WebSocket 连接。（微信： 1.7.0 及以上版本，最多可以同时存在 5（小游戏）/2（小程序）个 WebSocket 连接。百度：1.9.4以上支持多个WebSockcet连接）参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n\n是\n开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名。\n都支持\n\n\nheader\n\bObject\n\n否\nHTTP 请求的 Header，Header 中不能设置 Referer\n都支持\n\n\nprotocols\nArray. string\n\n否\n子协议数组\n微信\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n"
        },
        {
          "title": "onSocketOpen(function callback)",
          "url": "/apis/network.html#onsocketopenfunction-callback",
          "content": "onSocketOpen(function callback)监听 WebSocket 连接打开事件参数function callbackWebSocket 连接打开事件的回调函数React.api.connectSocket({  url: 'test.php'\n});\n\nReact.api.onSocketOpen(function(res) {\n  console.log('WebSocket 连接已打开！');\n});\n"
        },
        {
          "title": "closeSocket(Object object)",
          "url": "/apis/network.html#closesocketobject-object",
          "content": "closeSocket(Object object)关闭 WeSocket 连接参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ncode\nnumber\n1000（表示正常关闭连接）\n否\n一个数字值表示关闭连接的状态号，表示连接被关闭的原因。\n微信\n\n\nreason\n\bstring\n\n否\n一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。\n微信\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n\n"
        },
        {
          "title": "sendSocketMessage(Object object)",
          "url": "/apis/network.html#sendsocketmessageobject-object",
          "content": "sendSocketMessage(Object object)通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ndata\nstring/ArrayBuffer\n\n是\n需要发送的内容\n都支持\n\n\nisBuffer\n\bBoolean\n\n否\n如果需要发送二进制数据，需要将入参数据经 base64 编码成 String 后赋值 data，同时将此字段设置为true，否则如果是普通的文本内容 String，不需要设置此字段\n支付宝\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n\n"
        },
        {
          "title": "onSocketMessage(function callback)",
          "url": "/apis/network.html#onsocketmessagefunction-callback",
          "content": "onSocketMessage(function callback)监听WebSocket 接受到服务器的消息事件参数function callbackWebSocket 接受到服务器的消息事件的回调函数object.success 回调函数Object res\n\n属性\n类型\n描述\n\n\n\n\ndata\nstring/ArrayBuffer\n服务器返回的消息\n\n\n"
        },
        {
          "title": "onSocketError(function callback)",
          "url": "/apis/network.html#onsocketerrorfunction-callback",
          "content": "onSocketError(function callback)监听WebSocket 错误事件参数function callbackWebSocket 错误事件的回调函数"
        },
        {
          "title": "onSocketClose(function callback)",
          "url": "/apis/network.html#onsocketclosefunction-callback",
          "content": "onSocketClose(function callback)监听WebSocket 连接关闭事件参数function callbackWebSocket 连接关闭事件的回调函数"
        }
      ]
    },
    {
      "title": "交互",
      "content": "",
      "url": "/apis/interaction.html",
      "children": [
        {
          "title": "showModal(Object object)",
          "url": "/apis/interaction.html#showmodalobject-object",
          "content": "showModal(Object object)显示模态对话框参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ntitle\nstring\n\n是\n提示的标题\n都支持\n\n\ncontent\nstring\n\n是\n提示的内容\n都支持\n\n\nshowCancel\nboolean\ntrue\n否\n是否 \b 显示取消按钮\n微信,百度,快应用\n\n\ncancelText\nstring\n'取消'\n否\n取消 \b 按钮的文字，最多 4 个 \b 字符\n都支持\n\n\ncancelColor\nstring\n#000000\n否\n取消按钮的文字颜色，必须是 16 进制格式的颜色字符串\n微信, 快应用\n\n\nconfirmText\nstring\n'确定'\n否\n确定 \b 按钮的文字，最多 4 个 \b 字符\n都支持\n\n\nconfirmColor\nstring\n#3cc51f，百度为#3c76ff\n否\n确认按钮的文字颜色，必须是 16 进制格式的颜色字符串\n微信，百度, 块应用\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\nobject.success 回调函数参数Object res\n\n属性\n类型\n说明\n支持平台\n\n\n\n\nconfirm\nbooleam\n为 true 时，表示用户点击了确定按钮\n都支持\n\n\n代码示例React.api.showModal({  title: '温馨提示',\n  content: '您是否想查询快递单号:1234567890',\n  confirmText: '马上查询',\n  cancelText: '暂不需要',\n  success: result => {\n    console.log('result', result);\n  }\n});\n"
        },
        {
          "title": "showToast(Object object)",
          "url": "/apis/interaction.html#showtoastobject-object",
          "content": "showToast(Object object)显示一个弱提示，可选择多少秒之后消失参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ntitle\nstring\n\n是\n提示的内容\n都支持\n\n\nicon\nstring\n微信，百度：success，支付：none\n否\n图标\n都支持\n\n\nimage\nstring\n\n否\n自定义图标的本地路径，image 的优先级高于 icon\n微信，百度\n\n\nduration\nnumber\n微信： 1500， 支付宝，百度： 2000\n否\n提示的延迟时间\n都支持\n\n\nmask\nboolean\nfalse\n否\n是否显示透明蒙层，防止触摸穿透\n微信，百度\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n代码示例React.api.showToast({  icon: 'success',\n  title: '操作成功',\n  duration: 3000,\n  success: () => {}\n});\n"
        },
        {
          "title": "hideToast()",
          "url": "/apis/interaction.html#hidetoast",
          "content": "hideToast()"
        },
        {
          "title": "showLoading(Object object)",
          "url": "/apis/interaction.html#showloadingobject-object",
          "content": "showLoading(Object object)显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ntitle\nstring\n\n是\n提示的内容\n都支持\n\n\nmask\nboolean\nfalse\n否\n是否显示透明蒙层，防止触摸穿透\n微信，百度\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n代码示例React.api.showLoading({  title: '加载中...'\n});\n"
        },
        {
          "title": "hideLoading()",
          "url": "/apis/interaction.html#hideloading",
          "content": "hideLoading()"
        },
        {
          "title": "showActionSheet(Object object)",
          "url": "/apis/interaction.html#showactionsheetobject-object",
          "content": "showActionSheet(Object object)参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nitemList\nArray string\n\n是\n按钮的文字数组，数组长度最大为 6\n都支持\n\n\nitemColo\nstring\n#000000，百度为#3c76ff\n否\n按钮的文字颜色\n微信，百度\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n代码示例React.api.showActionSheet({  title: '支付宝-ActionSheet',\n  itemList: ['菜单一', '菜单二', '菜单三', '菜单四', '菜单五'],\n  success: res => {\n    const btn = res.index === -1 ? '取消' : '第' + res.index + '个';\n  }\n});\n"
        }
      ]
    },
    {
      "title": "路由跳转",
      "content": "在小程序中，我们建议使用React.api.navigateTo/redirectTo 来代替标签\n",
      "url": "/apis/router.html",
      "children": [
        {
          "title": "navigateTo(OBJECT)",
          "url": "/apis/router.html#navigatetoobject",
          "content": "navigateTo(OBJECT)保留当前页面，跳转到应用内的某个页面，使用 wx.navigateBack 可以返回到原页面。OBJECT 参数说明：\n\n参数\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n是\n需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n代码示例React.api.navigateTo({    url: '/pages/xxx/index?key=value'\n});\n//test.jsPage({\n  componentDidMount: function(option) {\n    console.log(option.query);\n  }\n});\nTips: 目前页面路径最多只能十层，百度为5层。\n"
        },
        {
          "title": "redirectTo(OBJECT)",
          "url": "/apis/router.html#redirecttoobject",
          "content": "redirectTo(OBJECT)关闭当前页面，跳转到应用内的某个页面。OBJECT 参数说明：\n\n参数\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n是\n需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n代码示例React.api.redirectTo({  url: 'pages/test/index?id=1'\n});\n"
        },
        {
          "title": "reLaunch(OBJECT)",
          "url": "/apis/router.html#relaunchobject",
          "content": "reLaunch(OBJECT)关闭所有页面，打开到应用内的某个页面。OBJECT 参数说明：\n\n参数\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n是\n需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n代码示例  React.api.reLaunch({    url: 'pages/test/index?id=1'\n  });\n//test.jsPage({\n  componentDidMount: function(option) {\n    console.log(option.query);\n  }\n});\n"
        },
        {
          "title": "navigateBack(OBJECT)",
          "url": "/apis/router.html#navigatebackobject",
          "content": "navigateBack(OBJECT)关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。OBJECT 参数说明：\n\n参数\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ndelta\nnumber\n1\n是\n返回的页面数，如果 delta 大于现有页面数，则返回到首页\n都支持\n\n\n代码示例// 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码\n// 此处是A页面\nReact.api.navigateTo({\n  url:'pages/B/index?id=1'\n});\n\n// 此处是B页面\nReact.api.navigateTo({\n  url: 'pages/C/index?id=1'\n});\n\n// 在C页面内 navigateBack，将返回A页面\nReact.api.navigateBack({\n  delta: 2\n});\n微信小程序的switchTab存在兼容问题，不能用于快应用\n"
        }
      ]
    },
    {
      "title": "设置导航条",
      "content": "",
      "url": "/apis/nav-bar.html",
      "children": [
        {
          "title": "setNavigationBarTitle(OBJECT)",
          "url": "/apis/nav-bar.html#setnavigationbartitleobject",
          "content": "setNavigationBarTitle(OBJECT)动态设置当前页面的标题\n\n参数\n类型\n是否必须\n说明\n支持平台\n\n\n\n\ntitle\nstring\n是\n页面标题\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n"
        },
        {
          "title": "setNavigationBarColor(OBJECT)",
          "url": "/apis/nav-bar.html#setnavigationbarcolorobject",
          "content": "setNavigationBarColor(OBJECT)OBJECT 参数说明：\n\n参数\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nbackgroundColor\nstring\n是\n背景颜色值，有效值为十六进制颜色\n都支持\n\n\nfrontColor\nstring\n\n前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000\n微信，百度\n\n\nborderBottomColor\nstring\n否\n导航栏底部边框颜色，支持十六进制颜色值。若设置了 backgroundColor，则borderBottomColor 不会生效，默认会和 backgroundColor 颜色一样\n支付宝\n\n\nreset\nboolean\n否\n是否重置导航栏为支付宝默认配色，默认 false\n支付宝\n\n\nanimation\nObject\n否\n动画效果\n微信，百度\n\n\nanimation.duration\nNumber\n否\n动画变化时间，默认0，单位：毫秒\n微信，百度\n\n\nanimation.timingFunc\nString\n否\n动画变化方式，默认 linear\n支付宝\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n"
        },
        {
          "title": "showNavigationBarLoading()",
          "url": "/apis/nav-bar.html#shownavigationbarloading",
          "content": "showNavigationBarLoading()在当前页面显示导航条加载动画。"
        },
        {
          "title": "hideNavigationBarLoading()",
          "url": "/apis/nav-bar.html#hidenavigationbarloading",
          "content": "hideNavigationBarLoading()隐藏导航条加载动画。"
        }
      ]
    },
    {
      "title": "TabBar",
      "content": "",
      "url": "/apis/api.html",
      "children": [
        {
          "title": "switchTab(OBJECT)",
          "url": "/apis/api.html#switchtabobject",
          "content": "switchTab(OBJECT)跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面OBJECT 参数说明：\n\n参数\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nurl\nstring\n是\n需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n代码示例// app.json{\n  \"tabBar\": {\n    \"list\": [{\n      \"pagePath\": \"index\",\n      \"text\": \"首页\"\n    },{\n      \"pagePath\": \"other\",\n      \"text\": \"其他\"\n    }]\n  }\n}\nReact.api.switchTab({  url: '/index'\n})\n\n"
        }
      ]
    },
    {
      "title": "动画",
      "content": "",
      "url": "/apis/animation.html",
      "children": [
        {
          "title": "createAnimation(Object object)",
          "url": "/apis/animation.html#createanimationobject-object",
          "content": "createAnimation(Object object)创建一个动画实例 animation。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性。React.api.createAnimation 不支持快应用。快应用既没有提供获取元素长宽位置信息的API，也没有修改元素长宽位置的能力\nOBJECT 参数说明：\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nduration\nnumber\n400\n否\n动画持续时间，单位 ms\n都支持\n\n\ntimingFunction\nstring\n'linear'\n否\n动画的效果\n微信,支付宝\n\n\ndelay\nnumber\n0\n否\n动画延迟时间，单位 ms\n都支持\n\n\ntransformOrigin\nstring\n百度为‘50% 50% 0’\n否\n设置transform-origin\n都支持\n\n\ntimingFunction 的合法值：\n\n值\b\n说明\n\n\n\n\n'linear'\n动画从头到尾的速度是相同的\n\n\n'ease'\n动画以低速开始，然后加快，在结束前变慢\n\n\n'ease-in'\n动画以低速开始\n\n\n'ease-in-out'\n动画以低速开始和结束\n\n\n'ease-out'\n动画以低速结束\n\n\n'step-start'\n动画第一帧就跳至结束状态直到结束\n\n\n'step-end'\n动画一直保持开始状态，最后一帧跳到结束状态\n\n\n"
        },
        {
          "title": "animation",
          "url": "/apis/animation.html#animation",
          "content": "animation样式：\n\n方法\n参数\n说明\n\n\n\n\nopacity\nvalue\n透明度，参数范围 0~1\n\n\nbackgroundColor\ncolor\n颜色值\n\n\nwidth\nlength\n如果传入 number 则默认使用 px，可传入其他自定义单位的长度值\n\n\nheight\nlength\n同上\n\n\ntop\nlength\n同上\n\n\nleft\nlength\n同上\n\n\nbottom\nlength\n同上\n\n\nright\nlength\n同上\n\n\n旋转：\n\n方法\n参数\n说明\n\n\n\n\nrotate\ndeg\ndeg 范围 -180 ~ 180，从原点顺时针旋转一个 deg 角度\n\n\nrotateX\ndeg\ndeg 范围 -180 ~ 180，在 X 轴旋转一个 deg 角度\n\n\nrotateY\ndeg\ndeg 范围 -180 ~ 180，在 Y 轴旋转一个 deg 角度\n\n\nrotateZ\ndeg\ndeg 范围 -180 ~ 180，在 Z 轴旋转一个deg角度\n\n\nrotate3d\n(x, y , z, deg)\n同 transform-function rotate3d。\n\n\n缩放：\n\n方法\n参数\n说明\n\n\n\n\nscale\nsx,[sy]\n只有一个参数时，表示在 X 轴、Y 轴同时缩放 sx 倍；两个参数时表示在 X 轴缩放 sx 倍，在 Y 轴缩放 sy 倍\n\n\nscaleX\nsx\n在 X 轴缩放 sx 倍\n\n\nscaleY\nsy\n在 Y 轴缩放 sy 倍\n\n\nscaleZ\nsz\n在 Z 轴缩放 sy 倍\n\n\nscale3d\n(sx,sy,sz)\n在 X 轴缩放 sx 倍，在 Y 轴缩放sy 倍，在 Z 轴缩放 sz 倍\n\n\n偏移：\n\n方法\n参数\n说明\n\n\n\n\ntranslate\ntx,[ty]\n只有一个参数时，表示在 X 轴偏移 tx；两个参数时，表示在 X 轴偏移 tx，在 Y 轴偏移 ty，单位均为 px。\n\n\ntranslateX\ntx\n在 X 轴偏移 tx，单位 px\n\n\ntranslateY\nty\n在 Y 轴偏移 tx，单位 px\n\n\ntranslateZ\ntz\n在 Z 轴偏移 tx，单位 px\n\n\ntranslate3d\n(tx,ty,tz)\n在 X 轴偏移 tx，在 Y 轴偏移t y，在Z轴偏移 tz，单位 px\n\n\n倾斜：\n\n方法\n参数\n说明\n\n\n\n\nskew\nax,[ay]\n参数范围 -180 ~ 180。只有一个参数时，Y 轴坐标不变，X 轴坐标延顺时针倾斜 ax 度；两个参数时，分别在 X 轴倾斜 ax 度，在 Y 轴倾斜 ay 度\n\n\nskewX\nax\n参数范围 -180 ~ 180。Y 轴坐标不变，X 轴坐标延顺时针倾斜 ax度\n\n\nskewY\nay\n在参数范围 -180~180。X 轴坐标不变，Y 轴坐标延顺时针倾斜 ay 度\n\n\n矩阵变形:\n\n方法\n参数\n说明\n\n\n\n\nmatrix\n(a,b,c,d,tx,ty)\n 同transform-function matrix \n\n\nmatrix3d\nax\n 同transform-function matrix3d \n\n\n"
        },
        {
          "title": "动画队列",
          "url": "/apis/animation.html#动画队列",
          "content": "动画队列调用动画操作方法后需要要调用 step() 来表示一组动画完成，在一组动画中可以调用任意多个动画方法，一组动画中的所有动画会同时开始，当一组动画完成后才会进行下一组动画。step() 可以传入一个跟 my.createAnimation() 一样的配置参数用于指定当前组动画的配置。"
        },
        {
          "title": "Animation.step(Object object)",
          "url": "/apis/animation.html#动画队列-animation.stepobject-object",
          "content": "Animation.step(Object object)OBJECT 参数说明：\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nduration\nnumber\n400\n否\n动画持续时间，单位 ms\n都支持\n\n\ntimingFunction\nstring\n'linear'\n否\n动画的效果\n微信\n\n\ndelay\nnumber\n0\n否\n动画延迟时间，单位 ms\n都支持\n\n\ntransformOrigin\nstring\n\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n50% 50% 0\n否\n设置transform-origin\n都支持\n\n\ntimingFunction 的合法值：\n\n值\b\n说明\n\n\n\n\n'linear'\n动画从头到尾的速度是相同的\n\n\n'ease'\n动画以低速开始，然后加快，在结束前变慢\n\n\n'ease-in'\n动画以低速开始\n\n\n'ease-in-out'\n动画以低速开始和结束\n\n\n'ease-out'\n动画以低速结束\n\n\n'step-start'\n动画第一帧就跳至结束状态直到结束\n\n\n'step-end'\n动画一直保持开始状态，最后一帧跳到结束状态\n\n\n    showModal\n\n    var animation = React.api.createAnimation();    animation.rotate(90).translateY(10).step();\n    animation.rotate(-90).translateY(-10).step();\n        this.setState({\n            animation: animation.export()\n        });\n"
        }
      ]
    },
    {
      "title": "画布",
      "content": "",
      "url": "/apis/canvas.html",
      "children": [
        {
          "title": "createCanvasContext(canvasId)",
          "url": "/apis/canvas.html#createcanvascontextcanvasid",
          "content": "createCanvasContext(canvasId)const ctx = React.api.createCanvasContext('myCanvas', this);  // 在快应用中this必须添加Tips: 快应用 canvas API\n调用的时间是在 onShow  绘制图片， 如果是 组件的话在componentDidMount 中延迟 300 ms\nsetShadow 没有这个属性\ncreateCircularGradient   创建圆形渐变属性没有\ncanvasToTempFilePath   把当前画布指定区域的内容导出生成指定大小的图片  该方法没有\n创建 canvas 绘图上下文该绘图上下文只作用于对应 canvasId 的 \n入参\n\n参数\n类型\n说明\n\n\n\n\ncanvasId\nString\n定义在 上的 id\n\n\n返回值CanvasContext"
        },
        {
          "title": "CanvasContext.setTextAlign(string align)",
          "url": "/apis/canvas.html#canvascontext.settextalignstring-align",
          "content": "CanvasContext.setTextAlign(string align)设置文字的对齐入参\n\n参数\n类型\n说明\n\n\n\n\ntextAlign\nString\n枚举 \"left\" \"right\" \"center\" \"start\" \"end\"\n\n\n示例代码：  componentDidMount() {    const ctx = React.api.createCanvasContext('myCanvas');\n\n    ctx.setStrokeStyle('red');\n    ctx.moveTo(150, 20);\n    ctx.lineTo(150, 170);\n    ctx.stroke();\n\n    ctx.setFontSize(15);\n    ctx.setTextAlign('left');\n    ctx.fillText('textAlign=left', 150, 60);\n\n    ctx.setTextAlign('center');\n    ctx.fillText('textAlign=center', 150, 80);\n\n    ctx.setTextAlign('right');\n    ctx.fillText('textAlign=right', 150, 100);\n\n    ctx.draw();\n\n  }\n  render() {\n    return (\n      \n        \n      \n    );\n  }\n"
        },
        {
          "title": "CanvasContext.setTextBaseline(string textBaseline)",
          "url": "/apis/canvas.html#canvascontext.settextbaselinestring-textbaseline",
          "content": "CanvasContext.setTextBaseline(string textBaseline)设置文字的竖直对齐入参\n\n参数\n类型\n说明\n\n\n\n\ntextBaseline\nString\n枚举 \"top\" \"hanging\" \"middle\" \"alphabetic\" \"ideographic\" \"bottom\"\n\n\n"
        },
        {
          "title": "CanvasContext.setFillStyle(string color)",
          "url": "/apis/canvas.html#canvascontext.setfillstylestring-color",
          "content": "CanvasContext.setFillStyle(string color)设置填充色。默认颜色为 black。入参\n\n参数\n类型\n说明\n\n\n\n\ncolor\nColor\nGradient Object\n\n\n"
        },
        {
          "title": "CanvasContext.setStrokeStyle(string color)",
          "url": "/apis/canvas.html#canvascontext.setstrokestylestring-color",
          "content": "CanvasContext.setStrokeStyle(string color)设置描边颜色。默认颜色为 black。入参\n\n参数\n类型\n说明\n\n\n\n\ncolor\nColor\nGradient Object\n\n\n"
        },
        {
          "title": "CanvasContext.setShadow(number offsetX, number offsetY, number blur, string color)",
          "url": "/apis/canvas.html#canvascontext.setshadownumber-offsetx,-number-offsety,-number-blur,-string-color",
          "content": "CanvasContext.setShadow(number offsetX, number offsetY, number blur, string color)设定阴影样式如果没有设置，offsetX 默认值为 0， offsetY 默认值为 0， blur 默认值为 0，color 默认值为 black。\n入参\n\n参数\n类型\n范围\n说明\n\n\n\n\noffsetX\nNumber\n\n阴影相对于形状水平方向的偏移\n\n\noffsetY\nNumber\n\n阴影相对于形状竖直方向的偏移\n\n\nblur\nNumber\n0~100\n阴影的模糊级别，值越大越模糊\n\n\ncolor\nColor\n\n阴影颜色\n\n\n"
        },
        {
          "title": "CanvasContext.createLinearGradient(number x0, number y0, number x1, number y1)",
          "url": "/apis/canvas.html#canvascontext.createlineargradientnumber-x0,-number-y0,-number-x1,-number-y1",
          "content": "CanvasContext.createLinearGradient(number x0, number y0, number x1, number y1)创建一个线性的渐变颜色需要使用 addColorStop() 来指定渐变点，至少需要两个。\n\n\n参数\n类型\n说明\n\n\n\n\nx0\nNumber\n起点 x 坐标\n\n\ny0\nNumber\n起点 y 坐标\n\n\nx1\nNumber\n终点 x 坐标\n\n\ny1\nNumber\n终点 y 坐标\n\n\n代码示例：const ctx = React.api.createCanvasContext('awesomeCanvas');\nconst grd = ctx.createLinearGradient(10, 10, 150, 10);\ngrd.addColorStop(0, 'yellow');\ngrd.addColorStop(1, 'blue');\n\nctx.setFillStyle(grd);\nctx.fillRect(20, 20, 250, 180);\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.createCircularGradient(number x0, number y0, number x1, number y1)",
          "url": "/apis/canvas.html#canvascontext.createcirculargradientnumber-x0,-number-y0,-number-x1,-number-y1",
          "content": "CanvasContext.createCircularGradient(number x0, number y0, number x1, number y1)创建一个圆形的渐变颜色需要使用 addColorStop() 来指定渐变点，至少需要两个。\n\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n圆心 x 坐标\n\n\ny\nNumber\n圆心 y 坐标\n\n\nr\nNumber\n圆半径\n\n\n代码示例：const ctx = React.api.createCanvasContext('awesomeCanvas');\nconst grd = ctx.createCircularGradient(90, 60, 60);\ngrd.addColorStop(0, 'blue');\ngrd.addColorStop(1, 'red');\n\nctx.setFillStyle(grd);\nctx.fillRect(20, 20, 250, 180);\nctx.draw();\n"
        },
        {
          "title": "CanvasGradient.addColorStop(number stop, string color)",
          "url": "/apis/canvas.html#canvasgradient.addcolorstopnumber-stop,-string-color",
          "content": "CanvasGradient.addColorStop(number stop, string color)创建一个颜色的渐变点。小于最小 stop 的部分会按最小 stop 的 color 来渲染，大于最大 stop 的部分会按最大 stop 的 color 来渲染。\n需要使用 addColorStop() 来指定渐变点，至少需要两个\n\n\n参数\n类型\n说明\n\n\n\n\nstop\nNumber\n表示渐变点在起点和终点中的位置，范围 0 ～ 1\n\n\ncolor\nColor\n渐变点颜色\n\n\n"
        },
        {
          "title": "CanvasContext.setLineWidth(number lineWidth)",
          "url": "/apis/canvas.html#canvascontext.setlinewidthnumber-linewidth",
          "content": "CanvasContext.setLineWidth(number lineWidth)设置线条的宽度\n\n参数\n类型\n说明\n\n\n\n\nlineWidth\nNumber\n线条宽度，单位为 px\n\n\n"
        },
        {
          "title": "CanvasContext.setLineCap(string lineCap)",
          "url": "/apis/canvas.html#canvascontext.setlinecapstring-linecap",
          "content": "CanvasContext.setLineCap(string lineCap)设置线条的端点样式\n\n参数\n类型\n说明\n\n\n\n\nlineCap\nString\n线条的结束端点样式\n\n\nlineCap 的合法值\n\n值\n说明\n\n\n\n\nbutt\n向线条的每个末端添加平直的边缘\n\n\nround\n向线条的每个末端添加圆形线帽\n\n\nsquare\n向线条的每个末端添加正方形线帽\n\n\n"
        },
        {
          "title": "CanvasContext.setLineJoin(string lineJoin)",
          "url": "/apis/canvas.html#canvascontext.setlinejoinstring-linejoin",
          "content": "CanvasContext.setLineJoin(string lineJoin)设置线条的交点样式入参\n\n参数\n类型\n说明\n\n\n\n\nlineJoin\nString\n线条的结束端点样式\n\n\nlineJoin 的合法值\n\n值\n说明\n\n\n\n\nbevel\n斜角\n\n\nround\n圆角\n\n\nmiter\n尖角\n\n\n"
        },
        {
          "title": "CanvasContext.setMiterLimit(number miterLimit)",
          "url": "/apis/canvas.html#canvascontext.setmiterlimitnumber-miterlimit",
          "content": "CanvasContext.setMiterLimit(number miterLimit)设置最大斜接长度，斜接长度指的是在两条线交汇处内角和外角之间的距离。 当 setLineJoin() 为 miter 时才有效。超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示入参\n\n参数\n类型\n说明\n\n\n\n\nmiterLimit\nNumber\n最大斜接长度\n\n\n"
        },
        {
          "title": "CanvasContext.rect(number x, number y, number width, number height)",
          "url": "/apis/canvas.html#canvascontext.rectnumber-x,-number-y,-number-width,-number-height",
          "content": "CanvasContext.rect(number x, number y, number width, number height)创建一个矩形路径。入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n矩形左上角的 x 坐标\n\n\ny\nNumber\n矩形左上角的 y 坐标\n\n\nwidth\nNumber\n矩形路径宽度\n\n\nheight\nNumber\n矩形路径宽度\n\n\n"
        },
        {
          "title": "CanvasContext.fillRect(number x, number y, number width, number height)",
          "url": "/apis/canvas.html#canvascontext.fillrectnumber-x,-number-y,-number-width,-number-height",
          "content": "CanvasContext.fillRect(number x, number y, number width, number height)填充一个矩形入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n矩形左上角的 x 坐标\n\n\ny\nNumber\n矩形左上角的 y 坐标\n\n\nwidth\nNumber\n矩形路径宽度\n\n\nheight\nNumber\n矩形路径宽度\n\n\n"
        },
        {
          "title": "CanvasContext.strokeRect(number x, number y, number width, number height)",
          "url": "/apis/canvas.html#canvascontext.strokerectnumber-x,-number-y,-number-width,-number-height",
          "content": "CanvasContext.strokeRect(number x, number y, number width, number height)画一个矩形(非填充)入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n矩形左上角的 x 坐标\n\n\ny\nNumber\n矩形左上角的 y 坐标\n\n\nwidth\nNumber\n矩形路径宽度\n\n\nheight\nNumber\n矩形路径宽度\n\n\n代码示例：const ctx = React.api.createCanvasContext('awesomeCanvas');ctx.setStrokeStyle('blue');\nctx.strokeRect(20, 20, 250, 80);\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.clearRect(number x, number y, number width, number height)",
          "url": "/apis/canvas.html#canvascontext.clearrectnumber-x,-number-y,-number-width,-number-height",
          "content": "CanvasContext.clearRect(number x, number y, number width, number height)清除画布上在该矩形区域内的内容入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n矩形左上角的 x 坐标\n\n\ny\nNumber\n矩形左上角的 y 坐标\n\n\nwidth\nNumber\n矩形路径宽度\n\n\nheight\nNumber\n矩形路径宽度\n\n\n代码示例：  componentDidMount() {    const ctx = React.api.createCanvasContext('myCanvas');\n    ctx.setFillStyle('red');\n    ctx.fillRect(0, 0, 150, 200);\n    ctx.setFillStyle('blue');\n    ctx.fillRect(150, 0, 150, 200);\n    ctx.clearRect(10, 10, 150, 75);\n    ctx.draw();\n  }\n  render() {\n    return (\n      \n        \n      \n    );\n  }\n"
        },
        {
          "title": "CanvasContext.fill()",
          "url": "/apis/canvas.html#canvascontext.fill",
          "content": "CanvasContext.fill()对当前路径中的内容进行填充。默认的填充色为黑色。如果当前路径没有闭合，fill() 方法会将起点和终点进行连接，然后填充。代码示例：const ctx = React.api.createCanvasContext('myCanvas');ctx.moveTo(10, 10);\nctx.lineTo(100, 10);\nctx.lineTo(100, 100);\nctx.fill();\nctx.draw();\nfill() 填充的的路径是从 beginPath() 开始计算，但是不会将 fillRect() 包含进去。代码示例：const ctx = React.api.createCanvasContext('myCanvas');// begin path\nctx.rect(10, 10, 100, 30);\nctx.setFillStyle('yellow');\nctx.fill();\n\n// begin another path\nctx.beginPath();\nctx.rect(10, 40, 100, 30);\n\n// only fill this rect, not in current path\nctx.setFillStyle('blue');\nctx.fillRect(10, 70, 100, 30);\n\nctx.rect(10, 100, 100, 30);\n\n// it will fill current path\nctx.setFillStyle('red');\nctx.fill();\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.stroke()",
          "url": "/apis/canvas.html#canvascontext.stroke",
          "content": "CanvasContext.stroke()画出当前路径的边框，默认颜色色为黑色。代码示例：const ctx = React.api.createCanvasContext('myCanvas');ctx.moveTo(10, 10);\nctx.lineTo(100, 10);\nctx.lineTo(100, 100);\nctx.stroke();\nctx.draw();\nstroke() 描绘的的路径是从 beginPath() 开始计算，但是不会将 strokeRect() 包含进去。代码示例：const ctx = React.api.createCanvasContext('myCanvas');// begin path\nctx.rect(10, 10, 100, 30);\nctx.setStrokeStyle('yellow');\nctx.stroke();\n\n// begin another path\nctx.beginPath();\nctx.rect(10, 40, 100, 30);\n\n// only stoke this rect, not in current path\nctx.setStrokeStyle('blue');\nctx.strokeRect(10, 70, 100, 30);\n\nctx.rect(10, 100, 100, 30);\n\n// it will stroke current path\nctx.setStrokeStyle('red');\nctx.stroke();\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.beginPath()",
          "url": "/apis/canvas.html#canvascontext.beginpath",
          "content": "CanvasContext.beginPath()开始创建一个路径，需要调用 fill 或者 stroke 才会使用路径进行填充或描边"
        },
        {
          "title": "CanvasContext.closePath()",
          "url": "/apis/canvas.html#canvascontext.closepath",
          "content": "CanvasContext.closePath()关闭一个路径关闭路径会连接起点和终点\n如果关闭路径后没有调用 fill() 或者 stroke() 并开启了新的路径，那之前的路径将不会被渲染。\n代码示例：const ctx = React.api.createCanvasContext('myCanvas');ctx.moveTo(10, 10);\nctx.lineTo(100, 10);\nctx.lineTo(100, 100);\nctx.closePath();\nctx.stroke();\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.moveTo(number x, number y)",
          "url": "/apis/canvas.html#canvascontext.movetonumber-x,-number-y",
          "content": "CanvasContext.moveTo(number x, number y)把路径移动到画布中的指定点，不创建线条。入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n目标位置 x 坐标\n\n\ny\nNumber\n目标位置 y 坐标\n\n\n"
        },
        {
          "title": "CanvasContext.lineTo(number x, number y)",
          "url": "/apis/canvas.html#canvascontext.linetonumber-x,-number-y",
          "content": "CanvasContext.lineTo(number x, number y)lineTo 方法增加一个新点，然后创建一条从上次指定点到目标点的线。用 stroke() 方法来画线条\n入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n目标位置 x 坐标\n\n\ny\nNumber\n目标位置 y 坐标\n\n\n代码示例：const ctx = React.api.createCanvasContext('myCanvas');ctx.moveTo(10, 10);\nctx.rect(10, 10, 100, 50);\nctx.lineTo(110, 60);\nctx.stroke();\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.arc(number x, number y, number r, number sAngle, number eAngle, number counterclockwise)",
          "url": "/apis/canvas.html#canvascontext.arcnumber-x,-number-y,-number-r,-number-sangle,-number-eangle,-number-counterclockwise",
          "content": "CanvasContext.arc(number x, number y, number r, number sAngle, number eAngle, number counterclockwise)画一条弧线。入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n圆 x 坐标\n\n\ny\nNumber\n圆 y 坐标\n\n\nr\nNumber\n圆 半径\n\n\nsAngle\nNumber\n起始弧度，单位弧度（在 3 点钟方向）\n\n\neAngle\nNumber\n终止弧度\n\n\ncounterclockwise\nBoolean\n可选，指定弧度的方向是逆时针还是顺时针，默认为 false。\n\n\n代码示例：const ctx = React.api.createCanvasContext('myCanvas');// Draw coordinates\nctx.arc(100, 75, 50, 0, 2 * Math.PI);\nctx.setFillStyle('#EEEEEE');\nctx.fill();\n\nctx.beginPath();\nctx.moveTo(40, 75);\nctx.lineTo(160, 75);\nctx.moveTo(100, 15);\nctx.lineTo(100, 135);\nctx.setStrokeStyle('#AAAAAA');\nctx.stroke();\n\nctx.setFontSize(12);\nctx.setFillStyle('black');\nctx.fillText('0', 165, 78);\nctx.fillText('0.5*PI', 83, 145);\nctx.fillText('1*PI', 15, 78);\nctx.fillText('1.5*PI', 83, 10);\n\n// Draw points\nctx.beginPath();\nctx.arc(100, 75, 2, 0, 2 * Math.PI);\nctx.setFillStyle('lightgreen');\nctx.fill();\n\nctx.beginPath();\nctx.arc(100, 25, 2, 0, 2 * Math.PI);\nctx.setFillStyle('blue');\nctx.fill();\n\nctx.beginPath();\nctx.arc(150, 75, 2, 0, 2 * Math.PI);\nctx.setFillStyle('red');\nctx.fill();\n\n// Draw arc\nctx.beginPath();\nctx.arc(100, 75, 50, 0, 1.5 * Math.PI);\nctx.setStrokeStyle('#333333');\nctx.stroke();\n\nctx.draw();\n针对 arc(100, 75, 50, 0, 1.5 * Math.PI)的三个关键坐标如下：绿色: 圆心 (100, 75)\n红色: 起始弧度 (0)\n蓝色: 终止弧度 (1.5 * Math.PI)\n"
        },
        {
          "title": "CanvasContext.bezierCurveTo()",
          "url": "/apis/canvas.html#canvascontext.beziercurveto",
          "content": "CanvasContext.bezierCurveTo()创建三次方贝塞尔曲线路径。曲线的起始点为路径中前一个点。\n入参\n\n参数\n类型\n说明\n\n\n\n\ncp1x\nNumber\n第一个贝塞尔控制点 x 坐标\n\n\ncp1y\nNumber\n第一个贝塞尔控制点 y 坐标\n\n\ncp2x\nNumber\n第二个贝塞尔控制点 x 坐标\n\n\ncp2y\nNumber\n第二个贝塞尔控制点 y 坐标\n\n\nx\nNumber\n结束点 x 坐标\n\n\ny\nNumber\n结束点 y 坐标\n\n\n"
        },
        {
          "title": "CanvasContext.clip()",
          "url": "/apis/canvas.html#canvascontext.clip",
          "content": "CanvasContext.clip()clip() 方法从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。"
        },
        {
          "title": "CanvasContext.quadraticCurveTo(number cpx, number cpy, number x, number y)",
          "url": "/apis/canvas.html#canvascontext.quadraticcurvetonumber-cpx,-number-cpy,-number-x,-number-y",
          "content": "CanvasContext.quadraticCurveTo(number cpx, number cpy, number x, number y)创建二次贝塞尔曲线路径入参\n\n参数\n类型\n说明\n\n\n\n\ncpx\nNumber\n贝塞尔控制点 x 坐标\n\n\ncpy\nNumber\n贝塞尔控制点 y 坐标\n\n\nx\nNumber\n结束点 x 坐标\n\n\ny\nNumber\n结束点 y 坐标\n\n\n"
        },
        {
          "title": "CanvasContext.scale(number scaleWidth, number scaleHeight)",
          "url": "/apis/canvas.html#canvascontext.scalenumber-scalewidth,-number-scaleheight",
          "content": "CanvasContext.scale(number scaleWidth, number scaleHeight)在调用 scale() 方法后，之后创建的路径其横纵坐标会被缩放。多次调用 scale()，倍数会相乘。入参\n\n参数\n类型\n说明\n\n\n\n\nscaleWidth\nNumber\n横坐标缩放倍数 (1 = 100%，0.5 = 50%，2 = 200%)\n\n\nscaleHeight\nNumber\n纵坐标轴缩放倍数 (1 = 100%，0.5 = 50%，2 = 200%)\n\n\n代码示例：const ctx = React.api.createCanvasContext('myCanvas');ctx.strokeRect(10, 10, 25, 15);\nctx.scale(2, 2);\nctx.strokeRect(10, 10, 25, 15);\nctx.scale(2, 2);\nctx.strokeRect(10, 10, 25, 15);\n\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.rotate(number rotate)",
          "url": "/apis/canvas.html#canvascontext.rotatenumber-rotate",
          "content": "CanvasContext.rotate(number rotate)以原点为中心，原点可以用 translate() 方法修改。顺时针旋转当前坐标轴。多次调用 rotate()，旋转的角度会叠加。入参\n\n参数\n类型\n说明\n\n\n\n\nrotate\nNumber\n横旋转角度，以弧度计(degrees * Math.PI/180；degrees 范围为 0~360)\n\n\n"
        },
        {
          "title": "CanvasContext.translate(number x, number y)",
          "url": "/apis/canvas.html#canvascontext.translatenumber-x,-number-y",
          "content": "CanvasContext.translate(number x, number y)对当前坐标系的原点 (0, 0) 进行变换，默认的坐标系原点为页面左上角。入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n水平坐标平移量\n\n\ny\nNumber\n竖直坐标平移量\n\n\n"
        },
        {
          "title": "CanvasContext.setFontSize(number fontSize)",
          "url": "/apis/canvas.html#canvascontext.setfontsizenumber-fontsize",
          "content": "CanvasContext.setFontSize(number fontSize)设置字体的字号入参\n\n参数\n类型\n说明\n\n\n\n\nfontSize\nNumber\n字号\n\n\n"
        },
        {
          "title": "CanvasContext.fillText(string text, number x, number y, number maxWidth)",
          "url": "/apis/canvas.html#canvascontext.filltextstring-text,-number-x,-number-y,-number-maxwidth",
          "content": "CanvasContext.fillText(string text, number x, number y, number maxWidth)在画布上绘制被填充的文本入参\n\n参数\n类型\n说明\n\n\n\n\ntext\nString\n文本\n\n\nx\nNumber\n水平坐标平移量\n\n\ny\nNumber\n竖直坐标平移量\n\n\n"
        },
        {
          "title": "CanvasContext.drawImage(string imageResource, number dx, number dy, number dWidth, number dHeight, number sx, number sy, number sWidth, number sHeight)",
          "url": "/apis/canvas.html#canvascontext.drawimagestring-imageresource,-number-dx,-number-dy,-number-dwidth,-number-dheight,-number-sx,-number-sy,-number-swidth,-number-sheight",
          "content": "CanvasContext.drawImage(string imageResource, number dx, number dy, number dWidth, number dHeight, number sx, number sy, number sWidth, number sHeight)绘制图像到画布入参\n\n参数\n类型\n说明\n\n\n\n\nimageResource\nString\n\n\n\nx\nNumber\n图像左上角 x 坐标\n\n\ny\nNumber\n图像左上角 y 坐标\n\n\nwidth\nNumber\n图像宽度\n\n\nheight\nNumber\n图像高度\n\n\nsx\nNumber\n源图像的矩形选择框的左上角 X 坐标。\n\n\nsy\nNumber\n源图像的矩形选择框的左上角 Y 坐标。\n\n\nsWidth\nNumber\n源图像的矩形选择框的宽度\n\n\nsHeight\nNumber\n源图像的矩形选择框的高度\n\n\n"
        },
        {
          "title": "CanvasContext.setGlobalAlpha(number 透明度。范围)",
          "url": "/apis/canvas.html#canvascontext.setglobalalphanumber-透明度。范围",
          "content": "CanvasContext.setGlobalAlpha(number 透明度。范围)设置全局画笔透明度。入参\n\n参数\n类型\n范围\n说明\n\n\n\n\nalpha\nNumber\n0 ～ 1\n透明度，0 表示完全透明，1 表示不透明\n\n\n代码示例：const ctx = React.api.createCanvasContext('myCanvas');ctx.setFillStyle('red');\nctx.fillRect(10, 10, 150, 100);\nctx.setGlobalAlpha(0.2);\nctx.setFillStyle('blue');\nctx.fillRect(50, 50, 150, 100);\nctx.setFillStyle('yellow');\nctx.fillRect(100, 100, 150, 100);\n\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.setLineDash(Array. pattern, number offset)",
          "url": "/apis/canvas.html#canvascontext.setlinedasharray.-pattern,-number-offset",
          "content": "CanvasContext.setLineDash(Array. pattern, number offset)设置虚线的样式入参\n\n参数\n类型\n说明\n支持平台\n\n\n\n\nsegments\nArray\n透明度，0 表示完全透明，1 表示不透明\n都支持\n\n\noffset\nNumber\n虚线偏移量\n微信\n\n\n"
        },
        {
          "title": "CanvasContext.transform(number scaleX, number skewX, number skewY, number scaleY, number translateX, number translateY)",
          "url": "/apis/canvas.html#canvascontext.transformnumber-scalex,-number-skewx,-number-skewy,-number-scaley,-number-translatex,-number-translatey",
          "content": "CanvasContext.transform(number scaleX, number skewX, number skewY, number scaleY, number translateX, number translateY)使用矩阵多次叠加当前变换的方法，矩阵由方法的参数进行描述。你可以缩放、旋转、移动和倾斜上下文。入参\n\n参数\n类型\n说明\n\n\n\n\nscaleX\nString\n水平缩放\n\n\nskewX\nNumber\n水平倾斜\n\n\nskewY\nNumber\n垂直倾斜\n\n\nscaleY\nNumber\n垂直缩放\n\n\ntranslateX\nNumber\n水平移动\n\n\ntranslateX\nNumber\n垂直移动\n\n\n代码示例：const ctx = React.api.createCanvasContext('myCanvas');\nctx.rotate((45 * Math.PI) / 180);\nctx.setFillStyle('red');\nctx.fillRect(70, 0, 100, 30);\n\nctx.transform(1, 1, 0, 1, 0, 0);\nctx.setFillStyle('#000');\nctx.fillRect(0, 0, 100, 100);\n\nctx.draw();\n"
        },
        {
          "title": "CanvasContext.setTransform(number scaleX, number skewX, number skewY, number scaleY, number translateX, number translateY)",
          "url": "/apis/canvas.html#canvascontext.settransformnumber-scalex,-number-skewx,-number-skewy,-number-scaley,-number-translatex,-number-translatey",
          "content": "CanvasContext.setTransform(number scaleX, number skewX, number skewY, number scaleY, number translateX, number translateY)使用矩阵重新设置（覆盖）当前变换的方法入参\n\n参数\n类型\n说明\n\n\n\n\nscaleX\nString\n水平缩放\n\n\nskewX\nNumber\n水平倾斜\n\n\nskewY\nNumber\n垂直倾斜\n\n\nscaleY\nNumber\n垂直缩放\n\n\ntranslateX\nNumber\n水平移动\n\n\ntranslateX\nNumber\n垂直移动\n\n\n"
        },
        {
          "title": "CanvasContext.save()",
          "url": "/apis/canvas.html#canvascontext.save",
          "content": "CanvasContext.save()保存绘图上下文。"
        },
        {
          "title": "CanvasContext.restore()",
          "url": "/apis/canvas.html#canvascontext.restore",
          "content": "CanvasContext.restore()恢复之前保存的绘图上下文。"
        },
        {
          "title": "CanvasContext.draw(boolean reserve, function callback)",
          "url": "/apis/canvas.html#canvascontext.drawboolean-reserve,-function-callback",
          "content": "CanvasContext.draw(boolean reserve, function callback)将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。入参\n\n参数\n类型\n说明\n支持平台\n\n\n\n\nreserve\nBoolean\n非必填。本次绘制是否接着上一次绘制，即 reserve 参数为 false 时则在本次调用 drawCanvas绘制之前 native 层应先清空画布再继续绘制；若 reserver 参数为true 时，则保留当前画布上的内容，本次调用drawCanvas绘制的内容覆盖在上面，默认 false\n都支持\n\n\ncallback\nFunction\n绘制完成后执行的回调函数\n微信，百度\n\n\n"
        },
        {
          "title": "Object CanvasContext.measureText(string text)",
          "url": "/apis/canvas.html#object-canvascontext.measuretextstring-text",
          "content": "Object CanvasContext.measureText(string text)测量文本尺寸信息，目前仅返回文本宽度。同步接口。入参\n\n参数\n类型\n说明\n\n\n\n\ntext\nString\n必填。要测量的文本\n\n\n返回返回 TextMetrics 对象，结构如下：\n\n参数\n类型\n说明\n\n\n\n\nwidth\nNumber\n文本的宽度\n\n\n代码示例：const ctx = React.api.createCanvasContext('myCanvas');\nctx.font = 'italic bold 50px cursive';\nconst { width } = ctx.measureText('hello world');\nconsole.log(width);\n"
        },
        {
          "title": "CanvasContext.canvasToTempFilePath(OBJECT, this)",
          "url": "/apis/canvas.html#canvascontext.canvastotempfilepathobject,-this",
          "content": "CanvasContext.canvasToTempFilePath(OBJECT, this)把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路劲。在自定义组件下，第二个参数传入组件实例this，以操作组件内组件。入参\n\n参数\n类型\n说明\n\n\n\n\nx\nNumber\n画布 x 轴起点（默认 0 ）\n\n\ny\nNumber\n画布 y 轴起点（默认 0 ）\n\n\nwidth\nNumber\n画布宽度（默认为 canvas 宽度 -x）\n\n\nheight\nNumber\n画布高度（默认为 canvas 高度 -y）\n\n\ndestWidth\nNumber\n输出图片宽度（默认为 width * 屏幕像素密度）\n\n\ndestHeight\nNumber\n输出图片高度（默认为 height * 屏幕像素密度）\n\n\ncanvasId\nString\n画布标识，传入的 canvas-id\n\n\nfileType\nString\n目标文件的类型，只支持 ‘jpg’ 或 ‘png’，默认为 ‘png’ 。\n\n\nquality\nNumber\n图片的质量，取值范围为 (0, 1]，不在范围内时当作 1.0 处理 。\n\n\nsuccess\nFunction\n接口调用成功的回调函数\n\n\nfail\nFunction\n接口调用失败的回调函数\n\n\ncomplete\nFunction\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n在 draw 回调里调用该方法才能保证图片导出成功。示例代码：  React.api.canvasToTempFilePath({    x: 100,\n    y: 200,\n    width: 50,\n    height: 50,\n    destWidth: 100,\n    destHeight: 100,\n    canvasId: 'myCanvas',\n    success: function(res) {\n        console.log(res.tempFilePath)\n    }\n});\n"
        }
      ]
    },
    {
      "title": "键盘",
      "content": "",
      "url": "/apis/keyboard.html",
      "children": [
        {
          "title": "hideKeyboard",
          "url": "/apis/keyboard.html#hidekeyboard",
          "content": "hideKeyboard隐藏键盘入参\n\n参数\n类型\n说明\n支持平台\n\n\n\n\nsuccess\nFunction\n接口调用成功的回调函数\n微信\n\n\nfail\nFunction\n接口调用失败的回调函数\n微信\n\n\ncomplete\nFunction\n接口调用结束的回调函数（调用成功、失败都会执行）\n微信\n\n\n"
        }
      ]
    },
    {
      "title": "滚动",
      "content": "",
      "url": "/apis/scroll.html",
      "children": [
        {
          "title": "pageScrollTo(Object object)",
          "url": "/apis/scroll.html#pagescrolltoobject-object",
          "content": "pageScrollTo(Object object)将页面滚动到目标位置入参\n\n参数\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nscrollTop\nnumber\n\n是\n滚动到页面的目标位置，单位 px\n都支持\n\n\nduration\nnumber\n300\n否\n滚动动画的时长，单位 ms\n微信，百度\n\n\nsuccess\nFunction\n\n\n接口调用成功的回调函数\n微信\n\n\nfail\nFunction\n\n\n接口调用失败的回调函数\n微信\n\n\ncomplete\nFunction\n\n\n接口调用结束的回调函数（调用成功、失败都会执行）\n微信\n\n\n"
        }
      ]
    },
    {
      "title": "下拉刷新",
      "content": "",
      "url": "/apis/pulldown.html",
      "children": [
        {
          "title": "stopPullDownRefresh()",
          "url": "/apis/pulldown.html#stoppulldownrefresh",
          "content": "stopPullDownRefresh()停止当前页面下拉刷新。React.api.stopPullDownRefresh()"
        }
      ]
    },
    {
      "title": "节点查询",
      "content": "",
      "url": "/apis/select.html",
      "children": [
        {
          "title": "createSelectorQuery",
          "url": "/apis/select.html#createselectorquery",
          "content": "createSelectorQuery返回一个 SelectorQuery 对象实例。入参\n\n参数\n类型\n说明\n支持平台\n\n\n\n\nparams\nobject\n可以指定 page 属性，默认为当前页面\n\b 支付宝\n\n\n"
        },
        {
          "title": "NodesRef SelectorQuery.select(string selector)",
          "url": "/apis/select.html#nodesref-selectorquery.selectstring-selector",
          "content": "NodesRef SelectorQuery.select(string selector)选择当前第一个匹配选择器的节点，选择器支持 id 选择器以及 class 选择器.返回值NodesRefselector 语法selector 类似于 CSS 的选择器，但仅支持下列语法。ID 选择器：#the-id\nclass 选择器（可以连续指定多个）：.a-class.another-class\n子元素选择器：.the-parent > .the-child\n后代选择器：.the-ancestor .the-descendant\n跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant\n多选择器的并集：#a-node, .some-other-nodes\n"
        },
        {
          "title": "NodesRef SelectorQuery.selectAll()",
          "url": "/apis/select.html#nodesref-selectorquery.selectall",
          "content": "NodesRef SelectorQuery.selectAll()在当前页面下选择匹配选择器 selector 的所有节点。返回值NodesRef"
        },
        {
          "title": "NodesRef SelectorQuery.selectViewport()",
          "url": "/apis/select.html#nodesref-selectorquery.selectviewport",
          "content": "NodesRef SelectorQuery.selectViewport()选择显示区域，可用于获取显示区域的尺寸、滚动位置等信息。返回值NodesRef"
        },
        {
          "title": "SelectQuery NodesRef.boundingClientRect(function callback)",
          "url": "/apis/select.html#selectquery-nodesref.boundingclientrectfunction-callback",
          "content": "SelectQuery NodesRef.boundingClientRect(function callback)添加节点的布局位置的查询请求，相对于显示区域，以像素为单位。其功能类似于 DOM 的 getBoundingClientRect。返回 NodesRef 对应的 SelectorQuery。参数function callback回调函数，在执行 SelectQuery.exec 方法后，节点信息会在 callbacks 中返回。Object res\n\n属性\n类型\n说明\n\n\n\n\nid\nstring\n节点的 ID\n\n\ndataset\nObject\n节点的 dataset\n\n\nleft\nnumber\n节点的左边界坐标\n\n\nright\nnumber\n节点的右边界坐标\n\n\ntop\nnumber\n节点的上边界坐标\n\n\nbottom\nnumber\n节点的下边界坐标\n\n\nwidth\nnumber\n节点的宽度\n\n\nheight\nnumber\n节点的高度\n\n\n"
        },
        {
          "title": "SelectQuery NodesRef.scrollOffset(function callback)",
          "url": "/apis/select.html#selectquery-nodesref.scrolloffsetfunction-callback",
          "content": "SelectQuery NodesRef.scrollOffset(function callback)添加节点的滚动位置查询请求，以像素为单位。节点必须是 scroll-view 或者 viewport参数function callback回调函数，在执行 SelectQuery.exec 方法后，节点信息会在 callbacks 中返回。Object res\n\n属性\n类型\n说明\n\n\n\n\nid\nstring\n节点的 ID\n\n\ndataset\nObject\n节点的 dataset\n\n\nscrollLeft\nnumber\n节点的水平滚动位置\n\n\nscrollTop\nnumber\n节点的竖直滚动位置\n\n\n返回 NodesRef 对应的 SelectorQuery。"
        },
        {
          "title": "NodesRef SelectorQuery.exec(function callback)",
          "url": "/apis/select.html#nodesref-selectorquery.execfunction-callback",
          "content": "NodesRef SelectorQuery.exec(function callback)执行所有的请求，请求结果按请求次序构成数组，在 callback 的第一个参数中返回。代码示例：componentDidMount() {    React.api.createSelectorQuery()\n      .select('#non-exists').boundingClientRect()\n      .select('#one').boundingClientRect()\n      .selectAll('.all').boundingClientRect()\n      .select('#scroll').scrollOffset()\n      .selectViewport().boundingClientRect()\n      .selectViewport().scrollOffset().exec((ret) => {\n      console.log(JSON.stringify(ret, null, 2));\n    });\n  }\nrender() {\n    return (\n      \n        节点 all1\n\n        节点 all2\n\n        节点 one\n\n        \n          独立滚动区域\n        \n      \n    );\n  }\n结果 res：[  null,\n  {\n    \"x\": 1,\n    \"y\": 2,\n    \"width\": 1367,\n    \"height\": 18,\n    \"top\": 2,\n    \"right\": 1368,\n    \"bottom\": 20,\n    \"left\": 1\n  },\n  [\n    {\n      \"x\": 1,\n      \"y\": -34,\n      \"width\": 1367,\n      \"height\": 18,\n      \"top\": -34,\n      \"right\": 1368,\n      \"bottom\": -16,\n      \"left\": 1\n    },\n    {\n      \"x\": 1,\n      \"y\": -16,\n      \"width\": 1367,\n      \"height\": 18,\n      \"top\": -16,\n      \"right\": 1368,\n      \"bottom\": 2,\n      \"left\": 1\n    }\n  ],\n  {\n    \"scrollTop\": 0,\n    \"scrollLeft\": 0\n  },\n  {\n    \"width\": 1384,\n    \"height\": 360\n  },\n  {\n    \"scrollTop\": 35,\n    \"scrollLeft\": 0\n  }\n]\n"
        }
      ]
    },
    {
      "title": "图片",
      "content": "",
      "url": "/apis/image.html",
      "children": [
        {
          "title": "chooseImage(Object object)",
          "url": "/apis/image.html#chooseimageobject-object",
          "content": "chooseImage(Object object)从本地相册选择图片或使用相机拍照。参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ncount\nnumber\n微信、百度：9， 支付宝： 1\n否\n最多可以选择的图片张数\n都支持\n\n\nsourceType\nString Array\n['album', 'camera']\n否\n选择图片的来源\n都支持\n\n\nsizeType\nString Array\n['original', 'compressed']\n否\noriginal 原图，compressed 压缩图，默认二者都有\n微信\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\nsuccess 返回值\n\n字段\n类型\n说明\n支持平台\n\n\n\n\ntempFilePaths\nString Array\n图片的本地文件路径列表\n都支持\n\n\ntempFiles\nObject Array\n图片的本地文件列表，每一项是一个 File 对象。\n微信小程序>=1.2.0, 百度小程序\n\n\nObject res\n\n属性\n类型\n描述\n支持平台\n\n\n\n\ntempFilePaths\nStringArray\n图片的本地文件路径列表\n都支持\n\n\ntempFiles\nObjectArray\n图片的本地文件列表，每一项是一个 File 对象\n微信、百度\n\n\n  choose() {    React.api.chooseImage({\n      count: 2,\n      success: res => {\n        this.setState({\n          img: res.tempFilePaths\n        })\n      }\n    });\n  }\n\n  render() {\n    return (\n      \n        选择图片\n        {\n          this.state.img.map(function(item) {\n            return  \n          })\n        }\n\n      \n    );\n  }\n"
        },
        {
          "title": "previewImage(Object object)",
          "url": "/apis/image.html#previewimageobject-object",
          "content": "previewImage(Object object)预览图片参数\bObject object\n\n属性\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nurls\nArray\n是\n要预览的图片链接列表\n都支持\n\n\ncurrent\nString\n否\n当前显示图片的链接\t，urls 的第一张\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n React.api.previewImage({   current: 'http://xxxxxxx', // 当前显示图片链接\n   urls: [''], // 需要预览的图片http链接列表,\n   success: function(res) {\n      console.log('success', res);\n   },\n   fail: function (err) {\n      console.log('错误码：' + err.errCode);\n      console.log('错误信息：' + err.errMsg);\n   }\n});\n"
        },
        {
          "title": "saveImageToPhotosAlbum(Object object)",
          "url": "/apis/image.html#saveimagetophotosalbumobject-object",
          "content": "saveImageToPhotosAlbum(Object object)保存图片到系统相册参数\bObject object\n\n属性\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nfilePath\nstring\n是\n图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n"
        },
        {
          "title": "getImageInfo(Object object)",
          "url": "/apis/image.html#getimageinfoobject-object",
          "content": "getImageInfo(Object object)获取图片信息参数\bObject object\n\n属性\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nsrc\nstring\n是\n图片路径，目前支持：网络图片路径、apFilePath 路径、相对路径\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\nsuccess 返回值\n\n名称\n类型\n描述\n支持平台\n\n\n\n\nwidth\nNumber\n图片宽度（单位 px）\n都支持\n\n\nheight\nNumber\n图片高度（单位 px）\n都支持\n\n\npath\nstring\n图片的本地路径\n都支持\n\n\norientation\nstring\n拍照时设备方向\n微信\n\n\ntype\nstring\n图片格式\n微信\n\n\n"
        }
      ]
    },
    {
      "title": "缓存",
      "content": "",
      "url": "/apis/storage.html",
      "children": [
        {
          "title": "setStorage(Object object)",
          "url": "/apis/storage.html#setstorageobject-object",
          "content": "setStorage(Object object)将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容。参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nkey\nstring\n\n是\n本地缓存中指定的 key\n\n\ndata\nObject/string\n\n是\n需要存储的内容\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n代码示例React.api.setStorage({  key: 'key',\n  data: 'value',\n  success: function(res) {\n    console.log('success', res)\n  },\n  fail: function(err) {\n    console.log('fail', err)\n  }\n});\n"
        },
        {
          "title": "setStorageSync(string key, Object|string data)",
          "url": "/apis/storage.html#setstoragesyncstring-key,-object|string-data",
          "content": "setStorageSync(string key, Object|string data)wx.setStorage 的同步版本参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nkey\nstring\n\n是\n本地缓存中指定的 key\n\n\ndata\nObject/string\n\n是\n需要存储的内容\n\n\n代码示例React.api.setStorageSync('key','values');"
        },
        {
          "title": "getStorage",
          "url": "/apis/storage.html#getstorage",
          "content": "getStorage获取缓存数据。这是一个异步接口\n参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nkey\nstring\n\n是\n本地缓存中指定的 key\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nsuccess返回参数说明：\n\n参数\n类型\n说明\n\n\n\n\ndata\nstring\nkey 对应的内容\n\n\n代码示例React.api.getStorage({  key: 'key',\n  success: function (res) {\n    console.log(res.data);\n  },\n  fail: function (err) {\n    console.log('错误码：' + err.errCode);\n    console.log('错误信息：' + err.errMsg);\n  }\n});\n"
        },
        {
          "title": "getStorageSync(string key)",
          "url": "/apis/storage.html#getstoragesyncstring-key",
          "content": "getStorageSync(string key)同步获取缓存数据。参数String\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nkey\nstring\n\n是\n本地缓存中指定的 key\n\n\n代码示例：let res = React.api.getStorageSync('currentCity');console.log('res', res);\n快应用中使用 getStorageSync// app.js 添加如下代码 onGlobalLoad() {\n        let ANU_ENV = process.env.ANU_ENV;//wx ali bu quick\n        if(ANU_ENV === 'quick') {\n            React.api.initStorageSync(this.globalData.__storage);\n        }\n        \n    }\n"
        },
        {
          "title": "removeStorage(Object object)",
          "url": "/apis/storage.html#removestorageobject-object",
          "content": "removeStorage(Object object)从本地缓存中移除指定 key这是一个异步接口\n参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nkey\nstring\n\n是\n本地缓存中指定的 key\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n代码示例：React.api.removeStorage({  key: 'currentCity',\n  success: function() {\n    console.log('删除成功' );\n  }\n});\n"
        },
        {
          "title": "removeStorageSync(string key)",
          "url": "/apis/storage.html#removestoragesyncstring-key",
          "content": "removeStorageSync(string key)removeStorage 的同步版本。参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nkey\nstring\n\n是\n本地缓存中指定的 key\n\n\n代码示例：React.api.removeStorageSync({ key: 'currentCity' });"
        },
        {
          "title": "clearStorage(Object object)",
          "url": "/apis/storage.html#clearstorageobject-object",
          "content": "clearStorage(Object object)清理本地数据缓存参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n"
        },
        {
          "title": "clearStorageSync(Object object)",
          "url": "/apis/storage.html#clearstoragesyncobject-object",
          "content": "clearStorageSync(Object object)clearStorage 的同步版本"
        },
        {
          "title": "getStorageInfo(Object object)",
          "url": "/apis/storage.html#getstorageinfoobject-object",
          "content": "getStorageInfo(Object object)异步获取当前storage的相关信息参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数\n\n属性\n类型\n说明\n\n\n\n\nkeys\nArray. string\n当前 storage 中所有的 key\n\n\ncurrentSize\nnumber\n当前占用的空间大小, 单位 KB\n\n\nlimitSize\nnumber\n限制的空间大小，单位 KB\n\n\n"
        },
        {
          "title": "getStorageInfoSync(Object object)",
          "url": "/apis/storage.html#getstorageinfosyncobject-object",
          "content": "getStorageInfoSync(Object object)getStorageInfo 的同步版本返回值Object object\n\n属性\n类型\n说明\n\n\n\n\nkeys\nArray. string\n当前 storage 中所有的 key\n\n\ncurrentSize\nnumber\n当前占用的空间大小, 单位 KB\n\n\nlimitSize\nnumber\n限制的空间大小，单位 KB\n\n\n"
        }
      ]
    },
    {
      "title": "文件",
      "content": "",
      "url": "/apis/file.html",
      "children": [
        {
          "title": "getFileInfo(Object object) [快应用不支持]",
          "url": "/apis/file.html#getfileinfoobject-object-[快应用不支持]",
          "content": "getFileInfo(Object object) [快应用不支持]获取文件信息参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nfilePath\nstring\n\n是\n本地文件路径\n\n\ndigestAlgorithm\nstring\n'md5'\n否\n摘要算法，支持md5和sha1\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数\n\n属性\n类型\n说明\n\n\n\n\nsize\nnumber\n文件大小，以字节为单位\n\n\ndigest\nstring\n按照传入的 digestAlgorithm 计算得出的的文件摘要\n\n\n"
        },
        {
          "title": "getSavedFileInfo(Object object)",
          "url": "/apis/file.html#getsavedfileinfoobject-object",
          "content": "getSavedFileInfo(Object object)获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo() 接口。参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nfilePath\nstring\n\n是\n本地文件路径\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数\n\n属性\n类型\n说明\n\n\n\n\n\nsize\nnumber\n文件大小，以字节为单位\n都支持\n\n\ncreateTime\nnumber\n文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数\n都支持\n\n\nerrMsg\nString\n接口调用结果\n微信\n\n\n"
        },
        {
          "title": "getSavedFileList(Object object)",
          "url": "/apis/file.html#getsavedfilelistobject-object",
          "content": "getSavedFileList(Object object)获取该小程序下已保存的本地缓存文件列表参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数\n\n属性\n类型\n说明\n\n\n\n\nfileList\nArray.Object\n文件数组，每一项是一个 FileItem\n\n\nres.fileList 的结构\n\n属性\n类型\n说明\n\n\n\n\nfilePath\nstring\n本地路径\n\n\nsize\nnumber\n本地文件大小，以字节为单位\n\n\ncreateTime\nnumber\n文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数\n\n\n"
        },
        {
          "title": "removeSavedFile(Object object)",
          "url": "/apis/file.html#removesavedfileobject-object",
          "content": "removeSavedFile(Object object)删除本地缓存文件参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nfilePath\nstring\n\n是\n本地文件路径\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n"
        },
        {
          "title": "saveFile(Object object)",
          "url": "/apis/file.html#savefileobject-object",
          "content": "saveFile(Object object)保存文件到本地参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\ntempFilePath\nstring\n\n是\n需要保存的文件的临时路径\n\n\ndestinationFilePath\nstring\n\n是\n目标文件的uri, 快应用必须\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数\n\n属性\n类型\n说明\n\n\n\n\nsavedFilePath\nstring\n文件数组，每一项是一个 FileItem\n\n\n"
        }
      ]
    },
    {
      "title": "位置",
      "content": "",
      "url": "/apis/location.html",
      "children": [
        {
          "title": "getLocation(Object object)",
          "url": "/apis/location.html#getlocationobject-object",
          "content": "getLocation(Object object)获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。注：支付宝和微信小程序参数都不一致参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\ntype\nstring\nwgs84\n是\nwgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标\n微信小程序，百度小程序\n\n\naltitude\nstring\nfalse\n否\n传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度\n微信小程序>=1.6.0，百度小程序\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n微信小程序，百度小程序\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n微信小程序，百度小程序\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n微信小程序，百度小程序\n\n\nobject.success 回调函数参数Object res\n\n属性\n类型\n说明\n支持平台\n\n\n\n\nlatitude\nnumber\n纬度，范围为 -90~90，负数表示南纬\n微信小程序，百度小程序\n\n\nlongitude\nnumber\n经度，范围为 -180~180，负数表示西经\n微信小程序，百度小程序\n\n\nspeed\nnumber\n速度，单位 m/s\n微信小程序，百度小程序\n\n\naccuracy\nnumber\n位置的精确度\n微信小程序，百度小程序\n\n\naltitude\nnumber\n高度，单位 m\n微信小程序>= 1.2.0，百度小程序\n\n\nverticalAccuracy\nnumber\n垂直精度，单位 m（Android 无法获取，返回 0）\n微信小程序>= 1.2.0，百度小程序\n\n\nhorizontalAccuracy\nnumber\n水平精度，单位 m\n微信小程序>= 1.2.0，百度小程序\n\n\nstreet\nstring\n街道名称\n百度小程序\n\n\ncityCode\nstring\n城市编码\n百度小程序\n\n\ncity\nstring\n城市名称\n百度小程序\n\n\ncountry\nstring\n国家\n百度小程序\n\n\nprovince\nstring\n省份\n百度小程序\n\n\nstreetNumber\nstring\n街道号码\n百度小程序\n\n\ndistrict\nstring\n区\n百度小程序\n\n\n代码示例React.api.getLocation({  type: 'gcj02',\n  success: function (res) {\n     console.log('纬度：' + res.latitude);\n     console.log('经度：' + res.longitude);\n  },\n  fail: function (err) {\n     console.log('错误码：' + err.errCode);\n     console.log('错误信息：' + err.errMsg);\n  }\n})\n"
        },
        {
          "title": "openLocation(Object object)",
          "url": "/apis/location.html#openlocationobject-object",
          "content": "openLocation(Object object)内置地图查看位置参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nlongitude\nNumber\n\n是\n经度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系\n\n\nlatitude\nNumber\n\n是\n纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系\n\n\nscale\nNumber\n18\n否\n缩放比例，范围5~18\n\n\nname\nstring\n\n否\n位置名\n\n\naddress\nstring\n\n否\n地址的详细说明\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n代码示例React.api.getLocation({  type: 'gcj02',\n  success: function (res) {\n    React.api.openLocation({\n      latitude: res.latitude,\n      longitude: res.longitude,\n      scale: 18\n     })\n  },\n  fail: function (err) {\n    console.log('错误码：' + err.errCode);\n    console.log('错误信息：' + err.errMsg);\n  }\n});\n"
        },
        {
          "title": "chooseLocation(Object object)",
          "url": "/apis/location.html#chooselocationobject-object",
          "content": "chooseLocation(Object object)打开地图选择位置参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数Object res\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nname\nstring\n\n否\n位置名\n\n\naddress\nstring\n\n否\n地址的详细说明\n\n\nlongitude\nString\n\n是\n经度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系\n\n\nlatitude\nString\n\n是\n纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系\n\n\n"
        }
      ]
    },
    {
      "title": "分享",
      "content": "",
      "url": "/apis/share.html",
      "children": [
        {
          "title": "onShareAppMessage(Object)",
          "url": "/apis/share.html#onshareappmessageobject",
          "content": "onShareAppMessage(Object)在 Page 中定义 onShareAppMessage 函数，设置该页面的分享信息。每个 Page 页面的右上角菜单中默认会显示“分享”按钮，重写了 onShareAppMessage 函数，只是自定义分享内容\n用户点击分享按钮的时候会调用（ 组件 open-type=\"share\"）\n此事件需要 return 一个 Object，用于自定义分享内容。\n注意：只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮\nObject 参数说明\n\n参数\n类型\n说明\n支持平台\n\n\n\n\nfrom\nstring\n转发事件来源。button：页面内转发按钮；menu：右上角转发菜单\n都支持\n\n\ntarget\nObject\n如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined\n都支持\n\n\nwebViewUrl\nString\n页面中包含组件时，返回当前的 url\n微信\n\n\n此事件需要 return 一个 Object，用于自定义转发内容，返回内容如下：自定义转发内容\n\n字段\n是否必须\n说明\n支持平台\n\n\n\n\ntitle\n是\n自定义分享标题\n都支持\n\n\npath\n是\n转发路径 必须是以 / 开头的完整路径\n都支持\n\n\nimageUrl\n否\n自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及 JPG。显示图片长宽比是 5:4。\n都支持\n\n\ndesc\n否\n自定义分享描述最大长度 140 个字\n支付宝\n\n\ncontent\n否\n自定义吱口令文案，最多 28 个字符\n支付宝\n\n\nbgImgUrl\n否\n自定义分享二维码的背景图，建议大小 750*1350\n支付宝\n\n\nsuccess\n否\n分享成功后回调\n支付宝\n\n\nfail\n否\n分享失败后回调\n支付宝\n\n\n\b 示例代码：onShareAppMessage(res) {    if (res.from === 'button') {\n      // 来自页面内转发按钮\n      console.log(res.target);\n    }\n    return {\n      title: '小程序示例',\n      desc: '小程序官方示例Demo，展示已支持的接口能力及组件。',\n      path: 'pages/images/index'\n    };\n  }\n"
        },
        {
          "title": "hideShareMenu(Object object)",
          "url": "/apis/share.html#hidesharemenuobject-object",
          "content": "hideShareMenu(Object object)隐藏转发按钮参数\bObject object\n\n属性\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\n"
        }
      ]
    },
    {
      "title": "设备",
      "content": "",
      "url": "/apis/miniprogram.html",
      "children": [
        {
          "title": "振动",
          "url": "/apis/miniprogram.html#振动",
          "content": "振动"
        },
        {
          "title": "vibrateLong(Object object)",
          "url": "/apis/miniprogram.html#vibratelongobject-object",
          "content": "vibrateLong(Object object)使手机发生较长时间的振动（400 ms)参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n微信， 百度，支付宝\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n微信，百度，支付宝\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n微信， 百度，支付宝\n\n\n"
        },
        {
          "title": "vibrateShort(Object object)",
          "url": "/apis/miniprogram.html#vibrateshortobject-object",
          "content": "vibrateShort(Object object)参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n微信， 百度，支付宝\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n微信，百度，支付宝\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n微信， 百度，支付宝\n\n\n"
        },
        {
          "title": "电话",
          "url": "/apis/miniprogram.html#电话",
          "content": "电话"
        },
        {
          "title": "makePhoneCall(Object object)",
          "url": "/apis/miniprogram.html#makephonecallobject-object",
          "content": "makePhoneCall(Object object)参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n支持平台\n\n\n\n\nphoneNumber\nstring\n\n否\n需要拨打的电话号码\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n微信\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n\n"
        },
        {
          "title": "网络",
          "url": "/apis/miniprogram.html#网络",
          "content": "网络"
        },
        {
          "title": "getNetworkType(Object object)",
          "url": "/apis/miniprogram.html#getnetworktypeobject-object",
          "content": "getNetworkType(Object object)获取网络类型参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数Object res\n\n属性\n类型\n描述\n支持平台\n\n\n\n\nnetworkType\nstring\n网络类型值 unknown / NOTREACHABLE(支付宝) / WWAN(支付宝) / wifi / 3g / 2g / 4g / none(百度、微信)\n都支持\n\n\nnetworkAvailable\nNumber\n网络是否可用\n支付宝\n\n\n"
        },
        {
          "title": "onNetworkStatusChange(function callback)",
          "url": "/apis/miniprogram.html#onnetworkstatuschangefunction-callback",
          "content": "onNetworkStatusChange(function callback)监听网络状态变化事件参数function callback网络状态变化事件的回调函数object.success 回调函数Object res\n\n属性\n类型\n描述\n支持平台\n\n\n\n\nnetworkType\nstring\n网络类型值 unknown / NOTREACHABLE(支付宝) / WWAN(支付宝) / wifi / 3g / 2g / 4g / none(百度、微信)\n都支持\n\n\nisConnected\nboolean\n当前是否有网络链接\n都支持\n\n\n"
        },
        {
          "title": "剪切板",
          "url": "/apis/miniprogram.html#剪切板",
          "content": "剪切板"
        },
        {
          "title": "getClipboardData(Object object)",
          "url": "/apis/miniprogram.html#getclipboarddataobject-object",
          "content": "getClipboardData(Object object)获取系统剪贴板的内容参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nobject.success 回调函数Object res\n\n属性\n类型\n描述\n\n\n\n\ndata\nstring\n剪贴板的内容\n\n\n"
        },
        {
          "title": "setClipboardData(Object object)",
          "url": "/apis/miniprogram.html#setclipboarddataobject-object",
          "content": "setClipboardData(Object object)设置系统剪贴板的内容参数Object object\n\n属性\n类型\n默认值\n是否必须\n说明\n\n\n\n\ndata\nstring\n\n是\n剪贴板的内容\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n"
        },
        {
          "title": "屏幕",
          "url": "/apis/miniprogram.html#屏幕",
          "content": "屏幕"
        },
        {
          "title": "setKeepScreenOn(Object object)",
          "url": "/apis/miniprogram.html#setkeepscreenonobject-object",
          "content": "setKeepScreenOn(Object object)设置是否保持屏幕长亮状态。仅在当前小程序生效，离开小程序后失效。参数Object object\n\n参数\n类型\n默认值\n是否必须\n说明\n\n\n\n\nkeepScreenOn\nBoolean\n\n是\n是否保持屏幕长亮状态\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n"
        },
        {
          "title": "getScreenBrightness(Object object)",
          "url": "/apis/miniprogram.html#getscreenbrightnessobject-object",
          "content": "getScreenBrightness(Object object)获取屏幕亮度参数Object object\n\n参数\n类型\n默认值\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n"
        },
        {
          "title": "setScreenBrightness(OBJECT)",
          "url": "/apis/miniprogram.html#setscreenbrightnessobject",
          "content": "setScreenBrightness(OBJECT)设置屏幕亮度参数Object object\n\n参数\n类型\n默认值\n是否必须\n说明\n\n\n\n\nvalue\nNumber\n\n是\n屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮\n\n\nsuccess\nfunction\n\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n"
        },
        {
          "title": "boolean canIUse(string schema)",
          "url": "/apis/miniprogram.html#boolean-caniusestring-schema",
          "content": "boolean canIUse(string schema)判断小程序的API，回调，参数，组件等是否在当前版本可用。参数string schema使用 ${API}.${method}.${param}.${options} 或者 ${component}.${attribute}.${option} 方式来调用返回值boolean当前版本是否可用参数说明${API} 代表 API 名字\n${method} 代表调用方式，有效值为return, success, object, callback\n${param} 代表参数或者返回值\n${options} 代表参数的可选值\n${component} 代表组件名字\n${attribute} 代表组件属性\n${option} 代表组件属性的可选值\n代码示例：React.api.canIUse('getFileInfo')React.api.canIUse('closeSocket.object.code')\nReact.api.canIUse('getLocation.object.type')\nReact.api.canIUse('getSystemInfo.return.brand')\nReact.api.canIUse('lifestyle')\nReact.api.canIUse('button.open-type.share')\n"
        },
        {
          "title": "系统信息",
          "url": "/apis/miniprogram.html#系统信息",
          "content": "系统信息"
        },
        {
          "title": "getSystemInfo(Object object)",
          "url": "/apis/miniprogram.html#getsysteminfoobject-object",
          "content": "getSystemInfo(Object object)获取系统信息参数\bObject object\n\n属性\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nsrc\nstring\n是\n图片路径，目前支持：网络图片路径、apFilePath 路径、相对路径\n都支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\nsuccess 返回值\n\n名称\n类型\n描述\n支持平台\n\n\n\n\nbrand\nstring\n手机品牌\n都支持\n\n\nmodel\nstring\n手机型号\n都支持\n\n\npixelRatio\nnumber\n设备像素比\n都支持\n\n\nscreenWidth\nnumber\n屏幕宽度\n都支持\n\n\nscreenHeight\nnumber\n屏幕高度\n都支持\n\n\nwindowWidth\nnumber\n可使用窗口宽度\n都支持\n\n\nwindowHeight\nnumber\n可使用窗口高度\n都支持\n\n\nstatusBarHeight\nnumber\n状态栏的高度\n百度、微信\n\n\nlanguage\nstring\n微信设置的语言\n都支持\n\n\nversion\nstring\n版本号\n都支持\n\n\nsystem\nstring\n操作系统版本\n都支持\n\n\nplatform\nstring\n客户端平台\n都支持\n\n\nfontSizeSetting\nstring\n用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px\n都支持\n\n\nSDKVersion\nstring\n客户端基础库版本\n百度、微信\n\n\nstorage\nstring\n设备磁盘容量\n支付宝\n\n\ncurrentBattery\nstring\n当前电量百分比\n支付宝\n\n\napp\nstring\n当前运行的客户端，当前是支付宝则有效值是\"alipay\"\n支付宝\n\n\nbenchmarkLevel\nstring\n(仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50)\n微信\n\n\n"
        },
        {
          "title": "getSystemInfoSync(Object object)[快应用不支持]",
          "url": "/apis/miniprogram.html#getsysteminfosyncobject-object[快应用不支持]",
          "content": "getSystemInfoSync(Object object)[快应用不支持]同步获取系统信息返回值Object\n\n名称\n类型\n描述\n支持平台\n\n\n\n\nbrand\nstring\n手机品牌\n都支持\n\n\nmodel\nstring\n手机型号\n都支持\n\n\npixelRatio\nnumber\n设备像素比\n都支持\n\n\nscreenWidth\nnumber\n屏幕宽度\n都支持\n\n\nscreenHeight\nnumber\n屏幕高度\n都支持\n\n\nwindowWidth\nnumber\n可使用窗口宽度\n都支持\n\n\nwindowHeight\nnumber\n可使用窗口高度\n都支持\n\n\nstatusBarHeight\nnumber\n状态栏的高度\n百度、微信\n\n\nlanguage\nstring\n微信设置的语言\n都支持\n\n\nversion\nstring\n版本号\n都支持\n\n\nsystem\nstring\n操作系统版本\n都支持\n\n\nplatform\nstring\n客户端平台\n都支持\n\n\nfontSizeSetting\nstring\n用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px\n都支持\n\n\nSDKVersion\nstring\n客户端基础库版本\n百度、微信\n\n\nstorage\nstring\n设备磁盘容量\n支付宝\n\n\ncurrentBattery\nstring\n当前电量百分比\n支付宝\n\n\napp\nstring\n当前运行的客户端，当前是支付宝则有效值是\"alipay\"\n支付宝\n\n\nbenchmarkLevel\nstring\n(仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50)\n微信\n\n\n"
        },
        {
          "title": "扫码",
          "url": "/apis/miniprogram.html#扫码",
          "content": "扫码"
        },
        {
          "title": "scanCode(Object object)",
          "url": "/apis/miniprogram.html#scancodeobject-object",
          "content": "scanCode(Object object)调起客户端扫码界面进行扫码参数\bObject object\n\n属性\n类型\n是否必须\n说明\n支持平台\n\n\n\n\nonlyFromCamera\nboolean\n否\n是否只能从相机扫码，不允许从相册选择图片，默认false\n都支持,快应用不支持\n\n\nscanType\nArray.\n否\n扫码类型，默认(微信)['barCode', 'qrCode'], 支付宝默认值['qrCode'],数组只识别第一个\n都支持， 快应用不支持\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n都支持\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n都支持\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n都支持\n\n\nobject.scanType 的合法值\n\n值\n描述\n支持平台\n\n\n\n\nbarCode\n一维码\n都支持\n\n\nqrCode\n二维码\n都支持\n\n\ndatamatrix\nData Matrix 码\n\b微信\n\n\npdf417\nPDF417 条码\n微信\n\n\nsuccess 返回值\n\n名称\n类型\n描述\n支持平台\n\n\n\n\nresult\nstring\n所扫码的内容\n都支持\n\n\nscanType\nstring\n所扫码的类型\n\b支付宝不支持\n\n\ncharSet\nstring\n所扫码的字符集\n支付宝不支持\n\n\nqrCode\nstring\n扫描二维码时返回二维码数据\n支付宝\n\n\nbarCode\nstring\n扫描条形码时返回条形码数据\n支付宝\n\n\npath\nnumber\n当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path\n微信\n\n\nrawData\nstring\n原始数据，base64编码\n微信\n\n\n"
        },
        {
          "title": "用户截屏事件",
          "url": "/apis/miniprogram.html#用户截屏事件",
          "content": "用户截屏事件"
        },
        {
          "title": "onUserCaptureScreen(Object object)",
          "url": "/apis/miniprogram.html#onusercapturescreenobject-object",
          "content": "onUserCaptureScreen(Object object)监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件。参数callbackReact.api.onUserCaptureScreen(function() {    console.log('用户截屏了')\n});\n"
        }
      ]
    },
    {
      "title": "iBeacon",
      "content": "",
      "url": "/apis/iBeacon.html",
      "children": [
        {
          "title": "startBeaconDiscovery(OBJECT)",
          "url": "/apis/iBeacon.html#startbeacondiscoveryobject",
          "content": "startBeaconDiscovery(OBJECT)开始搜索附近的iBeacon设备参数Object object\n\n参数\b名\n类型\n是否必须\n说明\n\n\n\n\nuuids\nStringArray\n是\niBeacon设备广播的 uuids\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n示例代码：React.api.startBeaconDiscovery({\n  uuids:['uuid1','uuid2'],\n  success: (res) => {\n    console.log(res)\n  },\n  fail:(res) => {\n  },\n  complete: (res)=>{\n  }\n});\nuuid1、uuid2 为目标 iBeacon 的UUID，可从硬件厂商获取，如果为空，无法搜索到 iBeacon\n"
        },
        {
          "title": "stopBeaconDiscovery(OBJECT)",
          "url": "/apis/iBeacon.html#stopbeacondiscoveryobject",
          "content": "stopBeaconDiscovery(OBJECT)停止搜索附近的iBeacon设备参数Object object\n\n参数\b名\n类型\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\n"
        },
        {
          "title": "getBeacons(OBJECT)",
          "url": "/apis/iBeacon.html#getbeaconsobject",
          "content": "getBeacons(OBJECT)获取所有已搜索到的iBeacon设备参数Object object\n\n参数\b名\n类型\n是否必须\n说明\n\n\n\n\nsuccess\nfunction\n否\n接口调用成功的回调函数\n\n\nfail\nfunction\n否\n接口调用失败的回调函数\n\n\ncomplete\nfunction\n否\n接口调用结束的回调函数（调用成功、失败都会执行）\n\n\nsuccess返回参数说明\n\n参数名\n类型\n描述\n支持平台\n\n\n\n\nbeacons\nObjectArray\niBeacon 设备列表\n都支持\n\n\nerrMsg\nString\n调用结果\n微信\n\n\nerrCode\nString\nerrorCode=0 ,接口调用成功\n支付宝\n\n\n"
        },
        {
          "title": "onBeaconUpdate(CALLBACK)",
          "url": "/apis/iBeacon.html#onbeaconupdatecallback",
          "content": "onBeaconUpdate(CALLBACK)监听 iBeacon 设备的更新事件CALLBACK返回参数说明：\n\n参数名\n类型\n描述\n支持平台\n\n\n\n\nbeacons\nObjectArray\niBeacon 设备列表\n都支持\n\n\niBeacon 结构：\n\n参数名\n类型\n描述\n\n\n\n\nuuid\nString\niBeacon 设备广播的 uuid\n\n\nmajor\nString\niBeacon 设备的主 id\n\n\nminor\nString\niBeacon 设备的次 id\n\n\nproximity\nNumber\n表示设备距离的枚举值(0-3分别代表：未知、极近、近、远)\n\n\naccuracy\nNumber\niBeacon 设备的距离\n\n\nrssi\nNumber\niBeacon 信号强度\n\n\n"
        },
        {
          "title": "onBeaconServiceChange(CALLBACK)",
          "url": "/apis/iBeacon.html#onbeaconservicechangecallback",
          "content": "onBeaconServiceChange(CALLBACK)监听 iBeacon 服务的状态变化CALLBACK返回参数说明：\n\n参数名\n类型\n描述\n\n\n\n\navailable\nBoolean\n服务目前是否可用\n\n\ndiscovering\nBoolean\n目前是否处于搜索状态\n\n\n"
        }
      ]
    }
  ],
  "谁在用nanachi": [
    {
      "title": "使用娜娜奇生成的小程序",
      "content": "",
      "url": "/documents/logo.html",
      "children": [
        {
          "title": "百度小程序（需要使用手机百度APP 搜索栏旁边的拍摄二维码打开）",
          "url": "/documents/logo.html#百度小程序（需要使用手机百度app-搜索栏旁边的拍摄二维码打开）",
          "content": "百度小程序（需要使用手机百度APP 搜索栏旁边的拍摄二维码打开）"
        },
        {
          "title": "支付宝小程序（需要使用支付宝APP 扫码打开）",
          "url": "/documents/logo.html#支付宝小程序（需要使用支付宝app-扫码打开）",
          "content": "支付宝小程序（需要使用支付宝APP 扫码打开）"
        },
        {
          "title": "快应用（需要使用安卓手机 扫码打开）",
          "url": "/documents/logo.html#快应用（需要使用安卓手机-扫码打开）",
          "content": "快应用（需要使用安卓手机 扫码打开）"
        },
        {
          "title": "QQ小程序（需要使用安卓QQ 扫码打开）",
          "url": "/documents/logo.html#qq小程序（需要使用安卓qq-扫码打开）",
          "content": "QQ小程序（需要使用安卓QQ 扫码打开）"
        },
        {
          "title": "补丁组件快应用 Demo（需要先扫码下载，然后在快应用调试器里选择本地安装打开）",
          "url": "/documents/logo.html#补丁组件快应用-demo（需要先扫码下载，然后在快应用调试器里选择本地安装打开）",
          "content": "补丁组件快应用 Demo（需要先扫码下载，然后在快应用调试器里选择本地安装打开）"
        }
      ]
    }
  ]
}