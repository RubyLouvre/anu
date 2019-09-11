// eslint-disable-next-line
import React from '@react';
import { observer, inject } from 'mobx-react';

declare namespace React {
    class Component {
        props: any;
    }
}

@inject(
    (state: any) => ({
        addText: state.store.addText
    })
)
@observer
class AnotherComponent extends React.Component{
    render() {
        return <div onClick={() => {this.props.addText()}}> {this.props.text} </div>;
    }
}

export default AnotherComponent;
