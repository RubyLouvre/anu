class P extends React.Components {
    render() {
      return (
        <div>
          {this.state.multiArr.map(function(item) {
            return (
              <div>
                {item.list.map(function(item2) {
                  return this.state.isOk ? <span>{item2}</span> : <div>noOk</div>;
                })}
              </div>
            );
          })}
        </div>
      );
    }
}

export default P;