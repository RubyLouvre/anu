class P extends React.Components {
    render() {
        return <div>{(this.state.show && this.state.isOk) &&<div>hello word</div>}</div> ;
    }
}

export default P;

