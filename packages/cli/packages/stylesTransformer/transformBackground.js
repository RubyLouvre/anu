var Color = require('color');
let transformBackground = (declaration)=>{
    let value = declaration.value;
    try {
        Color(value);
        declaration.property = 'background-color';
    } catch (err) {
        // eslint-disable-next-line
    } 
};

module.exports = transformBackground;