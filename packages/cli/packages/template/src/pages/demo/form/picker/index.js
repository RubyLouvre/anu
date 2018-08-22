import React from "../../../../ReactWX";
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            array: ['美国', '中国', '巴西', '日本'],
            objectArray: [
                {
                  id: 0,
                  name: '美国'
                },
                {
                  id: 1,
                  name: '中国'
                },
                {
                  id: 2,
                  name: '巴西'
                },
                {
                  id: 3,
                  name: '日本'
                }
            ],
            index: 0,
            multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
            objectMultiArray: [
                [
                    {
                    id: 0,
                    name: '无脊柱动物'
                    },
                    {
                    id: 1,
                    name: '脊柱动物'
                    }
                ], [
                    {
                    id: 0,
                    name: '扁性动物'
                    },
                    {
                    id: 1,
                    name: '线形动物'
                    },
                    {
                    id: 2,
                    name: '环节动物'
                    },
                    {
                    id: 3,
                    name: '软体动物'
                    },
                    {
                    id: 3,
                    name: '节肢动物'
                    }
                ], [
                    {
                    id: 0,
                    name: '猪肉绦虫'
                    },
                    {
                    id: 1,
                    name: '吸血虫'
                    }
                ]
            ],
            multiIndex: [0, 0, 0],
            date: '2016-09-01',
            time: '12:01',
            region: ['广东省', '广州市', '海珠区'],
            customItem: '全部'

        }

    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "picker demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    bindPickerChange(e){
        console.log('picker发送选择改变，携带值为', e.value)
        this.setState({
          index: e.value
        })
    }
    bindMultiPickerChange (e) {
        console.log('picker发送选择改变，携带值为', e.value)
        this.setState({
          multiIndex: e.value
        })
    }
    bindMultiPickerColumnChange(e){
        console.log('修改的列为', e.column, '，值为', e.value);
        var data = {
            multiArray: this.state.multiArray,
            multiIndex: this.state.multiIndex
        };
        this.state.multiIndex[e.column] = e.value;
        switch (e.column) {
            case 0:
                switch (data.multiIndex[0]) {
                case 0:
                    data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
                    data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                    break;
                case 1:
                    data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
                    data.multiArray[2] = ['鲫鱼', '带鱼'];
                    break;
                }
                data.multiIndex[1] = 0;
                data.multiIndex[2] = 0;
                break;
            case 1:
                switch (data.multiIndex[0]) {
                case 0:
                    switch (data.multiIndex[1]) {
                    case 0:
                        data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                        break;
                    case 1:
                        data.multiArray[2] = ['蛔虫'];
                        break;
                    case 2:
                        data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                        break;
                    case 3:
                        data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                        break;
                    case 4:
                        data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                        break;
                    }
                    break;
                case 1:
                    switch (data.multiIndex[1]) {
                    case 0:
                        data.multiArray[2] = ['鲫鱼', '带鱼'];
                        break;
                    case 1:
                        data.multiArray[2] = ['青蛙', '娃娃鱼'];
                        break;
                    case 2:
                        data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                        break;
                    }
                    break;
                }
                data.multiIndex[2] = 0;
                console.log(data.multiIndex);
                break;
        }
        this.setState(data);
    }
    bindTimeChange(e) {
        console.log('picker发送选择改变，携带值为', e.value)
        this.setState({
          time: e.value
        })
    }
    bindDateChange(e){
        console.log('picker发送选择改变，携带值为', e.value)
        this.setState({
            date: e.value
        })
    }
    bindRegionChange(e){
        console.log('picker发送选择改变，携带值为', e.value)
        this.setState({
          region: e.value
        })
    }
    render() {
        return (
            <div class='container'>
              <div class="section">
                <div class="section__title">普通选择器</div>
                <picker onChange={this.bindPickerChange} value={this.state.index} range={this.state.array}>
                    <div class="picker">
                    当前选择：{this.state.array[this.state.index]}
                    </div>
                </picker>
                </div>
                <div class="section">
                <div class="section__title">多列选择器</div>
                <picker mode="multiSelector" onChange={this.bindMultiPickerChange} onColumnChange={this.bindMultiPickerColumnChange} value={this.state.multiIndex} range={this.state.multiArray}>
                    <div class="picker">
                    当前选择：{this.state.multiArray[0][this.state.multiIndex[0]]}，{this.state.multiArray[1][this.state.multiIndex[1]]}，{this.state.multiArray[2][this.state.multiIndex[2]]}
                    </div>
                </picker>
                </div>
                <div class="section">
                <div class="section__title">时间选择器</div>
                <picker mode="time" value={this.state.time} start="09:01" end="21:01" onChange={this.bindTimeChange}>
                    <div class="picker">
                    当前选择: {this.state.time}
                    </div>
                </picker>
                </div>

                <div class="section">
                <div class="section__title">日期选择器</div>
                <picker mode="date" value={this.state.date} start="2015-09-01" end="2017-09-01" onChange={this.bindDateChange}>
                    <div class="picker">
                    当前选择: {this.state.date}
                    </div>
                </picker>
                </div>
                <div class="section">
                <div class="section__title">省市区选择器</div>
                <picker mode="region" onChange={this.bindRegionChange} value={this.state.region} custom-item={this.state.customItem}>
                    <div class="picker">
                    当前选择：{this.state.region[0]}，{this.state.region[1]}，{this.state.region[2]}
                    </div>
                </picker>
                </div>
            </div>
        );
    }
}

export default P;
