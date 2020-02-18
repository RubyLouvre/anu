class P extends React.Components {
    render() {
      return (
        <div>
          {this.state.multiArr.map(function(item) {
            return (
              <div>
                {item.list.map(function(item2) {
                  return <span>{item2}</span>;
                })}
              </div>
            );
          })}
        </div>
      );
    }
}

export default P;