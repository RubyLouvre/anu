##路由器

anu可以完美与react-router一起使用。

以下例子是基于这个项目改过来的[https://github.com/reactjs/react-router-redux/]（https://github.com/reactjs/react-router-redux/） 注意react-router的版本号为3.0 所有文件可以从[这里](http://www.bootcdn.cn/)下


```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style>
      .aaa {
            width: 200px;
            height: 200px;
            background: red;
        }
       .bbb {
            width: 200px;
            height: 200px;
            background: lawngreen;
        }
    </style>
  <!--<script type='text/javascript' src="./dist/React.js"></script>-->
    <script src="./lins/react.js"></script>
    <script src="./libs/react-dom.js"></script>
    <script src="./libs/redux.js"></script>
   <!--  <script src="https://cdn.bootcss.com/react-router/3.0.0-beta.1/ReactRouter.js"></script> -->
    <script src="./ReactRouter.js"></script>
    <script src="./libs/react-redux.js"></script>
    <script src="./libs/ReactRouterRedux.js"></script>
    <script src="./libs/babel.js"></script>
    <script type='text/babel'>
var s

window.onload = function(){
        var combineReducers = Redux.combineReducers
       
        var createStore = Redux.createStore
        var Component = React.Component

        var Provider = ReactRedux.Provider
        var connect = ReactRedux.connect

        var Router =  ReactRouter.Router
        var Route = ReactRouter.Route
        var IndexRoute=ReactRouter.IndexRoute

        var browserHistory= ReactRouter.browserHistory
        var Link = ReactRouter.Link
        var syncHistoryWithStore = ReactRouterRedux.syncHistoryWithStore
        var routerReducer= ReactRouterRedux.routerReducer

        const INCREASE = 'INCREASE'
        const DECREASE = 'DECREASE'

        const initialState = {
            number: 1
        }
      // reducers
        function reducers(state = initialState, action) {
            if(action.type === INCREASE) {
                return { number: state.number + action.amount }
            }
            else if(action.type === DECREASE) {
                return { number: state.number - action.amount }
            }
            return state
        }



        function increase(n) {
            return {
                type: INCREASE,
                amount: n
            }
        }

        function decrease(n) {
            return {
                type: DECREASE,
                amount: n
            }
        }
       //========  组件 =========
       function App({ children }) {
        return (
                <div>
                <header>
                    Links:
                    {' '}
                    <Link to="/">Home</Link>
                    {' '}
                    <Link to="/foo">Foo</Link>
                    {' '}
                    <Link to="/bar">Bar</Link>
                </header>
                <div>
                    <button onClick={() => browserHistory.push('/foo')}>Go to /foo</button>
                </div>
                <div style={{ marginTop: '1.5em' }}>{children}</div>
                </div>
            )
        }
        function Bar() {
            return <div>And I am Bar!</div>
        }
        function Foo() {
             return <div>I am Foo!</div>
        }
        function Home({ number, increase, decrease }) {
            return (
                <div>
                <p>Some state changes:</p>
                   <p>  {number}  </p>
                   <p>  
                       <button onClick={() => increase(1)}>Increase</button>
                       <button onClick={() => decrease(1)}>Decrease</button>
                    </p>
                </div>
            )
         }

       var Home = connect(
                state => ({ number: state.number }),
                { increase, decrease }
        )(Home)

        const reducer = combineReducers({
            ...reducers,
            routing: routerReducer
        })

 

        const store = createStore(
            reducer
        )
        const history = syncHistoryWithStore(browserHistory, store)
        ReactDOM.render(
            <Provider store={store}>
                <div>
                <Router history={history}>
                    <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="foo" component={Foo}/>
                    <Route path="bar" component={Bar}/>
                    </Route>
                </Router>
                </div>
            </Provider>,
            document.getElementById('mount')
        )
}
    </script>
</head>

<body>

    <div>这个默认会被清掉</div>
    <div id='mount'></div>


</body>

</html>

```