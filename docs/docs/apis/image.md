# 图片

## chooseImage(Object object)

从本地相册选择图片或使用相机拍照。

**参数**

Object object

| 属性       | 类型         | 默认值                     | 是否必须 | 说明                                             | 支持平台 |
| ---------- | ------------ | -------------------------- | -------- | ------------------------------------------------ | -------- |
| count      | number       | 微信、百度：9， 支付宝： 1       | 否       | 最多可以选择的图片张数                           | 都支持   |
| sourceType | String Array | ['album', 'camera']        | 否       | 选择图片的来源                                   | 都支持   |
| sizeType   | String Array | ['original', 'compressed'] | 否       | original 原图，compressed 压缩图，默认二者都有                                 | 微信     |
| success    | function     |                            | 否       | 接口调用成功的回调函数                           | 都支持   |
| fail       | function     |                            | 否       | 接口调用失败的回调函数                           | 都支持   |
| complete   | function     |                            | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） | 都支持   |


**success 返回值**
| 字段     | 类型         | 说明  | 支持平台 |
| -------- | ------------ | -------- | -------- |
| tempFilePaths | String Array | 图片的本地文件路径列表 | 都支持 |
| tempFiles | Object Array | 图片的本地文件列表，每一项是一个 File 对象。 | 微信小程序>=1.2.0, 百度小程序 |


Object res

| 属性          | 类型        | 描述                                       | 支持平台 |
| ------------- | ----------- | ------------------------------------------ | -------- |
| tempFilePaths | StringArray | 图片的本地文件路径列表                     | 都支持   |
| tempFiles     | ObjectArray | 图片的本地文件列表，每一项是一个 File 对象 | 微信、百度     |

```javascript
  choose() {
    React.api.chooseImage({
      count: 2,
      success: res => {
        this.setState({
          img: res.tempFilePaths
        })
      }
    });
  }

  render() {
    return (
      <div>
        <button onTap={this.choose}>选择图片</button>
        {
          this.state.img.map(function(item) {
            return  <image src={item}/>
          })
        }

      </div>
    );
  }
```

## previewImage(Object object)

预览图片

**参数**

Object object

| 属性     | 类型     | 是否必须 | 说明                                             | 支持平台 |
| -------- | -------- | -------- | ------------------------------------------------ | -------- |
| urls     | Array    | 是       | 要预览的图片链接列表                             | 都支持   |
| current  | String   | 否       | 当前显示图片的链接	，urls 的第一张                        | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                           | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                           | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） | 都支持   |


```javascript
 React.api.previewImage({
   current: 'http://xxxxxxx', // 当前显示图片链接
   urls: [''], // 需要预览的图片http链接列表,
   success: function(res) {
      console.log('success', res);
   },
   fail: function (err) {
      console.log('错误码：' + err.errCode);
      console.log('错误信息：' + err.errMsg);
   }
});
```
## saveImageToPhotosAlbum(Object object)

保存图片到系统相册

**参数**

Object object

| 属性     | 类型     | 是否必须 | 说明                                                               | 支持平台 |
| -------- | -------- | -------- | ------------------------------------------------------------------ | -------- |
| filePath | string   | 是       | 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径 | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                             | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                             | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                   | 都支持   |

## getImageInfo(Object object)

获取图片信息

**参数**

Object object

| 属性     | 类型     | 是否必须 | 说明                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------- | -------- |
| src      | string   | 是       | 图片路径，目前支持：网络图片路径、apFilePath 路径、相对路径 | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）            | 都支持   |

**success 返回值**

| 名称        | 类型   | 描述                | 支持平台 |
| ----------- | ------ | ------------------- | -------- |
| width       | Number | 图片宽度（单位 px） | 都支持   |
| height      | Number | 图片高度（单位 px） | 都支持   |
| path        | string | 图片的本地路径      | 都支持   |
| orientation | string | 拍照时设备方向      | 微信     |
| type        | string | 图片格式            | 微信     |
