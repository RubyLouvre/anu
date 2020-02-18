# React Hooks的支持

从nanachi 1.2.3开始，我们引入对React Hooks的支持。所谓React Hooks，就是在无状态组件的方法体里面添加几个
内置方法，实现只有原有状态组件才能实现的功能。

- 自更新能力（setState，使用useState，它会返回一个数组，一个是新数据，一个是更新数据的方法），
- 访问context(使用useContext)，
- 使用更高级的setState设置（useReducer）
- 更新完的回调（useEffect）
- setState的升级版， useCallback
- useMemo，取得上次缓存的数据，它可以说是useCallback的另一种形式。

目前就支持这6种，其他三种或与ref有关，或与渲染时期有关，对小程序没有什么意思就不支持了。

在开始之前，我们还需要深入理解一下的无状态组件。 有的无状态组件是会返回text, div这些构建界面的标签，它们应该放到
components目录下，有的无状态组件则直接返回另一个组件或props.children，那么应该放到common目录下，比如`<React.Fragment />`或var ThemeContext = React.createContext(); `<ThemeContext.Provider />`

注意：由于小程序的语法限制，无法实现props render, 因此也无法使用Context.Consumer，你只能用useContext或static contextType

下面是一个简单的例子：

我们用nanachi建立一个hello world模块（最后那个），改写pages/index/index.js

```javascript
import React from '@react';
import {GlobalTheme} from '@common/GlobalTheme/index';
import Layout from '@components/Layout/index';
import AnotherComponent from '@components/AnotherComponent/index';
import './index.scss';
class P extends React.Component {
    props = {
        anyVar: {color:'red'}
    }
    componentDidMount() {
        // eslint-disable-next-line
        console.log('page did mount!');
    }
    render() {
        return  <div class = 'page' >
                 <GlobalTheme.Provider value={this.props.anyVar}>
                   <Layout>
                       <AnotherComponent />
                   </Layout>
                </GlobalTheme.Provider>
                </div>
    }
}

export default P;

```

common/GlobalTheme/index.js

```javascript
// eslint-disable-next-line
import React from '@react';

export const GlobalTheme = React.createContext();//它要表示为一个组件，因此必须 大写开头
```

components/AnotherComponent/index

```javascript
// eslint-disable-next-line
import React from '@react';

export default function AnotherComponent(){//它要表示为一个组件，因此必须 大写开头
   console.log("AnotherComponent init" )  //debug
    return <div> Foo </div>;
  };
```

components/Layout/index

```javascript
import React from '@react';
import {GlobalTheme} from '@common/GlobalTheme/index';
export default function Layout (props) {
    const globalStyle = React.useContext(GlobalTheme);
    console.log("Layout init",globalStyle ) //debug
    return <div style={globalStyle}>{props.children}</div>;
};

```

