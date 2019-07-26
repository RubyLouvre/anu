import * as path from 'path';

function injectChaikEnv(){
    let pkg: {
        nanachi?: {
            chaika_mode?: boolean
        }
    } = {};
    try {
        pkg = require(path.join(process.cwd(), 'package.json'));
    } catch (err) {
        // eslint-disable-next-line
    }
    let chaikaMode = pkg.nanachi && pkg.nanachi.chaika_mode
        ? 'CHAIK_MODE'
        : 'NOT_CHAIK_MODE';
    process.env.NANACHI_CHAIK_MODE = chaikaMode;
}

injectChaikEnv();