import React from '@react';
import './index.scss';

class CateModal extends React.Component {
    constructor() {
        super();
        this.state = {
            categories: []
        };
    }

    togglePtype() {
        this.props.togglePtype();
    }

    cateselect() {}

    componentWillMount() {
    // console.log('did',this.props)
        let arr = Object.values(this.props.catelist.res.categories);
        this.setState({
            categories: arr
        });
    }

    render() {
        return (
            <list>
                <list-item>
                    <div class="anu-col">
                        <div class="close" onTap={this.togglePtype} id="closecatelist">关闭</div>
                        <div class="anu-col">
                            <div
                                id="cateall"
                                onTap={this.cateselect}
                                class={
                                    'cl_list ' +
                                (this.props.catelist && this.props.catelist.checked.name == this.props.catelist.res.all.name ?
                                    'checked' : '')
                                }
                            >
                                {this.props.catelist && this.props.catelist.checked.name == this.props.catelist.res.all.name && (
                                    <span>{this.props.catelist.res.all.name}</span>
                                )}
                            </div>
                            {this.state.categories.map(function(item, index) {
                                return (
                                    <div class="catelist" id={'c' + index} key={item}>
                                        <div class="cl_list cl_ico">
                                            <image src={'../../assets/image/cm2_discover_icn_' + index + '@2x.png'} />
                                            <text>{item}</text>
                                        </div>
                                        {this.props.catelist.res.sub.map(function(re) {
                                            return (
                                                <div
                                                    class={
                                                        'cl_list ' + (this.props.catelist && this.props.catelist.checked.name === re.name ? 'checked' : '')
                                                    }
                                                >
                                                    {re.hot && <text class="cl_ico_hot cl_ico" />}
                                                    {this.props.catelist && this.props.catelist.checked.name === re.name && (
                                                        <text class="cl_ico_checked cl_ico" />
                                                    )}
                                                    {re.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </list-item>
            </list>
        );
    }
}
export default CateModal;
