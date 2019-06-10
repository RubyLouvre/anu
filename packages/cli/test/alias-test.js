const calculateAlias = require('../packages/utils/calculateAlias');
const calculateAliasConfig = require('../packages/utils/calculateAliasConfig');
const nodeResolve = require('resolve');


//https://jestjs.io/docs/zh-Hans/mock-functions
jest.mock('../packages/utils/calculateAliasConfig');
jest.mock('resolve');

describe('calculate alias', () => {

    let sourcePath = '/Users/blue/work/anu/packages/cli/packages/demo/source/pages/syntax/await/index.js';
    
    //react 测试
    //import react from '@react';
    test('import react from \'@react\';', ()=>{
        //https://jestjs.io/docs/zh-Hans/mock-functions
        calculateAliasConfig.mockReturnValue({
            '@react': '/Users/blue/work/anu/packages/cli/packages/demo/source/ReactWX.js'
        });
        expect(
            calculateAlias(sourcePath, '@react')
        ).toBe('../../../ReactWX.js');
    });

    //components测试
    //import Cat from '@componenet/Cat/index';
    test('import Cat from \'@components/Cat/index\';', ()=>{
        calculateAliasConfig.mockReturnValue({
            '@components': '/Users/blue/work/anu/packages/cli/packages/demo/source/components'
        });
        expect(
            calculateAlias(sourcePath, '@components/Cat/index')
        ).toBe('../../../components/Cat/index');
    });

    //自定义alias测试
    //import Dog from '@syntaxComponents/Dog/index';
    test('import Dog from \'@syntaxComponents/Dog/index\';', ()=>{
        calculateAliasConfig.mockReturnValue({
            '@syntaxComponents': '/Users/blue/work/anu/packages/cli/packages/demo/source/pages/syntax/components'
        });
        expect(
            calculateAlias(sourcePath, '@syntaxComponents/Dog/index')
        ).toBe('../components/Dog/index');
    });

    //自定义alias测试
    //import getLocalion from '@utils/getLocalion/index';
    test('import getLocalion from \'@utils/getLocalion/index\';', ()=>{
        calculateAliasConfig.mockReturnValue({
            '@utils': '/Users/blue/work/anu/packages/cli/packages/demo/source/utils'
        });
        
        expect(
            calculateAlias(sourcePath, '@utils/getLocalion/index')
        ).toBe('../../../utils/getLocalion/index');
        
    });

    //npm 测试
    //import cookie from 'cookie';
    test('import cookie from \'cookie\';', ()=>{
        nodeResolve.sync.mockReturnValue('/Users/blue/work/anu/packages/cli/packages/demo/node_modules/cookie/index.js');
        expect(
            calculateAlias(sourcePath, 'cookie')
        ).toBe('../../../npm/cookie/index.js');
    });

    //npm 相对路径测试
    //import getName from '../getName';
    test('import getName from \'../getName\';', ()=>{
        expect(
            calculateAlias(sourcePath, '../getName')
        ).toBe('../getName');
    });
    
    
});