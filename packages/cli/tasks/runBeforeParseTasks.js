let runChaikaMergeTask = require('./chaikaMergeTask/index');
let runPreTasks = require('./pretasks');
let cwd = process.cwd();
let path = require('path');

function changeWorkingDir(){
    process.chdir(path.join(cwd, '.CACHE/nanachi'));
}

function isChaikaMode() {
    return process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE';
}

module.exports = async function(args){

    try {
        if (isChaikaMode()) {
            await runChaikaMergeTask();
        }

        await runPreTasks(args);

        if (isChaikaMode()) {
            changeWorkingDir();
        }
    } catch (err) {
        // eslint-disable-next-line
        console.log(err);
    }
};
