const nanachi = require('../index');

function callback(err, stats) {
    if (err) {
        // eslint-disable-next-line
        console.log(err);
        return;
    }

    const info = stats.toJson();
    if (stats.hasErrors()) {
        info.errors.forEach(e => {
            // eslint-disable-next-line
            console.error(e);
            process.exit();
        });
    }
}

module.exports = async function(args){
    try {
        const { buildType, beta, betaUi, watch, compress } = args;
        nanachi({
            entry: './source/app.js',
            platform: buildType,
            beta,
            betaUi,
            compress,
            watch,
            plugins: [],
            complete: callback
        });

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

