##context

在React中，数据总是自上而下的传递，每当你使用一个组件的时候，你可以看到组件的props属性会自上而下的传递。
但是如果一个页面结构非常复杂，你在在某一种子组件获得其祖先组件的某个属性来干某事时，就非常麻烦了。虽然在React内部存在一个叫
_hostParent的属性，类似于DOM的parentNode来让你回溯其祖先，但毕竟是没有记录在文档上的内部属性，不适宜使用它。
于是到context出场了。

在官方React中，context一般与getChildContext,childContextTypes一起使用。在anu中，所有数据验证的东西已经干掉，
因此只要用context、getChildContext就行了。

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
   
    <script src='./dist/React.js'></script>
    <script src="./test/babel.js"></script>
    <script type='text/babel'>
  
        class Parent extends React.Component{
        
            render() {
    	       return (<div className="parent"><Son /></div>)
            }
        }
       class Son extends React.Component{
        
            render() {
    	       return (<div className="son"> {this.context.value} </div>)
            }
        }

       class App extends React.Component{
            getChildContext() {
                return {
                    value: 666
                };
            }
            render() {
    	       return (<div className='app'><Parent /></div>)
            }
        };


        window.onload = function() {
            ReactDOM.render(<App />, document.getElementById('example'));
        }
    </script>
</head>

<body>
    <div id='example'>这个默认会被清掉</div>
</body>

</html>


```


React的context和全局变量相似，应避免使用，场景包括：传递登录信息、当前语音以及主题信息；

如果只传递一些功能模块数据，则尽量不要使用context，使用props传递数据会更加清晰；

使用context会使组件的复用性降低，因为这些组件依赖'上下文'，当你在别的地方渲染的时候，可能会出现差异；