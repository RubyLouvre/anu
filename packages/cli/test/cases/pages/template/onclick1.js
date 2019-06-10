class P extends React.Components {
    render() {
        return <div onTap={this.tap.bind(this)}>hello world</div>;
    }
}

export default P;