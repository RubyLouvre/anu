import React from '@react';

import './index.scss';

class PageWrapper extends React.Component{
    constructor(props){
        super(props);
        this.Comp = React.createRef();
        this.$app = props.app;
        this.initAppConfig();
        this.state = {
            pageAppear: true
        };
    }
    initAppConfig() {
        this.appConfig = this.props.app.constructor.config || {};
        // 将window字段扁平化
        Object.assign(this.appConfig, this.appConfig.window);
        delete this.appConfig.window;
    }
    componentWillReceiveProps(nextProps) {
        // 页面跳转 且不是后退操作时更改pageAppear控制跳转动画
        if (nextProps.path !== this.props.path && !this.props.showBackAnimation) {
            this.setState({
                pageAppear: false
            });
        }
    }
    componentDidUpdate() {
        if (!this.state.pageAppear) {
            this.setState({
                pageAppear: true
            });
        }
    }
    render(){
        const instances = React.getCurrentPages();
        return (
            <div className={`__internal__Page__ ${this.state.pageAppear ? 'page-appear-done' : 'page-appear'}`} >
                {instances.map((page, index) => {
                    let className = '__hidden';
                    if (index === instances.length - 1) {
                        className = `__internal__Page-container ${this.props.showBackAnimation ? '__backAnimation' : ''}`;
                    } else if (index === instances.length - 2) {
                        className = `${this.props.showBackAnimation ? '__bottom' : '__hidden'}`;
                    }
                    return <div className={className}>
                        {page}
                    </div>;
                })}
                <div className='__internal__Modal__'></div>
            </div>
        );
    }
}

export default PageWrapper;