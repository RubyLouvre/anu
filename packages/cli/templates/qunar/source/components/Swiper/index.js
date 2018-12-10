import React from '@react';
import './index.scss';
/* eslint no-console: 0 */


function createArrayByLength(length) {
    var arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(i);
    }
    return arr;
}

class Swiper extends React.Component {
    static defaultProps = {
        indicatorDots: false,
        indicatorColor: 'rgba(0, 0, 0, .3)',
        indicatorActiveColor: '#000',
        autoplay: false,
        current: 0,
        cuurentItemId: '',
        interval: 5000,
        duration: 500,
        circular: false,
        vertical: false,
        previousMargin: '0px',
        nextMargin: '0px',
        displayMultipleItems: 1,
        skipHiddenItemLayout: false,
        bindchange: () => {},
        bindanimationfinish: () => {}
    };

    constructor() {
        super();
        this.state = {
            translateX: 0,
            translateY: 0,
            wrapperTranslateX: 0,
            wrapperTranslateY: 0,
            touching: false,
            curIndex: this.props.current,
            arr: []
        };
        this.count = 0;
        this.pageX = 0;
        this.pageY = 0;
        this.arr = [];
    }

    handleTouchStart(e) {
        console.log('handleTouchStart');
        const point = e.touches ? e.touches[0] : e;
        this.pageX = point.pageX;
        this.pageY = point.pageY;
        this.setState({
            touching: true
        });
    }

    handleTouchMove(e) {
        console.log('handleTouchMove');
        const point = e.touches ? e.touches[0] : e;
        const deltaX = point.pageX - this.pageX;
        // const deltaY = point.pageY - this.pageY;
        this.setState({
            translateX: this.state.translateX + deltaX
        });
        this.pageX = point.pageX;
        this.pageY = point.pageY;
    }

    handleTouchEnd() {
        console.log('handleTouchEnd');
        const deltaX = this.state.translateX;
        //  const deltaY = this.state.translateY;
        let nextIndex = this.state.curIndex;
        if (deltaX < -30) {
            if (this.state.curIndex + 1 < this.count) {
                nextIndex++;
                setTimeout(() => {
                    this.setState({
                        curIndex: this.state.curIndex + 1
                    });
                }, 400);
            }
        } else if (deltaX > 30) {
            if (this.state.curIndex - 1 >= 0) {
                nextIndex--;
                setTimeout(() => {
                    this.setState({
                        curIndex: this.state.curIndex - 1
                    });
                }, 400);
            }
        }
        this.setState({
            touching: false
        });
        this.goto(nextIndex);
    }

    goto(index) {
        this.setState({
            translateX: 0,
            wrapperTranslateX: `-${100 * index}%`
        });
    }

    calculateTransform(x, y) {
        typeof x === 'number' && (x = `${x}PX`);
        typeof y === 'number' && (y = `${y}PX`);
        return `translate(${x}, ${y})`;
    }

    componentWillMount() {
        this.count = this.props.children && this.props.children.length;
        this.setState({
            arr: createArrayByLength(this.count)
        });
    }

    render() {
        console.log(this.props.children, this.state.arr);
        return (
            <div className="anu-swiper">
                <div className="anu-swiper__wrapper"
                    style={{ transform: this.calculateTransform(this.state.wrapperTranslateX, this.state.wrapperTranslateY) }}
                >
                    <div className={this.state.touching ? 'anu-swiper__content' : 'anu-swiper__content anu-swiper__content--transition'}
                        style={{ transform: this.calculateTransform(this.state.translateX, this.state.translateY) }}
                        onTouchStart={this.handleTouchStart.bind(this)}
                        onTouchMove={this.handleTouchMove.bind(this)}
                        onTouchEnd={this.handleTouchEnd.bind(this)}
                        onTouchCancel={this.handleTouchEnd.bind(this)}
                    >
                        {this.props.children}
                    </div>
                </div>
                <div className="anu-swiper__pagination">
                    {this.state.arr.map(function(item, index) {
                        return (index === this.state.curIndex ?
                            <div className="anu-swiper__pagination-bullet anu-swiper__pagination-bullet--active"></div> :
                            <div className="anu-swiper__pagination-bullet"></div>);
                    })}
                </div>
            </div>
        );
    }
}

export default Swiper;
