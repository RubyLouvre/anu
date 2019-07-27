import React from '@react';

const RequestManager = {
    request: function(reqObj) {
        React.api.request(reqObj);
    }
};

export default RequestManager;