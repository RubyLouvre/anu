const path = require('path');
const fs = require('fs-extra');
const spawn = require('cross-spawn');

module.exports = ()=>{
    let cliDir = path.resolve(__dirname, '..');
    process.chdir(cliDir);

    try {
        fs.unlink(path.join(cliDir, 'package-lock.json'));
    } catch (err){
        // eslint-disable-next-line
    }
    
    let options = ['install'];
    let bin = 'npm';
    spawn.sync(bin, options, { stdio: 'inherit' });
    
};