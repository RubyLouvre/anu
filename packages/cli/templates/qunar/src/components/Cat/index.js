// eslint-disable-next-line
import React from '@react';
import './index.scss';

export default function Cat(props){
    return <div class="anu-block">
        <div class="justify-content: flex-end ">
            {props.content}:Cat[{props.id}]
        </div>
    </div>;
}