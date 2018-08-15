import React from '../../../ReactWX';

class Audio extends React.Component {
    config = {
        title: 'media'
    };
    
    constructor() {
        this.state = {
            components: [
                {
                    url: '/pages/demo/extend/Dog',
                    title: 'Dog'
                },
                {
                    url: '/pages/demo/extend/Husky',
                    title: 'Husky'
                }
            ]
        };
    }

    render() {
        return (
            <div>
                {this.state.components.map(function(component) {
                    return (
                        <navigator
                            open-type="navigate"
                            class="item"
                            hover-class="navigator-hover"
                            url={component.url}
                        >
                            <div class="list-item">{component.title}</div>
                        </navigator>
                    );
                })}
            </div>
        );
    }
}

Page(React.createPage(Audio, 'pages/demo/extend/index'));

export default Audio;
