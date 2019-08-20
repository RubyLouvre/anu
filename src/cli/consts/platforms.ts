export interface Platform {
    buildType: string;
    des: string;
    isDefault?: boolean;
}
const platforms: Array<Platform> = [
    {
        buildType: 'wx',
        des: '微信小程序',
        isDefault: true
    },
    {
        buildType: 'qq',
        des: 'QQ小程序'
    },
    {
        buildType: 'ali',
        des: '支付宝小程序'
    },
    {
        buildType: 'bu',
        des: '百度智能小程序'
    },
    {
        buildType: 'tt',
        des: '头条小程序'
    },
    {
        buildType: 'quick',
        des: '快应用'
    },
    {
        buildType: 'h5',
        des: 'H5'
    }
]

export default platforms;
