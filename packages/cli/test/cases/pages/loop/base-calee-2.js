
class P extends React.Components {
    render() {
      return (
        <div>
          {
            this.state.array&& this.state.array.length && this.state.array.map(function(item) {
              return <div >{item.item}</div>
            })
          }
        </div>
      )
    }
}

export default P;