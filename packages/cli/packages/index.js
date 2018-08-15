const init = require('./init');
const build = require('./build');
const LetUsRoll = (args)=>{
    route(args[0])
}

const route = (arg)=>{
    switch(arg){
       case 'start':
         build(arg);
         break;
       case 'build':
         build(arg);
         break;
       default:
         init(arg)
    }
}

module.exports = LetUsRoll;