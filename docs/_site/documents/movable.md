
# 快应用如何模拟movable-area与movalbe-view

下面例子由小米官方(王操大神)提供

```xml
<template>
  <!-- template里只能有一个根节点 -->
  <div class="demo-page">
    <stack >
      <div class="bk">
        <text>movable-area</text>
      </div>
      <div
        class="box"
        ontouchstart="touch"
        ontouchmove="move"
        ontouchend="touchend"
        style="margin-left: {{ initx }}px; margin-top: {{ inity }}px;"
      >
        <text>movable-view</text>
      </div>
    </stack>
  </div>
</template>

<script>
  import router from "@system.router";

  export default {
    // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
    private: {
      title: "示例页面",
      initx: 100,
      inity: 100,
      delayx: 0,
      delayy: 0,
      touchx: 0,
      touchy: 0,
      boxwidth: 200,
      boxheight: 200
    },
    touch (env) {
      this.touchx = env.touches[0].pageX
      this.touchy = env.touches[0].pageY
      this.delayx = this.initx
      this.delayy = this.inity
    },
    touchend (env) {
      this.canmove = false
      this.delayx = this.initx
      this.delayy = this.inity

    },
    move(env) { 
      this.initx = this.delayx + env.touches[0].pageX- this.touchx
      this.inity = this.delayy + env.touches[0].pageY- this.touchy    
    }
  };
</script>

<style>
  .bk {
    width: 100%;
    height: 100%;
    background-color: #aaa;
  }
  .box {
    width: 200px;
    height: 200px;
    background-color: #ffffff;
  }
</style>

```