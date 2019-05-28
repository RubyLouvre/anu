import ReactDOM from 'react-dom';
import { compose } from 'ramda';
import App from './views/App';
import AppStore from './store';
import injectGlobalStyles from './views/AppWrapper/injectGlobalStyles';
import useMobxDevTools from './views/AppWrapper/useMobxDevTools';
import injectStore from './views/AppWrapper/injectStore';
import calculateRem from './views/AppWrapper/calculateRem';

const shouldUseMobxDevTools = false;

const wrapApp = compose(
    // 注入 mobx 开发工具
    useMobxDevTools(shouldUseMobxDevTools),
    // 注入全局样式
    injectGlobalStyles,
    // 注入 store
    injectStore(AppStore),
    // 动态计算根节点 rem 以保证设计稿还原准确
    calculateRem
);

ReactDOM.render(wrapApp(App), document.querySelector('#app'));
