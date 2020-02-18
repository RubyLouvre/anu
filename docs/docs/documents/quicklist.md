# 快应用的scroll-view兼容

快应用没有**scroll-view**，它是通过refresh, list, list-item这三种标签实现的

比如像下面复杂的代码，list里面有复杂的分支，而当前list-item是不请允许存在if, for语句。
唯一能绕开的方法是能list-item添加上type属性，并且type的值都不一样。

```jsx
<scroll-view style={{height: '2000px'}} className="scroll-container" 
     onScrollBottom={this.loadMore.bind(this)}
     onScrollToLower={this.loadEnd.bind(this)}
     > {
        this.state.orders.map(function (item, index) {
            return (
          <div>
            {item.businessType == 'hotel_hour' || item.businessType == 'hotel' || item.businessType == 'hotel_group_w' || item.businessType == 'new_apartment' ?
                <OrderHotel data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderHotel> : item.businessType == 'flight' ?
                    <OrderFlight data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderFlight> : item.businessType == 'train' ?
                            <OrderTrain data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderTrain> : item.businessType == 'bus' && item.orderType !== 5002002 ?
                                <OrderBus data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderBus> : item.businessType == 'carcar' ?
                                        <OrderCar data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderCar> : item.businessType == 'bus' && item.orderType == 5002002 ?
                                            <OrderShip data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderShip> : item.businessType == 'sight' || item.businessType == 'hotel_sight' ?
                                                <OrderTicket data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderTicket> : item.businessType == 'vacation' ?
                                                    <OrderVacation data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderVacation> : ''
                                }
                            </div>
                        );
                    })
    }
    <div>底部</div>
</list>
```

改造如下：
```jsx
<scroll-view style={{height: '2000px'}} className="scroll-container" 
     onScrollToUpper={this.loadMore.bind(this)}
     onScrollToLower={this.loadEnd.bind(this)}
     > {
        this.state.orders.map(function (item, index) {
            return (
          <list-item type={item.businessType+index}>
            {item.businessType == 'hotel_hour' || item.businessType == 'hotel' || item.businessType == 'hotel_group_w' || item.businessType == 'new_apartment' ?
                <OrderHotel data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderHotel> : item.businessType == 'flight' ?
                    <OrderFlight data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderFlight> : item.businessType == 'train' ?
                        <OrderTrain data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderTrain> : item.businessType == 'bus' && item.orderType !== 5002002 ?
                            <OrderBus data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderBus> : item.businessType == 'carcar' ?
                                    <OrderCar data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderCar> : item.businessType == 'bus' && item.orderType == 5002002 ?
                                        <OrderShip data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderShip> : item.businessType == 'sight' || item.businessType == 'hotel_sight' ?
                                            <OrderTicket data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderTicket> : item.businessType == 'vacation' ?
                                                <OrderVacation data={{ item }} index={{ index }} todetail={this.toDetail} topay={this.toPay}></OrderVacation> : ''
                            }
                        </list-item>
                    );
                })
        
    }
      <list-item type="bottom1134324">底部</list-item>
</list>
```

然后我们在转换阶段，在快应用下，list-item标签不变，scroll-view标签转译成list标签，
onScrollToUpper转译成onScrollTop, 
onScrollToLower转译成onScrollBottom。


在其他小程序下， list-item标签变div，scroll-view标签不变， 事件名不变

如果想要refresh的功能， 即页面onPullDownRefresh功能，
那你在scroll-view包一个refresh标签，这个在其他小程序会变成div。