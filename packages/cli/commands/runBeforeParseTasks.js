let runChaikaMergeTask = require('./chaikaMergeTask/index');
let runPreTasks = require('./pretasks');
module.exports = async function(args){
    try {
        if (process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE') {
            await runChaikaMergeTask();
        }
        await runPreTasks(args);
    } catch (err) {
        // eslint-disable-next-line
        console.log(err);
    }
};
