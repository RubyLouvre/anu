import React, { Component } from 'react';

class TitleBar extends Component {
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
            <header className="__internal__Header">
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
                <style jsx>
                    {`
                    .__internal__Header {
                        width: 100%;
                        height: ${titleBarHeight}px;
                        line-height: ${titleBarHeight}px;
                        background-color: ${navigationBarBackgroundColor};
                        position: absolute;
                        top: 0;
                        left: 0;
                        text-align: center;
                        color: ${navigationBarTextStyle};
                    }
                    .__internal__Header-title {
                        flex-grow: 1;
                        padding: 0 48px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .__internal__Header-title {
                        margin-left: 6px;
                    }
                    .__internal__Header-back {
                        width: 48px;
                        height: 100%;
                        font-size: 14px;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    .__internal__Header-back:active {
                        background-color: rgba(255, 255, 255, 0.15);
                    }
                `}
                </style>
            </header>
        );
    }
}

export default TitleBar;
