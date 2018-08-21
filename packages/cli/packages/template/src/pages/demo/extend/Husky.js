import React from '../../../ReactWX';

class P extends React.Component {
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
                <div>该页面待重写</div>
            </div>
        );
    }
}

export default P;
// <Dog />
