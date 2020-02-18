require('./utils/apiMock');
const React = require('./ReactWX').default;
describe('test I/O', () => {

    test('test:React.api.request:success', () => {
        return React.api
            .request({
                mock() {
                    return {
                        errMsg: ':ok',
                        data: {
                            list: [{}]
                        }
                    };
                }
            })
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    data: {
                        list: [{}]
                    }
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.request:fail', () => {
        return React.api
            .request(
                {
                    
                    mock() {
                        return {
                            errMsg: ':fail',
                            data: null
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail',
                    data: null
                };
                expect(err).toEqual(output);
            });
    });


    test('test:React.api.uploadFile:success', () => {
        return React.api
            .uploadFile(
                {
                    mock() {
                        return {
                            errMsg: ':ok',
                            data: {
                                img: 'https://picbed.qunarzz.com/e62a57efbe95e4f8bd75e49c63aae256.jpg'
                            }
                        };
                    }
                }
            )
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    data: {
                        img: 'https://picbed.qunarzz.com/e62a57efbe95e4f8bd75e49c63aae256.jpg'
                    }
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.uploadFile:fail', () => {
        return React.api
            .uploadFile(
                {
                    mock() {
                        return {
                            errMsg: ':fail'
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });

    test('test:React.api.downloadFile:success', () => {
        return React.api
            .downloadFile(
                {
                    mock() {
                        return {
                            errMsg: ':ok',
                            data: {
                                k: 1
                            }
                        };
                    }
                }
            )
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    data: {
                        k: 1
                    }
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.downloadFile:fail', () => {
        return React.api
            .downloadFile(
                {
                    mock() {
                        return {
                            errMsg: ':fail',
                            data: {
                                k: 1
                            }
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail',
                    data: {
                        k: 1
                    }
                };
                expect(err).toEqual(output);
            });
    });


    test('test:React.api.saveFile:success', () => {
        return React.api
            .saveFile(
                {
                    mock() {
                        return {
                            errMsg: ':ok',
                            tempFilePaths: ['/a/b/c.jpg']
                        };
                    }
                }
            )
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    tempFilePaths: ['/a/b/c.jpg']
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.saveFile:fail', () => {
        return React.api
            .saveFile(
                {
                    mock() {
                        return {
                            errMsg: ':fail'
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });

    test('test:React.api.getFileInfo:success', () => {
        return React.api
            .getFileInfo(
                {
                    mock() {
                        return {
                            errMsg: ':ok',
                            size: 1000
                        };
                    }
                }
            )
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    size: 1000
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.getSavedFileList:fail', () => {
        return React.api
            .getFileInfo(
                {
                    mock() {
                        return {
                            errMsg: ':fail'
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });



    test('test:React.api.getSavedFileList:success', () => {
        return React.api
            .getSavedFileList(
                {
                    mock() {
                        return {
                            errMsg: ':ok',
                            fileList: ['a', 'b', 'c']
                        };
                    }
                }
            )
            .then(function(res){
                var output = {
                    errMsg: ':ok',
                    fileList: ['a', 'b', 'c']
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.getSavedFileList:fail', () => {
        return React.api
            .getSavedFileList(
                {
                    mock() {
                        return {
                            errMsg: ':fail'
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });
    


    test('test:React.api.removeSavedFile:success', () => {
        return React.api
            .removeSavedFile(
                {
                    mock() {
                        return {
                            errMsg: ':ok'
                        };
                    }
                }
            )
            .then(function(res){
                var output = {
                    errMsg: ':ok'
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.removeSavedFile:fail', () => {
        return React.api
            .removeSavedFile(
                {
                    mock() {
                        return {
                            errMsg: ':fail'
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });



    test('test:React.api.openDocument:success', () => {
        return React.api
            .openDocument(
                {
                    mock() {
                        return {
                            errMsg: ':ok'
                        };
                    }
                }
            )
            .then(function(res){
                var output = {
                    errMsg: ':ok'
                };
                expect(res).toEqual(output);
            });
    });

    test('test:React.api.openDocument:fail', () => {
        return React.api
            .openDocument(
                {
                    mock() {
                        return {
                            errMsg: ':fail'
                        };
                    }
                }
            )
            .catch(function(err){
                var output = {
                    errMsg: ':fail'
                };
                expect(err).toEqual(output);
            });
    });

    
});
