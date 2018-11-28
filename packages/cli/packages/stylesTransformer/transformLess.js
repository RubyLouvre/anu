const less = require('less');
const validateStyle = require('../validateStyle');
const renderLess = (filePath, originalCode)=>{
    return new Promise((resolve, reject)=>{
        less.render(
            originalCode,
            {
                filename: filePath
            }
        )
            .then((res)=>{
                let code = validateStyle(res.css);
                resolve({
                    code: code
                });
            })
            .catch((err)=>{
                reject(err);
            });
    });
};

module.exports = renderLess;