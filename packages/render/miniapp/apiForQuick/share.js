export function share(obj) {
    var share = require('@service.share');
    share.getAvailablePlatforms({
        success: function() {
            share.share(obj);
        }
    });
}