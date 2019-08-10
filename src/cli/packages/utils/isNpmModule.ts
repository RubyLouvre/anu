

module.exports  = function isNpmModule(name: string){
    //如果模块名的第一个字符不是. / @ 就粗略地认为它是来自npm
    var c = name.charAt(0);
    return c !== '.' && c !== '/' && c !== '@';
}