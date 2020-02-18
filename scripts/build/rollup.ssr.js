import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
//import builtins from "rollup-plugin-node-builtins";

export default {
 

    input: './packages/render/server/index.js',
    
    output: {
        strict: false,
        format: 'umd',
        // exports: 'default',
        file:  './dist/ReactDOMServer.js',
        name: 'ReactDOMServer',
      
    },


    plugins: [babel(),cleanup()],
   
};
