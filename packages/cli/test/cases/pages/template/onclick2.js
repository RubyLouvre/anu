class P extends React.Components {
    render() {
        return <div catchTap={this.tap.bind(this)}>hello world</div>;
    }
}

export default P;