import React from '@react';
import { GlobalTheme } from '@common/GlobalTheme/index'; //@common 别名在package.json中配置
import Layout from '@components/Layout/index';
import AnotherComponent from '@components/AnotherComponent/index';
import './index.scss';
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
                    <AnotherComponent text='Hello Typescript!' />
                </Layout>
            </GlobalTheme.Provider>
        </div>
        );
    }
}

export default P;