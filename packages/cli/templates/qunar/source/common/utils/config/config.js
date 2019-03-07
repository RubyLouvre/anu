import configWx from './configs/config-wx';
import configAli from './configs/config-ali';

let config;

const ANU_ENV = process.env.ANU_ENV;
if (ANU_ENV === 'wx'){
    config = configWx;
} else {
    config = configAli;
}

export default config;
