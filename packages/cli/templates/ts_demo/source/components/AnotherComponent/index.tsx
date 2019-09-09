// eslint-disable-next-line
import React from '@react';

interface ComponentProps {
    text: string;
}

export default function AnotherComponent(props: ComponentProps) {
    //它要表示为一个组件，因此必须 大写开头
    console.log('AnotherComponent init'); //debug
    return <div> {props.text} </div>;
}
