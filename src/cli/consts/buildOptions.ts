export interface CmdOption {
    readonly desc: string,
    readonly alias?: string
}

export interface CmdMap {
    readonly [commandName: string]: CmdOption;
}

const BUILD_OPTIONS: CmdMap = {
    'compress': {
        alias: 'c',
        desc: '压缩资源'
    },
    'beta': {
        desc: '同步react runtime'
    },
    'beta-ui': {
        desc: '同步schnee-ui'
    },
    'huawei': {
        desc: '补丁华为快应用'
    },
    'analysis': {
        alias: 'a',
        desc: '打包产物分析'
    },
    'silent': {
        alias: 's',
        desc: '关闭eslint warning'
    },
    'typescript': {
        alias: 't',
        desc: '开启typescript编译'
    }
};

export default BUILD_OPTIONS;