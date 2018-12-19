import React from '@react';
import './index.scss';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
            scale: 2
        };
    }

    tap() {
        this.setState({
            x: 30,
            y: 30
        });
    }

    tap2() {
        this.setState({
            scale: 4
        });
    }

    onChange(e) {
        // eslint-disable-next-line
        console.log(e.detail);
    }

    onScale(e) {
        // eslint-disable-next-line
        console.log(e.detail);
    }

    render() {
        //movable-area解析成了view
        return (
            <div>
                <div class="page-body">
                    <div class="page-section">
                        <div class="page-section-title">
                            movable-view区域小于movable-area
                        </div>
                        <movable-area>
                            <movable-view
                                x={this.state.x}
                                y={this.state.y}
                                direction="all"
                            >
                                text
                            </movable-view>
                        </movable-area>
                    </div>
                    <div class="btn-area">
                        <button
                            size="default"
                            onTap={this.tap}
                            class="page-body-button"
                            type="primary"
                        >
                            click me to move to (30px, 30px)
                        </button>
                    </div>

                    <div class="page-section">
                        <div class="page-section-title">
                            movable-view区域大于movable-area
                        </div>
                        <movable-area>
                            <movable-view class="max" direction="all">
                                text
                            </movable-view>
                        </movable-area>
                    </div>

                    <div class="page-section">
                        <div class="page-section-title">只可以横向移动</div>
                        <movable-area>
                            <movable-view direction="horizontal">
                                text
                            </movable-view>
                        </movable-area>
                    </div>

                    <div class="page-section">
                        <div class="page-section-title">只可以纵向移动</div>
                        <movable-area>
                            <movable-view direction="vertical">
                                text
                            </movable-view>
                        </movable-area>
                    </div>

                    <div class="page-section">
                        <div class="page-section-title">可超出边界</div>
                        <movable-area>
                            <movable-view direction="all" out-of-bounds>
                                text
                            </movable-view>
                        </movable-area>
                    </div>

                    <div class="page-section">
                        <div class="page-section-title">带有惯性</div>
                        <movable-area>
                            <movable-view direction="all" inertia>
                                text
                            </movable-view>
                        </movable-area>
                    </div>

                    <div class="page-section">
                        <div class="page-section-title">可放缩</div>
                        <movable-area scale-area>
                            <movable-view
                                direction="all"
                                onChange={this.onChange}
                                onScale={this.onScale}
                                scale
                                scale-min="0.5"
                                scale-max="4"
                                scale-value={this.state.scale}
                            >
                                text
                            </movable-view>
                        </movable-area>
                    </div>

                    <div class="btn-area">
                        <button
                            onTap={this.tap2}
                            class="page-body-button"
                            type="primary"
                        >
                            click me to scale to 3.0
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default P;
