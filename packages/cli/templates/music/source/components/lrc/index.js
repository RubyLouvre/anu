import React from '@react';

class Lrc extends React.Component {
    constructor() {
        super();
    }

    loadlrc() {}

    render() {
        return (
            <div id="lrclist" class={this.props.showlrc ? '' : 'playinghidden'} onTap={this.loadlrc}>
                <div
                    id="lrcwrap"
                    style={{ transform: `translateY(-${(this.props.lrcindex * 100) / (6)}%)` }}
                >
                    {this.props && this.props.lrc && this.props.lrc.nolyric && <div class="notext">纯音乐，无歌词</div>}
                    <div>
                        <text> </text>
                    </div>
                    <div>
                        <text> </text>
                    </div>
                    <div>
                        <text> </text>
                    </div>
                    <div>
                        <text> </text>
                    </div>
                    <div>
                        <text> </text>
                    </div>
                    <div>
                        <text> </text>
                    </div>
                </div>
            </div>
        );
    }
}
export default Lrc;
