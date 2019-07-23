import * as path from 'path';
import runChaikaMergeTask from './chaikaMergeTask/index';
import runPreTasks from './pretasks';
import { NanachiOptions } from '..';
let cwd = process.cwd();

function changeWorkingDir(){
    process.chdir(path.join(cwd, '.CACHE/nanachi'));
}

function isChaikaMode() {
    return process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE';
}

export default async function(args: NanachiOptions){
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
