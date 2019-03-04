export function share(obj) {
    var share = require('@system.share');
    share.getAvailablePlatforms({
        success: function(data) {
            let shareType = 0;
            if (obj.path && obj.title) {
                shareType = 0;
            } else if (obj.title) {
                shareType = 1;
            } else if (obj.imageUrl) {
                shareType = 2;
            }
            obj.shareType = obj.shareType || shareType;
            obj.targetUrl = obj.path;
            obj.summary = obj.desc;
            obj.imagePath = obj.imageUrl;
            obj.platforms = data.platforms;
            share.share(obj);
        }
    });
}