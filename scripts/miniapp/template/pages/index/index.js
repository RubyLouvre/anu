import React  from "../../../../dist/ReactWX";


class P extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "hehe",
      array: [
        { name: "dog1", text: "text1" },
        { name: "dog2", text: "text2" },
        { name: "dog3", text: "text3" }
      ]
    };
  }
  onClick() {
    console.log("test click1" + e);
  }
  onKeyDown() {
    console.log("test keydown");
  }
  render() {
    return (
      <div onClick={this.onClick} onKeyDown={this.onKeyDown}>
        <div>
          {this.state.array.map(function(el) {
            return (
              <Dog key={el.name} name={el.name}>
                {el.text}
              </Dog>
            );
          })}
        </div>
        <Dog name={this.state.name} />
      </div>
    );
  }
}
Page(React.createPage(P, "pages/index/index"))
export default P;
