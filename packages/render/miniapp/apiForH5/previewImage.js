// TODO 用React Portals 可以更好的实现
import { Component } from 'react-core/Component';
import { DOMRenderer } from '../../dom/DOMRenderer';
// import Lightbox from 'react-images';
import { handleSuccess, handleFail } from '../utils';

let that = null;
let container = null;

class PreviewImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            urls: [],
            current: 0
        };

        this.close = this.close.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoImage = this.gotoImage.bind(this);

        that = this;
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
        document.removeChild(container);
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
        const { visible, urls, current } = this.state;

        container.style = visible
            ? 'width: 100%;height: 100%;position: fixed;'
            : 'none';

        return (
            <div>
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
        container = document.createElement('div');
        document.body.appendChild(container);
        DOMRenderer.render(
            <PreviewImage
                success={success}
                fail={fail}
                complete={complete}
                resolve={resolve}
                reject={reject}
            />,
            container
        );

        that.setState({
            visible: true,
            urls,
            current
        });
    });
}

export default {
    previewImage
};
