import React from '@react';
import { GlobalTheme } from '@common/GlobalTheme/index'; //@common 别名在package.json中配置
import Layout from '@components/Layout/index';
import AnotherComponent from '@components/AnotherComponent/index';
import { observer, inject } from 'mobx-react';
import './index.scss';

declare namespace React {
    class Component {
        props: any;
    }
}

@inject(
    (state: any) => ({
        text: state.store.text
    })
)
@observer
class P extends React.Component {
    state = {
        anyVar: { color: 'red' }
    };
    componentDidMount() {
        // eslint-disable-next-line
        console.log('page did mount!');
    }
    render() {
        console.log(this.state.anyVar, '!!')
        return (<div class="page" >
            <GlobalTheme.Provider value={this.state.anyVar} >
                <Layout>
                    <AnotherComponent text={this.props.text} />
                </Layout>
            </GlobalTheme.Provider>
        </div>
        );
    }
}

export default P;