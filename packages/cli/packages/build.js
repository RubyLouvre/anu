const translatorKey = {
    wx: 'translator',
    ali: 'translatorAli',
    baidu: 'translatorBu',
    quick: 'translatorQuick',
};
const build = (arg, type) => {
    let path = `./${translatorKey[type]}/index`;
    require(path)(arg);
};

module.exports = build;
