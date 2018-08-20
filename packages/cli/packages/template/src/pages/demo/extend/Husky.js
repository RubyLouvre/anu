import React from '../../../ReactWX';
import Dog from '../../../components/Dog/index';

class Husky extends React.Component {
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
                <div>Husky 继承自 Dog，Dog 继承自 Animal</div>
            </div>
        );
    }
}

Page(React.createPage(Husky, '/pages/demo/extend/Husky'));
export default Husky;