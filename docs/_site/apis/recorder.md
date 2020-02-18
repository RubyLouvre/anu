# 图片

## getRecorderManager()

获取全局唯一的录音管理器recorderManager。

**参数**

无

**success 返回值**  recorderManager

### recorderManager 对象的方法列表：

| 方法     | 参数         | 说明  | 支持平台 |
| -------- | ------------ | -------- | -------- |
| start | options | 开始录音 | 都支持 |
| tempFiles | Object Array | 图片的本地文件列表，每一项是一个 File 对象。 | 微信小程序>=1.2.0, 百度小程序 |
