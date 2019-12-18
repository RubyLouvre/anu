import React from '@react';
import './index.scss';
import ScrollItemDiv from '@nativeComponents/ScrollItemDiv/index'
class P extends React.Component {
    constructor() {
        super();
        this.order = ['red', 'yellow', 'blue', 'green'];
        this.state = {
            itemId: 'red',
            scrollTop: 0
        };
    }

    upper(e) {
        // eslint-disable-next-line
        console.log(e);
    }

    lower(e) {
        // eslint-disable-next-line
        console.log(e);
    }

    scroll(e) {
        // eslint-disable-next-line
        console.log(e);
    }

    scrollById(itemId) {
        console.log("scrollById", itemId)
      
        if( typeof this.wx.scrollTo === 'function'){
            var itemIndex = this.order.indexOf(itemId)
            this.wx.scrollTo( {
                index: itemIndex,
                smooth: true
            })
        }
        
    
        this.setState({
             itemId: itemId
        });
                 
        
    }

    scrollByPx() {
        console.log("scrollByPx")
        var _self = this;
       
        this.setState({
            scrollTop: _self.state.scrollTop + 10
        });
    }

    render() {
        return (
            <div class="page-body column-layout">
                <div class="page-section column-layout">
                    <div class="page-section-title">vertical scroll</div>
                    <scroll-view
                        scroll-y
                        style="height: 200px"

                     
                        scroll-into-view={this.state.itemIndex}

                        onScrollToUpper={this.upper}
                        onScrollToLower={this.lower}
                        onScroll={this.scroll}
                      
                        scroll-top={this.state.scrollTop}
                    >
                        <list-item type="green" id="green"  class="scroll-view-item bc_green" >
                           <ScrollItemDiv name="green" index={0} />
                        </list-item>
                        <list-item type="red"   id="red"  class="scroll-view-item bc_red" >
                           <ScrollItemDiv name="red" index={1} />
                        </list-item> 
                        <list-item type="yellow"  id="yellow" class="scroll-view-item bc_yellow" >
                           <ScrollItemDiv name="yellow" index={2} />
                        </list-item>
                        <list-item type="blue"  id="blue" class="scroll-view-item bc_blue" >
                           <ScrollItemDiv name="blue" index={3} />
                        </list-item>
                    </scroll-view>

                    <div class="anu-block">
                        <div class="fake-button" size="mini" onTap={this.scrollById.bind(this, 'green')}>
                            scroll into green div
                        </div>
                        <div class="fake-button" size="mini" onTap={this.scrollByPx.bind(this)}>
                            click me to scroll
                        </div>
                    </div>
                </div>
                {/*
                <div class="section section_gap">
                    <div class="section__title">horizontal scroll</div>
                    <scroll-view
                        class="scroll-view_H"
                        scroll-x
                        style="width: 100%"
                    >
                        <list-item type="green" id="green" class="scroll-view-item_H bc_green" />
                        <list-item type="red" id="red" class="scroll-view-item_H bc_red" />
                        <list-item type="yellow" id="yellow" class="scroll-view-item_H bc_yellow" />
                        <list-item type="blue" id="blue" class="scroll-view-item_H bc_blue" />
                    </scroll-view>
                </div>
                */}
            </div>
        );
    }
}

export default P;
