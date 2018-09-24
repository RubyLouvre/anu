
const execSync = require('child_process').execSync;
let utils = {
    getNodeVersion(){
        return Number(process.version.match(/v(\d+)/)[1]);
    },
    useYarn(){
        try {
            execSync(
                'yarn --version',
                { stdio: 'ignore' }
            );
            return true;
        } catch (e) {
            return false;
        }
    },
    useCnpm(){
        try {
            execSync(
                'cnpm -v',
                { stdio: 'ignore' }
            );
            return true;
        } catch (e) {
            return false;
        }
    }
};

module.exports = Object.assign(module.exports, utils);