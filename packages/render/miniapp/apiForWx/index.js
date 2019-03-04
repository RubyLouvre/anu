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
        }
    };
};
