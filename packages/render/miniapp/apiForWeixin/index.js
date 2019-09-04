const RequestQueue = {
    MAX_REQUEST: 10,
    queue: [],
    request(options) {
        this.push(options);
        return this.run();
    },

    push(options) {
        this.queue.push(options);
    },

    run() {
        if (!this.queue.length) {
            return;
        }
        if (this.queue.length <= this.MAX_REQUEST) {
            let options = this.queue.shift();
            let completeFn = options.complete;
            var self = this;
            options.complete = function() {
                completeFn && completeFn.apply(null, arguments);
                self.run();
            };
            return this.facade.request(options);
        }
    }
};

export var more = function(api) {
    return {
        // 界面交互
        request: function(_a) {
            RequestQueue.facade = api;
            return RequestQueue.request(_a);
        },
        uploadFile: function _(a) {
            var cb = a.success || Number;
            a.success = function(res) {
                // if (res.data + '' === res.data) {
                //     res.data = JSON.parse(res.data);
                // }
                cb(res);
            };
            return api.uploadFile(a);
        },
        getStorage: function({ key, success, complete }) {
            return api.getStorage({
                key,
                complete,
                success,
                fail: function(e) {
                    //QQ小程序如果找不到数据会报错，而不是返回一个空对象
                    //QQ的错误描述：getStorage:fail data not found
                    //微信的错误描述：getStorage:fail:data not found
                    //真机调试的错误可能是 timeout
                    success && success({});
                    //if (/fail(:|\s)data\snot\sfound/.test(e.errMsg)){
                }
            });
        }
    };
};
