// eslint-disable-next-line
import React from "@react";
import Count from '../Count/index';
export default function Dialog(props) {
    return (
        <div style="background:#f3f3f3;border:2px solid #dadada;margin:3px;">
            <p>{props.children}</p>
            <Count a={2018} b={19} />
        </div>
    );
}
