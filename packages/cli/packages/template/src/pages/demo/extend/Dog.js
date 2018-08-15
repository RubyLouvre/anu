import React from '../../../ReactWX';
import Animal from '../../../components/Animal/index';

class Dog extends Animal {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            age: props.age
        };
    }

    render() {
        return (
            <div>
                <div>Dog 继承自 Animal</div>
                <Animal name="Dog" age={1} />
            </div>
        );
    }
}

Page(React.createPage(Dog, '/pages/demo/extend/Dog'));
export default Dog;
