class P extends React.Components {
    render() {
      return (
        <div>
          {
            this.state.array.length ? this.state.array.map(function(item, index) {
              return <div key={index}>{item.item}</div>
            }) : null
          }
        </div>
      )
    }
}

export default P;