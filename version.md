##1.0.0
1. 发布anu

##1.0.1
1. 支持cloneElement

##1.0.2
1. 兼容IE，实现对应的polyfill文件
2. 实现对IE6－8的change, input, submit事件
3. 添加对select.value的处理


##1.0.3
1. 实现focus, blur, wheel的兼容处理，
2. 实现unstable_renderSubtreeIntoContainer方法
3. 实现isValidElement方法
4. 修正更新组件时，没有添加defaultProps的BUG
5. 修正diffProps一些错别字
6. 实现事件对象pagex,pageY,which,currentTarget的兼容
7. 修正用户在componentWillMount时调用 setState引发的BUG
8. cloneElement应该能处理数组并取出其第一个元素进制复制 
9. 添加Children.forEach, Children.map的支持




