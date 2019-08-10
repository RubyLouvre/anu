import React, { Component } from 'react';
import './index.scss';

class TitleBar extends Component {
    constructor(props) {
        super(props);
        this.randomClassName = 'r' + Math.floor(Math.random()*100000);
    }
    get page() {
        return this.props.page;
    }

    get App() {
        return this.props.page.App;
    }

    handleBack() {
        React.api.navigateBack();
    }

    render() {
        const {
            titleBarHeight,
            navigationBarTextStyle,
            navigationBarTitleText,
            navigationBarBackgroundColor,
            backButton = false,
            // animation: { duration, timingFunc }
        } = this.props;
        return (
            <header className="__internal__Header" style={
                {
                    height: `${titleBarHeight}px`,
                    lineHeight: `${titleBarHeight}px`,
                    backgroundColor: `${navigationBarBackgroundColor}`,
                    color: `${navigationBarTextStyle}`
                }
            }>
                {backButton ? (
                    <div
                        className="__internal__Header-back"
                        onClick={this.handleBack}
                    >
                        返回
                    </div>
                ) : null}
                <div className="__internal__Header-title">
                    <div className="__internal__Header-title">
                        {navigationBarTitleText}
                    </div>
                </div>
            </header>
        );
    }
}

export default TitleBar;
