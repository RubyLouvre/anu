import React from '@react';
import './index.scss';
import Counter from '@syntaxComponents/Counter/index';

class P extends React.Component {
    render() {
        return (
            <div class="anu-block">
                <div >React Hooks,useState, useEffect, useContext</div>
                <Counter initCount={0} count={0} />
            </div>
        );
    }
}

export default P;
