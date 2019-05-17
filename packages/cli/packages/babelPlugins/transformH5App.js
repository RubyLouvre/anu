const template = require('@babel/template').default;

const importedPagesTemplatePrefixCode = template(`
import Loadable from 'react-loadable';
import QunarDefaultLoading from '@qunar-default-loading';
`)();

const buildAsyncImport = template(
    `
  const PAGE_NAME = Loadable({
    loader: () => import('IMPORT_PATH'),
    loading: QunarDefaultLoading,
    delay: 300
  });`,
    {
      plugins: ['dynamicImport']
    }
);

const visitor = {
    Program: {
        enter(astPath) {
            // console.log(importedPagesTemplatePrefixCode);
            // astPath.node.body.unshift(...importedPagesTemplatePrefixCode);
        }
    },
    ImportDeclaration(astPath) {
        // console.log(astPath.node.body);
    }
};
module.exports = function(){
    return {
        visitor: visitor
    };
};
    