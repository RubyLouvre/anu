class P extends React.Components {
    render() {
        if (this.state.tasks !== null) {
            return <view class="page-body">tasks</view>;
        } else if (this.state.task.length === 0) {
            return (
                <view class="page-body">
                <text>{tasks.length}</text>
                </view>
            );
        } else {
            return (
                <div class="page-body">
                <span>Hello world!</span>
                </div>
            );
        }
    }
}

export default P;

