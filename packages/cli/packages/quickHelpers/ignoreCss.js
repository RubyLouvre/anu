module.exports =  {
    'box-sizing': true,
     overflow: true,
     display: function(value){ 
        return  !(value === 'flex' || value === 'none')
    }
};