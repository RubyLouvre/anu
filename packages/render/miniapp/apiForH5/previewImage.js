// TODO 用React Portals 可以更好的实现
import React from '@react';
import { Component } from 'react-core/Component';
import { DOMRenderer } from '../../dom/DOMRenderer';
// import Lightbox from 'react-images';
import { handleSuccess, handleFail } from '../utils';

// let that = null;
// let container = null;

class PreviewImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            urls: [],
            current: 0
        };
        this.container = this.props.container;  // 创建的容器
        this.close = this.close.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoImage = this.gotoImage.bind(this);
    }
    componentDidMount() {
        handleSuccess(
            {
                errMsg: 'previewImage:ok'
            },
            this.props.success,
            this.props.complete,
            this.props.resolve
        );
    }

    componentWillUnmount() {
        React.api.previewImageSingleton = null;
        document.removeChild(this.container);
    }

    gotoPrevious() {
        this.setState({
            current: this.state.current - 1
        });
    }

    gotoNext() {
        this.setState({
            current: this.state.current + 1
        });
    }

    gotoImage(index) {
        this.setState({
            current: index
        });
    }

    close() {
        this.setState({
            visible: false
        });
    }

    render() {
        // const { visible, urls, current } = this.state;

        // this.container.style = visible
        //     ? 'width: 100%;height: 100%;position: fixed;'
        //     : 'none';

        return (
            <div>
                {
                    // React.api.createModal(<p>q;</p>)
                }
                <image src={this.state.current} />
                {/* <Lightbox
                    images={urls.map(src => {
                        return {
                        src
                        };
                    })}
                    isOpen={visible}
                    currentImage={current}
                    onClickPrev={this.gotoPrevious}
                    onClickNext={this.gotoNext}
                    onClose={this.close}
                    /> */}
            </div>
        );
    }
}

/**
 * 预览图片
 * @param {Array} urls 要预览的图片链接列表
 * @param {String} current 当前显示图片的链接, urls 的第一张
 */
function previewImage(options = {}) {
    return new Promise(function(resolve, reject) {
        const {
            urls,
            current,
            success = () => {},
            fail = () => {},
            complete = () => {}
        } = options;
        var instance = React.api.previewImageSingleton;
        if (!instance){
            var internalModal = document.getElementsByClassName('__internal__Modal__')[0];
            var container = document.createElement('div');
            internalModal.appendChild(container);
            // document.body.appendChild(container);
            React.render(
                <PreviewImage
                    success={success}
                    fail={fail}
                    container={container}
                    complete={complete}
                    resolve={resolve}
                    reject={reject}
                    ref={(refs) => {
                        if (refs){
                            instance = React.api.previewImageSingleton = refs;
                        }
                    }}
                />,
                container, function() {
                    instance.setState({
                        visible: true,
                        urls,
                        current
                    });
                }
            );
        } else {
            instance.setState({
                visible: true,
                urls,
                current
            });
        }
    });
}

export default {
    previewImage
};
