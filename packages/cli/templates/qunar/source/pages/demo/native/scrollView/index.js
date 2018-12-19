import React from '@react';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();
        this.order = ['red', 'yellow', 'blue', 'green', 'red'];
        this.state = {
            toView: 'red',
            scrollTop: 100
        };
    }

    upper(e) {
        // eslint-disable-next-line
        console.log(e);
    }

    lower(e) {
        // eslint-disable-next-line
        console.log(e);
    }

    scroll(e) {
        // eslint-disable-next-line
        console.log(e);
    }

    tap() {
        for (var i = 0; i < this.order.length; ++i) {
            if (this.order[i] === this.state.toView) {
                this.setState({
                    toView: this.order[i + 1]
                });
                break;
            }
        }
    }

    tapMove() {
        var _self = this;
        this.setState({
            scrollTop: _self.state.scrollTop + 10
        });
    }

    render() {
        return (
            <div>
                <div class="section">
                    <div class="section__title">vertical scroll</div>
                    <scroll-view
                        scroll-y
                        style="height: 200px; overflow: hidden;"
                        onScrolltoupper={this.upper}
                        onScrolltolower={this.lower}
                        onScroll={this.scroll}
                        scroll-into-div={this.state.todiv}
                        scroll-top={this.state.scrollTop}
                    >
                        <div id="green" class="scroll-view-item bc_green" />
                        <div id="red" class="scroll-view-item bc_red" />
                        <div id="yellow" class="scroll-view-item bc_yellow" />
                        <div id="blue" class="scroll-view-item bc_blue" />
                    </scroll-view>

                    <div class="btn-area">
                        <button size="mini" onTap={this.tap}>
                            click me to scroll into div{' '}
                        </button>
                        <button size="mini" onTap={this.tapMove}>
                            click me to scroll
                        </button>
                    </div>
                </div>
                <div class="section section_gap">
                    <div class="section__title">horizontal scroll</div>
                    <scroll-view
                        class="scroll-view_H"
                        scroll-x
                        style="width: 100%"
                    >
                        <div id="green" class="scroll-view-item_H bc_green" />
                        <div id="red" class="scroll-view-item_H bc_red" />
                        <div id="yellow" class="scroll-view-item_H bc_yellow" />
                        <div id="blue" class="scroll-view-item_H bc_blue" />
                    </scroll-view>
                </div>
            </div>
        );
    }
}

export default P;
