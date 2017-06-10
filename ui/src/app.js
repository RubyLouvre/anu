//import 'babel-polyfill'

import Tooltip from './coast';

var btn = document.querySelectorAll('.demo');

btn[0].addEventListener('click', function() {
    console.log('tooltip');
    Tooltip.show('the tooltip autoHide after 2s');
}, false);

btn[1].addEventListener('click', function() {
    console.log('tooltip 2')
    Tooltip.show('the tooltip autoHide after 3s', 3000);
}, false);

btn[2].addEventListener('click', function() {
    console.log('tooltip 3')
    var tip = Tooltip.show('the tooltip will be hidden before the default time 2s');
    setTimeout(()=>tip.hide(), 1000);
}, false);