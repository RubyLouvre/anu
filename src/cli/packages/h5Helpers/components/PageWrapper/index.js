import React from '@react';

import './index.scss';

class PageWrapper extends React.Component{
    constructor(props){
        super(props);
        this.Comp = React.createRef();
        this.$app = props.app;
        this.initAppConfig();
    }
    initAppConfig() {
        this.appConfig = this.props.app.constructor.config || {};
        // 将window字段扁平化
        Object.assign(this.appConfig, this.appConfig.window);
        delete this.appConfig.window;
    }
    render(){
        const instances = React.getCurrentPages();
        return (
            <div className='__internal__Page__' >
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