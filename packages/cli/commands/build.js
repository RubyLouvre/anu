const nanachi = require('../index');

module.exports = async function(args){
    try {
        const { buildType, beta, betaUi, watch, compress, huawei } = args;
        nanachi({
            platform: buildType,
            beta,
            betaUi,
            compress,
            watch,
            huawei
        });

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

