// eslint-disable-next-line
import React from '@react';
import './index.scss';
export default function Fish(props){
    return <div class="anu-block">
        <div class="justify-content: flex-start ">
         Fish[{props.id}]:{props.content}
        </div>
    </div>;
}