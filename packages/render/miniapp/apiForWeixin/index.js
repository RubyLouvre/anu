const RequestQueue = {
    MAX_REQUEST: 10,
    queue: [],
    request(options) {
        this.push(options);
        this.run();
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
            this.facade.request(options);
        }
    }
};

export var more = function(api) {
    return {
        // 界面交互
        request: function(_a) {
            RequestQueue.facade = api;
            RequestQueue.request(_a);
            return RequestQueue.request(_a);
        },
        getStorage: function({key, success, fail, complete}){
            return api.getStorage({
                key,
                complete,
                success,
                fail: function(e){//QQ小程序如果找不到数据会报错，而不是返回一个空对象
                    if(e.errMsg ===  "getStorage:fail data not found"){
                        success && success({})
                    }else{
                        fail && fail(e)
                    }
                }
            })
        }
    };
};
