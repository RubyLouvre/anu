class P extends React.Components {
    render() {
        return (
            <div>
              {this.state.show ? (
                this.state.isOk ? (
                  <div>hello word</div>
                ) : (
                  <div>hello</div>
                )
              ) : (
                <div>nanachi</div>
              )}
            </div>
          );
    }
}

export default P;

