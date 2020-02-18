// TODO 用React Portals 可以更好的实现
import React from '@react';
import { Component } from 'react-core/Component';
import { handleSuccess } from '../utils';

class PreviewImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            current: 0
        };
        this.container = this.props.container;  // 创建的容器
        this.close = this.close.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
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
        var el = this.container;
        if (el && el.parentNode){
            el.parentNode.removeChild(el);
        }
    }

    gotoPrevious() {  // 上一张图片
        var urls = this.props.urls;
        var index =  urls.indexOf(this.state.current)-1;
        if (index < 0){
            index =  urls.length-1;
        }
        this.setState({
            current: urls[index]
        });
    }

    gotoNext() {     // 下一张图片
        var urls = this.props.urls;
        var index =  urls.indexOf(this.state.current)+1;
        if (index === urls.length){
            index =  0;
        }
        this.setState({
            current: urls[index]
        });
    }

    close() {
        this.componentWillUnmount();
    }

    render() {
        return (
            <div className='showImg2019'>
                <image src={this.state.current} />
                <style ref={(node) => {
                    Object(node).textContent = `
                    .showImg2019{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: fixed;
                        width:100%;
                    }
                    .showImg2019 img{
                        width:100%;
                    }`;
                }}>
                </style>
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
        var el = document.querySelector('#h5-api-previewMask');  // 获取页面中的div节点
        if (!el){  // 判断当前是否创建了元素节点，若没有创建。则进行创建
            var id = 'h5-api-previewMask';
            var imgModal = document.querySelector('.__internal__Page-container');
            var container = document.createElement('div');
            container.id = id;
            container.style.position = 'fixed';
            container.style.top = 0;
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.backgroundColor = 'rgba(0,0,0,0.7)';
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            imgModal.appendChild(container);
    
            var startX, startTimeX = 0;
            container.ontouchstart = function(e){
                startX = e.touches[0].pageX;
                startTimeX = e.timeStamp;
            };
            container.ontouchend = function(e){
                var endX = e.changedTouches[0].pageX;
                var endStartTime = e.timeStamp;
                if (!instance || !e.changedTouches[0]){
                    return;
                }
                if (endStartTime - startTimeX <= 200 || Math.abs(endX-startX)<10){
                    //点击事件
                    setTimeout(function(){
                        instance.close();
                    }, 0);
                    startTimeX = 0;
                    return;
                }
                if (startX != null){
                    if (endX-startX > 0){
                        instance.gotoPrevious();
                        startX = null;
                    } else {
                        instance.gotoNext();
                        startX = null;
                    }
                }
            };
            React.render(
                <PreviewImage
                    success={success}
                    fail={fail}
                    urls={urls}
                    container={container}
                    complete={complete}
                    resolve={resolve}
                    reject={reject}
                    ref={(refs)=>{
                        if (refs){
                            instance = React.api.previewImageSingleton = refs;
                        }
                    }}
                />,
                container,function(){
                    instance.setState({
                        visible: true,
                        current
                    });
                }
            );
        } else {
            instance.setState({
                visible: true,
                current
            });
        }
    });
}

export default {
    previewImage
};
