import * as path from 'path';
import runChaikaMergeTask from './chaikaMergeTask/index';
import runPreTasks from './pretasks';
import { NanachiOptions } from '..';
import utils from '../packages/utils/index';
let cwd = process.cwd();

function changeWorkingDir() {
    process.chdir(path.join(cwd, '.CACHE/nanachi'));
}

function isChaikaMode() {
    return process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE';
}

export default async function(args: NanachiOptions) {
    try {
        /**
         * cli_h5_component_move_to_schnee_ui
         * 转译之前查安装补丁组件, 转译成 h5 时需要
         * 需要的补丁代码在 `transformH5App.ts` 中
         */
        if ('h5' === args.platform) {
            const m = 'schnee-ui';
            if(!utils.hasNpm(m)) utils.installer(m);
        }
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
}
