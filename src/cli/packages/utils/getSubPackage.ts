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
         * ],
         * subpackages: [
         *   {}
         * ]
         */
        subPackages = Object.keys(appRootConfig).reduce((startValue, el) => {
            if (el.toLowerCase() === 'subpackages' && appRootConfig[el].length ) {
                startValue = startValue.concat(appRootConfig[el]);
            }
            return startValue;
        }, []);
        // subPackages = appRootConfig.subpackages || appRootConfig.subPackages || [];
    } catch (err) {
        
    }
    return subPackages;
};