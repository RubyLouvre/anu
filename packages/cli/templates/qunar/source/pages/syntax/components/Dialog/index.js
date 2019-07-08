// eslint-disable-next-line
import React from '@react';
import Count from '@syntaxComponents/Count/index';
import './index.scss';
export default function Dialog(props) {
    return (
        <div class="anu-block" style="background-color:#f3f3f3;border:2px solid #dadada;margin:3px;">
            <p class="anu-block">{props.children}</p>
            <Count a={2018} b={19} />
        </div>
    );
}
