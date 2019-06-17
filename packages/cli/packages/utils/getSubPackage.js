const path = require('path');

module.exports = function(buildType) {
    let subPackages = [];
    try {
        let appRootConfig = require(path.join(process.cwd(), 'source', `${buildType}Config.json`));
        /**
         * subPackages: [
         *      {
         *          "name": "native",
         *          "resource": "pages/demo/native"
         *      }
         * ]
         */
        subPackages = appRootConfig.subpackages || appRootConfig.subPackages || [];
    } catch (err) {
        
    }
    return subPackages;
};