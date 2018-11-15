import React from '@react';
import './index.scss';
import Navigator from '@components/Navigator/index';

/*eslint-disable*/
class P extends React.Component {
    constructor() {
        super();
        const ROOT_PATH = "/pages/demo/native";
        this.state = {
            title: "原生组件",
            array: "button,checkbox,input,slider,picker,radio,textarea,label,audio,camera,image,video"
                .split(",")
                .map(function(name) {
                    return {
                        url: `${ROOT_PATH}/${name}/index`,
                        name: name
                    };
                })
        };
    }
    config = {
        navigationBarTextStyle: "#fff",
        navigationBarBackgroundColor: "#0088a4",
        navigationBarTitleText: "button demo",
        backgroundColor: "#eeeeee",
        backgroundTextStyle: "light"
    };
    componentWillMount() {
        // eslint-disable-next-line
        console.log("native componentWillMount");
    }
    componentDidMount() {
        // eslint-disable-next-line
        console.log("native componentDidMount");
    }

    gotoSome(url) {
        if (url) {
            React.api.navigateTo({ url });
        }
    }
    render() {
        return (
            <div class="anu-block">
                <div class="anu-page-header">{this.state.title}</div>
                {this.state.array.map(function(item) {
                    return (
                        <Navigator
                            class="anu-item"
                            onClick={this.gotoSome.bind(this, item.url)}
                            open-type="navigate"
                            hover-class="navigator-hover"
                            url={item.url}
                        >
                            {item.name}
                        </Navigator>
                    );
                })}
            </div>
        );
    }
}

export default P;
