import React from '../../../ReactWX';
import Dog from '../../../components/Dog/index';

class DogPage extends React.Component{
   
    render() {
        return (
            <div>
                <div>Dog测试</div>
                <Dog age={12} />
            </div>
        );
    }
}

Page(React.createPage(DogPage, '/pages/demo/extend/Dog'));
export default Dog;
