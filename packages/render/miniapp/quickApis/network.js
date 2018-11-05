// 网络

const network = require('@system.network');

function getNetworkType({
  success,
  fail,
  complete
}) {
  function networkTypeGot({ type: networkType }) {
    success({ networkType });
  }

  network.getType({
    success: networkTypeGot,
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

  network.subscribe({callback: networkChanged})
}

export {
  getNetworkType,
  onNetworkStatusChange
}