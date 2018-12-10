import React from '@react';

class Loading extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div class="cntloading">
                {this.props.text || '加载中...'}
                <div>
                    <text class="cl1" />
                    <text class="cl2" />
                    <text class="cl3" />
                </div>
            </div>
        );
    }
}
export default Loading;
