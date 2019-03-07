const BETA = process.env.BUILD_ENV === 'beta' ? true : false;


const settings = {
    requestDomain: `https://pwapp${BETA ? '.beta' : ''}.qunar.com`
};

const service = {
    // 登录接口
    autoLogin: '/oauth-client/oauth/login',
    // 检测绑定
    checkBind: '/oauth-client/oauth/checkBind',
    // 拿qunarToken
    getQunarToken: '/oauth-client/oauth/authorization',
    // 验证码
    sendSMSCode: '/ucenter/webApi/logincode.jsp',
    // 根据手机号登录
    loginByPhone: '/ucenter/webApi/logincodeverify.jsp',
    // 快速登录以及绑定支付宝账户
    loginByQuick: '/oauth-client/oauth/login',
    // 退出登录
    logOut: '/oauth-client/oauth/logout',
    // 拿支付宝用户信息
    getInfoByToken: '/oauth-client/oauth/getInfoByToken',
    // 是否登录
    checkLogin: '/oauth-client/oauth/isLogin',
    // 同步登录
    syncCookie: '/mpx/syncCookie',
    //监控地址
    watcherUrl: '/mp/watcher',
    //获取订单列表
    getOrders: '/api/mini/order/query.do',
    // 同步登陆cookie
    syncLoginState: '/oauth-client/oauth/syncLoginState'
};


export default {
    settings,
    service
};
