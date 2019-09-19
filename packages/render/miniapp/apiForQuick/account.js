const account = require('@service.account');

function accountGetProvider() {
    return account.getProvider();
}

function accountAuthorize(options) {
    return account.authorize(options);
}

export { accountGetProvider, accountAuthorize };

