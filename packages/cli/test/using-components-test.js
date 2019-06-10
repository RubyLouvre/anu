const calculateAliasConfig = require('../packages/utils/calculateAliasConfig');

//https://jestjs.io/docs/zh-Hans/mock-functions
jest.mock('../packages/utils/calculateAliasConfig');

//https://stackoverflow.com/questions/55906920/how-to-mock-the-process-cwd-function-with-jest
const process = require('process');
const spy = jest.spyOn(process, 'cwd');
spy.mockReturnValue('/Users/blue/work/anu/packages/cli/packages/demo');

describe('calculate using components path', () => {

    let sourcePath = '/Users/blue/work/anu/packages/cli/packages/demo/source/pages/syntax/await/index.js';
    
    //using components path 测试
    //import Cat from '@componenet/Cat/index';
    test('import Cat from \'@components/Cat/index\';', ()=>{
        const calculateComponentsPath = require('../packages/utils/calculateComponentsPath');
        calculateAliasConfig.mockReturnValue({
            '@components': '/Users/blue/work/anu/packages/cli/packages/demo/source/components'
        });
        expect(
            calculateComponentsPath({
                sourcePath: sourcePath,
                source: '@components/Cat/index'
            })
        ).toBe('/components/Cat/index');
    });

    //import Dog from '@syntaxComponents/Dog/index';
    test('import Dog from \'@syntaxComponents/Dog/index\';', ()=>{
        const calculateComponentsPath = require('../packages/utils/calculateComponentsPath');
        calculateAliasConfig.mockReturnValue({
            '@syntaxComponents': '/Users/blue/work/anu/packages/cli/packages/demo/source/pages/syntax/components'
        });
        expect(
            calculateComponentsPath({
                sourcePath: sourcePath,
                source: '@syntaxComponents/Dog/index'
            })
        ).toBe('/pages/syntax/components/Dog/index');
      
    });

});