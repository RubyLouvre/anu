import path from 'path';
const buildType = process.env.ANU_ENV;
function getNativeComponents() {
    let nativeComponents = [];
    try {
        let userConfig = require( path.join(process.cwd(), 'source', `${buildType}Config.json` ))
        nativeComponents = userConfig.nativeComponents || [];
    } catch (err) {
    }
    return nativeComponents;
}

export default getNativeComponents;


