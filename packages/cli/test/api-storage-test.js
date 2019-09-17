require('./utils/apiMock');
const React = require('./ReactWX').default;
describe('test Storge', () => {
    
    test('test:React.api.setStorage:success', () => {
        return React.api
            .setStorage({
                mock() {
                    return {
                        errMsg: ':ok',
                        data: 'a=1&b=2&c=3'
                    };
                }
            })
            .then(function(res){
                var output = 'setStorage:ok';
                expect(res).toBe(output);
            });
    });

    test('test:React.api.setStorage:fail', () => {
        return React.api
            .setStorage({
                mock() {
                    return {
                        errMsg: ':fail',
                        data: 'a=1&b=2&c=3'
                    };
                }
            })
            .catch(function(res){
                var output = 'setStorage:fail';
                expect(res).toBe(output);
            });
    });

    test('test:React.api.getStorage:success', () => {
        return React.api
            .getStorage({
                key: ':ok'
            })
            .then(function(res){
                var output = {
                    errMsg: 'getStorage:ok',
                    data: 'a=1&b=2&c=3'
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.getStorage:fail', () => {
        return React.api
            .getStorage({
                key: ':fail'
            })
            .catch(function(res){
                var output = {
                    errMsg: 'getStorage:fail data not found'
                };
                expect(res).toEqual(output);
            });
    });

    
    test('test:React.api.removeStorage:success', () => {
        return React.api
            .removeStorage({
                key: 'key'
            })
            .then(function(res){
                var output = {
                    errMsg: 'removeStorage:ok'
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.clearStorage:success', () => {
        return React.api
            .clearStorage({
                key: 'key'
            })
            .then(function(res){
                var output = {
                    errMsg: 'clearStorage:ok'
                };
                expect(res).toEqual(output);
            });
    });
    
});
