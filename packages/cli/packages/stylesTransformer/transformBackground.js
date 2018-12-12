let transformBackground = (declaration)=>{
    let value = declaration.value;
    let match = [
        /^#[a-zA-Z0-9]{3,6}$/i,   //16进制
        /^[a-z]{3,}$/i            //语意化颜色 [ blue | green | ...]
    ];
    for (let i = 0; i < match.length; i++){
        if (match[i].test(value)) {
            declaration.property = 'background-color';
            break;
        }
    }
};

module.exports = transformBackground;