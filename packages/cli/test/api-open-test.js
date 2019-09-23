require('./utils/apiMock');
const React = require('./ReactWX').default;
describe('test open api', () => {

    test('test:React.api.login:success', () => {
        return React.api
            .login({
                mock() {
                    return {
                        errMsg: ':ok',
                        code: 'abc'
                    };
                }
            })
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    code: 'abc'
                };
                expect(res).toEqual(output);
            });
    });

    
    test('test:React.api.login:fail', () => {
        return React.api
            .login({
                mock() {
                    return {
                        errMsg: ':fail'
                    };
                }
            })
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });

    test('test:React.api.checkSession:success', () => {
        return React.api
            .checkSession({
                mock() {
                    return {
                        errMsg: ':ok',
                        session_key: 'abc'
                    };
                }
            })
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    session_key: 'abc'
                };
                expect(res).toEqual(output);
            });
    });

    
    test('test:React.api.checkSession:fail', () => {
        return React.api
            .checkSession({
                mock() {
                    return {
                        errMsg: ':fail'
                    };
                }
            })
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });


    test('test:React.api.authorize:success', () => {
        return React.api
            .authorize({
                mock() {
                    return {
                        errMsg: ':ok'
                    };
                }
            })
            .then(function(res){
                var output = {
                    errMsg: ':ok'
                };
                expect(res).toEqual(output);
            });
    });

    
    test('test:React.api.authorize:fail', () => {
        return React.api
            .authorize({
                mock() {
                    return {
                        errMsg: ':fail'
                    };
                }
            })
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });

    

    test('test:React.api.getUserInfo:success', () => {
        return React.api
            .getUserInfo({
                mock() {
                    return {
                        errMsg: ':ok',
                        userInfo: {}
                    };
                }
            })
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    userInfo: {}
                };
                expect(res).toEqual(output);
            });
    });

    
    test('test:React.api.getUserInfo:fail', () => {
        return React.api
            .getUserInfo({
                mock() {
                    return {
                        errMsg: ':fail'
                    };
                }
            })
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });

    

    test('test:React.api.requestPayment:success', () => {
        return React.api
            .requestPayment({
                mock() {
                    return {
                        errMsg: ':ok'
                    };
                }
            })
            .then(function(res){
                var output = {
                    errMsg: ':ok'
                };
                expect(res).toEqual(output);
            });
    });

    
    test('test:React.api.requestPayment:fail', () => {
        return React.api
            .requestPayment({
                mock() {
                    return {
                        errMsg: ':fail'
                    };
                }
            })
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });


    //
    test('test:React.api.requestPayment:success', () => {
        return React.api
            .requestPayment({
                mock() {
                    return {
                        errMsg: ':ok'
                    };
                }
            })
            .then(function(res){
                var output = {
                    errMsg: ':ok'
                };
                expect(res).toEqual(output);
            });
    });

    
    test('test:React.api.requestPayment:fail', () => {
        return React.api
            .requestPayment({
                mock() {
                    return {
                        errMsg: ':fail'
                    };
                }
            })
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });

    
    
});
