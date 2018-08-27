import React from '@react';
class P extends React.Component {
    constructor() {
        super();
        const ROOT_PATH = '/pages/demo/view';
        this.state = {
            nv: [
                {
                    url: `${ROOT_PATH}/view/index`,
                    name: 'view'
                },
                {
                    url: `${ROOT_PATH}/swiper/index`,
                    name: 'swiper'
                },
                {
                    url: `${ROOT_PATH}/movableView/index`,
                    name: 'movable view'
                }
            ]
        };
    }

    render() {
        return (
            <div class="container">
                <ul class="item-list">
                    {//issues, 渲染class上非state数据
                        this.state.nv.map(function(item) {
                            return (
                                <li class="item">
                                    <navigator
                                        open-type="navigate"
                                        hover-class="navigator-hover"
                                        url={item.url}
                                    >
                                        {item.name}
                                    </navigator>
                                </li>
                            );
                        }, true)}
                </ul>
            </div>
        );
    }
}

export default P;
