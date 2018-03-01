import React from "dist/React";

describe("cloneElement", function () {
    it("test", () => {
        var a = {
            type: "div",
            props: {
                v: 1,
                children: []
            }
        };
        expect(React.cloneElement(a).props.v).toBe(1);
    });

    it("array", () => {
        var a =  {
            type: "div",
            props: {
                v: 2,
                children: []
            }
        };
 
        expect(React.cloneElement(a).props.v).toBe(2);
    });
    it("should transfer the key property", ()=> {
        var Component = React.createClass({
            render: function() {
                return null;
            },
        });
        var clone = React.cloneElement(<Component />, {key: "xyz"});
        expect(clone.key).toBe("xyz");
    });
    it("children", () => {
        function A() { }
        var b = React.cloneElement({
            type: A,
            tag: 2,
            props: {}
        }, {
            children: [111, 222],
            onChange: function () { },
            key: "tabContent"
        });
        expect(b.props.children.length).toBe(2);
    });

    it("属性是一个虚拟DOM，被重复clone", ()=>{
        class Tree extends React.Component{
            constructor(props){
                super(props);
                this.state = {};
            }
            renderTreeNode(child){
                var childProps = {};
                childProps.checkable = this.props.checkable;
               
                return React.cloneElement(child, childProps);
            }
            render() {
                var props = this.props;
                return React.createElement(
                    "ul",
                    {
                        className: "root",
                        role: "tree-node",
                        unselectable: "on"
                    },
                    React.Children.map(props.children, this.renderTreeNode, this)
                );
            }
        }
        class TreeNode extends React.Component{
            render(){
                return <li>{this.props.checkable}{this.props.children}</li>;
            }
        }
        var container = document.createElement("div");
        ReactDOM.render(<Tree checkable={ <input className="checked" type="radio" defaultChecked="true"/>}>
            <TreeNode>1111</TreeNode>
            <TreeNode>2222</TreeNode>
            <TreeNode>3333</TreeNode>
        </Tree>
            , container);
        var inputs =  container.getElementsByTagName("input");
        expect(inputs.length).toBe(3);
    });
});
