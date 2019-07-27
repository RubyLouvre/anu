class P extends React.Components {
    render() {
        return <div class={'aaa '+ (this.state.isOk && this.state.flag === 'checked' ? 'checked' : '') }></div>;
    }
}

export default P;