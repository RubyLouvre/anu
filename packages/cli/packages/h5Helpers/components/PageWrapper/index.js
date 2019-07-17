import React from '@react';

import './index.scss';

class PageWrapper extends React.Component{
    constructor(props){
        super(props);
        this.Comp = React.createRef();
        this.$app = props.app;
        this.initAppConfig();
        this.state = {
            pagePath: ''
        };
    }
    initAppConfig() {
        this.appConfig = this.props.app.constructor.config || {};
        // 将window字段扁平化
        Object.assign(this.appConfig, this.appConfig.window);
        delete this.appConfig.window;
    }
    get pagePath() {
        return this.$app.state.path;
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
                <style jsx>{`
                        .__internal__Page__ {
                            width: 100%;
                            height: 100%;
                            min-width: 320px;
                            max-width: 480px;
                            margin: 0 auto;
                            overflow: hidden;
                            position: relative;
                        }
                        .__internal__Page-container {
                            width: 100%;
                            height: 100%;
                            -webkit-overflow-scrolling: touch;
                        }
                        .__hidden {
                            display: none;
                        }
                        .__bottom {
                            position: absolute;
                            width: 100%;
                        }
                        .__backAnimation {
                            transform: translateX(375px);
                            transition: transform 500ms ease;
                        }
                    `}
                </style>
            </div>
        );
    }
}

export default PageWrapper;