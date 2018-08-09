import React from "../../../../ReactWX";
class P extends React.Component {
    constructor(props) {
       this.state = {
          items: [
            {name: 'USA', value: '美国'},
            {name: 'CHN', value: '中国', checked: 'true'},
            {name: 'BRA', value: '巴西'},
            {name: 'JPN', value: '日本'},
            {name: 'ENG', value: '英国'},
            {name: 'TUR', value: '法国'},
          ]
       }
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "checkbox demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    checkboxChange(e){
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    }
    render() {
        return (
            <div class='container'>
                {/* //issues, onchange? */}
                <checkbox-group onChange={this.checkboxChange}>
                   {
                       this.state.items.map(function(item){
                           return (
                                <label>
                                    <checkbox value={item.name} checked={item.checked} />{item.value}
                                </label>
                           )
                       })
                   }
                </checkbox-group>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/demo/form/checkbox/index"));
export default P;
