import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.scss';

export default function cssTransitionWrapper(Comp) {
    return class Wrapper extends React.Component {
        render() {
            return (
                <CSSTransition
                    classNames={this.props.isTabPage ? 'tab' : 'page'}
                    timeout={true}
                    in={true}
                    appear
                >
                    <Comp {...this.props}/>
                </CSSTransition>
            );
        }
    };
}