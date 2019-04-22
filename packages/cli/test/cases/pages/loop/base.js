class P extends React.Components {
    render() {
        return (
            <div>
              {
                this.state.array.map(function(item, index) {
                  return <div>{item.item}</div>
                })
              }
            </div>
          )
    }
}

export default P;