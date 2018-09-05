const execSync = require('child_process').execSync;

const useYarn = ()=>{
    try {
        execSync(
            'yarn --version',
            { stdio: 'ignore' }
        );
        return true;
    } catch (e) {
        return false;
    }
};

const useCnpm = ()=>{
    try {
        execSync(
            'cnpm --v',
            { stdio: 'ignore' }
        );
        return true;
    } catch (e) {
        return false;
    }
};

exports.useYarn = useYarn;
exports.useCnpm = useCnpm;

