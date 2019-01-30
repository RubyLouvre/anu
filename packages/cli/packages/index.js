/* eslint no-console: 0 */

const chalk = require('chalk');
const path = require('path');
const rollup = require('rollup');
const rbabel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs'); 
const alias = require('rollup-plugin-alias');
const nodeResolve = require('resolve');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const glob = require('glob');
const utils = require('./utils');
const crypto = require('crypto');
const config = require('./config');
const quickFiles = require('./quickFiles');
const miniTransform = require('./miniappTransform');
const styleTransform = require('./styleTransform');
const generate = require('./generate');
let cwd = process.cwd();
let inputPath = path.join(cwd,  config.sourceDir);
let cache = {};
let needUpdate = (id, code, fn) => {
    let sha1 = crypto
        .createHash('sha1')
        .update(code)
        .digest('hex');
    if (!cache[id] || cache[id] != sha1) {
        cache[id] = sha1;
        fn();
    }
};
const isStyle = path => {
    return /\.(?:less|scss|sass)$/.test(path);
};
const isJs = path => {
    return /\.js$/.test(path);
};
const isJson = path => {
    return /\.json$/.test(path);
};
const getFileType = (id)=>{
    if (isStyle(id)){
        return 'css';
    } else if (isJs(id)) {
        return 'js';
    } else if (isJson(id)){
        return 'json';
    }
};

//跳过rollup对样式内容解析
let ignoreStyleParsePlugin = ()=>{
    return {
        transform: function(code, id){
            let styleExtList = ['.css', '.less', '.scss', '.sass'];
            let ext = path.extname(id);
            if (styleExtList.includes(ext)) return false;
        }
    };
};


//监听打包资源
utils.on('build', ()=>{
    generate();
});

class Parser {
    constructor(entry) {
        this.entry = entry;
        this.jsFiles = [];
        this.styleFiles = [];
        this.npmFiles = [];
        this.depTree = {};
        this.collectError = {
            //样式@import引用错误, 如page中引用component样式
            styleImportError: [],
            //page or component js代码是否超过500行
            jsCodeLineNumberError: [],
            //page中是否包含了component目录
            componentInPageError: [],
            jsxError: [],
            // 引用的组件是否符合规范
            componentsStandardError: []
        };
        
        this.customAliasConfig = Object.assign(
            { resolve: ['.js','.css', '.scss', '.sass', '.less'] },
            utils.getAliasConfig()
        );
        
        this.inputConfig = {
            input: this.entry,
            plugins: [
                alias(this.customAliasConfig), //搜集依赖时候，能找到对应的alias配置路径
                resolve({
                    jail: path.join(cwd),   //从项目根目录中搜索npm模块, 防止向父级查找
                    preferBuiltins: false,  //防止查找内置模块
                    customResolveOptions: {
                        moduleDirectory: [
                            path.join(cwd, 'node_modules')
                        ]
                    }
                }),
                ignoreStyleParsePlugin(),
                commonjs({
                    include: 'node_modules/**',
                    exclude: ['node_modules/schnee-ui/**'] //防止解析ui库中的jsx报错
                }),
                rbabel({
                    babelrc: false,
                    only: ['**/*.js'],
                    presets: [require('babel-preset-react')],
                    plugins: [
                        require('babel-plugin-transform-class-properties'),
                        require('babel-plugin-transform-object-rest-spread'),
                        [
                            //重要,import { Xbutton } from 'schnee-ui' //按需引入
                            require('babel-plugin-import').default,
                            {
                                libraryName: 'schnee-ui',
                                libraryDirectory: 'components',
                                camel2DashComponentName: false
                            }
                        ],
                        require('./babelPlugins/collectPatchComponents'),
                        ...require('./babelPlugins/validateJsx')(this.collectError)
                    ]
                })
            ],
            onwarn: warning => {
                //warning.importer 缺失依赖文件路径
                //warning.source   依赖的模块名
                if (warning.code === 'UNRESOLVED_IMPORT') {
                    let key = warning.source.split(path.sep)[0];
                    if (this.customAliasConfig[key]) return;
                    console.log(chalk.red(`缺少运行依赖模块: ${key}, 请安装.`));
                    process.exit(1);
                }
            }
        };

        //监听是否有patchComponent解析
        utils.on('compliePatch', (id)=>{
            this.inputConfig.input = id;
            this.parse();
        });
        
    }
    async parse() {
        let bundle = await rollup.rollup(this.inputConfig);
        //如果有需要打补丁的组件并且本地没有安装schnee-ui
        if (this.needInstallUiLib()) {
            utils.installer('schnee-ui');
        }
    
        let moduleMap = this.moduleMap();
        bundle.modules.forEach(item => {
            if (/commonjsHelpers/.test(item.id)) return;
            let hander = moduleMap[getFileType(item.id)];
            if (hander) {
                hander(item);
            }
            this.collectDeps(item);
        });

        this.check(()=>{
            this.transform();
        });
        
        this.copyAssets();
        this.copyProjectConfig();
    }
    needInstallUiLib() {
        if ( !config[config.buildType].jsxPatchNode ) return false; //没有需要patch的组件
        try {
            nodeResolve.sync('schnee-ui', { basedir: process.cwd() });
            return false;
        } catch (err) {
            return true;
        }
    }
    collectDeps(item) {
        //搜集js的样式依赖，快应用下如果更新样式，需触发js构建ux.
        if ( !/\.js$/.test(item.id) ) return;
        let depsStyle = item.dependencies.filter((id)=>{
            return isStyle(id);
        });
        if (depsStyle.length) {
            this.depTree[item.id] = depsStyle;
        }
    }
    moduleMap() {
        return {
            css: (data)=>{
                this.checkStyleImport(data);
                if (config.buildType == 'quick'){
                    //如果是快应用，那么不会生成独立的样式文件，而是合并到同名的 ux 文件中
                    var jsName = data.id.replace(/\.\w+$/, '.js');
                    if (fs.pathExistsSync(jsName)) {
                        var cssExt = path.extname(data.id).slice(1);
                        quickFiles[ jsName ] = {
                            cssPath: data.id,
                            cssType: cssExt === 'scss' ?  'sass' : cssExt
                        };
                    }
                    return;
                }
                this.styleFiles.push({
                    id: data.id,
                    originalCode: data.originalCode
                });
            },
            js: (data)=>{
                //校验文件代码行数是否超过500, 抛出警告。
                this.checkCodeLine(data.id, data.originalCode, 500);
                //校验pages目录中是否包含components目录
                this.checkComponentsInPages(data.id);
                //校验组件组件名以及文件夹是否符合规范
                this.checkImportComponent(data);
                this.jsFiles.push({
                    id: data.id,
                    originalCode: data.originalCode,
                    resolvedIds: data.resolvedIds //获取alias配置
                });
            }
        };
    }

    checkImportComponent(item){
        // const path = item.id;
        const componentsDir = path.join(cwd, config.sourceDir, 'components');
        // 如果是 components 中的组件需要校验
        if (item.id.indexOf(componentsDir) === 0) {
            const restComponentsPath = item.id.replace(componentsDir, '');
            if (!/^(\/|\\)[A-Z][a-zA-Z0-9]*(\/|\\)index\.js/.test(restComponentsPath)) {
                this.collectError.componentsStandardError.push({
                    id: item.id,
                    level: 'error',
                    msg: item.id.replace(`${cwd}${path.sep}`, '')
                        + '\n组件名必须首字母大写\nimport [组件名] from \'@components/[组件名]/[此处必须index]\''
                        + '\neg. import Loading from \'@components/Loading/index\'\n'
                });
            }
        }
    }
    transform() {
        this.updateJsQueue(this.jsFiles);
        this.updateStyleQueue(this.styleFiles);
    }
    check( cb ) {
        let errorMsg = '';
        let warningMsg = '';
        Object.keys(this.collectError).forEach((key)=>{
            this.collectError[key].forEach((info)=>{
                switch (info.level) {
                    case 'error':
                        errorMsg += `Error: ${info.msg}\n`;
                        break;
                    case 'warning':
                        warningMsg += `Warning: ${info.msg}\n`;
                        break;
                }
            });
            this.collectError[key] = [];
        });
        
        if ( warningMsg ) {
            console.log(chalk.yellow(warningMsg));
        }
        if ( errorMsg ) {
            console.log(chalk.red(errorMsg));
            process.exit(1);
        }
        cb && cb();
    }
    checkComponentsInPages(id) {
        id = path.relative( cwd,  id);
        let pathAray = utils.isWin() ? id.split('\\') :  id.split('/'); //分割目录
        let componentsPos = pathAray.indexOf('components');
        let pagesPos = pathAray.indexOf('pages');
        let msg = '';
        if ( !( componentsPos != -1 && pagesPos != -1 ) ) return;
        componentsPos > pagesPos
            ? msg = `${id} 文件中路径中不能包含components目录, 请修复.`
            : msg = `${id} 文件中路径中不能包含pages目录, 请修复.`;
        this.collectError.componentInPageError.push({
            id: id,
            level: 'error',
            msg: msg
        });
        
    }
    checkCodeLine(filePath, code, number){
        if ( /^(React)/.test(path.basename(filePath)) ) return; //React runtime不校验代码行数
        let line =  code.match(/\n/g);
        if ( !line || line.length <= number ) return;
        let id = path.relative( cwd,  filePath);
        this.collectError.jsCodeLineNumberError.push({
            id: id,
            level: 'warning',
            msg: `${id} 文件代码不能超过${number}行, 请优化.`
        });
    }
    checkStyleImport (data){
        let id = path.relative(cwd, data.id);
        let importList = data.originalCode.match(/^(?:@import)\s+([^;]+)/igm) || [];
        importList = importList.filter((importer)=>{
            return /[/|@]components\//.test(importer);
        });
       
        if (!importList.length) return;
        this.collectError.styleImportError.push({
            id: id,
            level: 'error',
            msg: `${id} 文件中不能@import 组件(components)样式, 组件样式请在组件中引用, 请修复.`
        });
    }
    updateJsQueue(jsFiles) {
        while (jsFiles.length) {
            let item = jsFiles.shift();
            if (/commonjs-proxy:/.test(item.id)) item.id = item.id.split(':')[1];
            let { id, originalCode, resolvedIds } = item;
            needUpdate(id, originalCode, function(){
                miniTransform(id, resolvedIds, originalCode);
            });
        }
    }
    updateStyleQueue(styleFiles) {
        while (styleFiles.length) {
            let { id, originalCode } = styleFiles.shift(); 
            needUpdate(id, originalCode, function(){
                styleTransform({
                    id: id,
                    originalCode: originalCode
                });   
            });
        }
    }
    copyAssets() {
        const dir = 'assets';
        const inputDir = path.join(inputPath, dir);
        //拷贝assets下非js, css, sass, scss, less文件
        glob(inputDir + '/**', {nodir: true}, (err, files)=>{
            if (err) {
                console.log(err);
                return;
            }
            files.forEach((filePath)=>{
                if ( /\.(js|scss|sass|less|css)$/.test(filePath) ) return;
                filePath = path.resolve(filePath);
                let dist  = utils.updatePath(
                    filePath, 
                    config.sourceDir, 
                    config.buildType === 'quick' ? 'src' : config.buildDir
                );
                
                fs.ensureFileSync(dist);
                fs.copyFile(filePath, dist, (err)=>{
                    if (err ) {
                        console.log(err);
                    }
                });
            });
        });

    }
    copyProjectConfig() {
        //copy project.config.json
        if ( ['ali', 'bu', 'quick'].includes( config.buildType) ) return;
        let fileName = 'project.config.json';
        let dist = path.join(cwd, config.buildDir, fileName);
        let src = path.join(cwd, fileName);
        fs.ensureFileSync(dist);
        fs.copyFile( src, dist, (err)=>{
            if (err) {
                //console.log(err);
            }
        });
    }
    watching() {
        let watchDir = path.dirname(this.entry);
        let watchConfig = {
            ignored: /\.DS_Store|\.gitignore|\.git/,
            awaitWriteFinish: {
                stabilityThreshold: 700,
                pollInterval: 100
            }
        };
        const watcher = chokidar
            .watch(watchDir, watchConfig)
            .on('change', (file)=>{
                console.log(
                    `\n更新: ${chalk.yellow(path.relative(cwd, file))}`
                );
                this.inputConfig.input = this.resolveWatchFile(file);
                this.parse();
                
            });
        watcher.on('error', error => {
            console.error('Watcher failure', error);
            process.exit(1);
        });
    }
    resolveWatchFile(file) {
        if (config.buildType !== 'quick') return file;
        let dep = file;
        for ( let i in this.depTree) {
            if (this.depTree[i].includes(file)) {
                dep = i;
                break;
            }
        }
        delete cache[dep];
        return dep;
    }
}

module.exports = (entry)=>{
    return new Parser(entry);
};
