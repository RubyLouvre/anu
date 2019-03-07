import { _getApp } from '../utils';
import { runCallbacks } from '../utils';

export function setNavigationBarTitle({ title, success, fail, complete }) {
    runCallbacks(function(){
        let currentPage = _getApp().$$page; //相当于getCurrentPage()
        currentPage.$page.setTitleBar({ text: title });
    }, success, fail, complete );
}