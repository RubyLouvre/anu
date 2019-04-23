class P extends React.Components {
    render() {
        return <div class={this.state.flag === 'checked' ? 'checked' : ''}></div>;
    }
}

export default P;