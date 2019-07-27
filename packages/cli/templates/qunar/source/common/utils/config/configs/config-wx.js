const BETA = process.env.BUILD_ENV === 'beta' ? true : false;

const settings = {
    requestDomain: `https://wxapp${BETA ? '.beta' : ''}.qunar.com`
};

const service = {
    // // 登录接口
    // autoLogin: '/oauth-client/oauth/login',
    // // 检测是否登录
    // checkLogin: '',
    // // 检测绑定
    // checkBind: '/oauth-client/oauth/checkBind',
    // // 拿qunarToken
    // getQunarToken: '/oauth-client/oauth/authorization',
    // // 验证码
    // sendSMSCode: '/ucenter/webApi/logincode.jsp',
    // // 根据手机号登录
    // loginByPhone: '/ucenter/webApi/logincodeverify.jsp',
    // // 快速登录以及绑定支付宝账户
    // loginByQuick: '/oauth-client/oauth/login',
    // // 退出登录
    // logOut: '/oauth-client/oauth/logout'
    // 拿openId和unionId
    smallLogin: '/oauth-client/wechatSmall/smallLogin',
    // 校验登录
    //校验
    validate: '/oauth-client/wechatSmall/validate',
    // 查询绑定 并返回对应头像
    checkBind: '/oauth-client/wechatSmall/checkBind'
};


export default {
    settings,
    service
};
