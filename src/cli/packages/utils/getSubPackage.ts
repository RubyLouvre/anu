import * as path from 'path';

module.exports = function(buildType: string) {
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