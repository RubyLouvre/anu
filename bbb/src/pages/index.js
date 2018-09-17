import React from '@react';
import MouseTracker from '@components/MouseTracker/index';
import Cursor from '@components/Cursor/index';
class P extends React.Component {
    constructor() {
        super();
        this.state = { };
    }
    render() {
        return (
            <div>
                <MouseTracker render={(state)=>{
                    return <div>render props<Cursor mouse={state} /></div>;
                }} />
            </div>
        );
    }
}

export default P;
