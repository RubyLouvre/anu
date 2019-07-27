// 网络

const network = require('@system.network');

function getNetworkType({
    success,
    fail,
    complete
}) {
    network.getType({
        success: function networkTypeGot(res) {
            success({ networkType: res.type });
        } ,
        fail,
        complete
    });
}

function onNetworkStatusChange(callback) {
    function networkChanged({ type: networkType }) {
        const connectedTypes = ['wifi', '4g', '3g', '2g'];

        callback({
            isConnected: connectedTypes.includes(networkType),
            networkType
        });


    }

    network.subscribe({callback: networkChanged});
}

export {
    getNetworkType,
    onNetworkStatusChange
};