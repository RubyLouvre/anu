class P extends React.Components {
    render() {
        if (this.state.tasks !== null) {
            return <view class="page-body">tasks</view>
        }
        return (
            <div class="page-body"><span>Hello world!</span></div>
        );
    }
}

export default P;