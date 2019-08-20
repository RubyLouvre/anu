import React from '@react';
import { GlobalTheme } from '@common/GlobalTheme/index';
export default function Layout(props) {
    const globalStyle = React.useContext(GlobalTheme);
    console.log('Layout init', globalStyle); //debug
    return <div style={globalStyle}>{props.children}</div>;
}
