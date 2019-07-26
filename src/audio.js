var fakeAudio = {
    next:noop,
    previous: noop,
    play: noop,
    pause: noop,
    stop: noop,
}
class XAudio extends React.Component {
   constructor(props){
       //https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.html
       var innerAudioContext = fakeAudio
       if(React.bindType == 'quick'){
         innerAudioContext = require('@system.audio')
       }else if( React.bindType == 'h5'){

       }else {
         innerAudioContext = React.api.createInnerAudioContext()
         if(!innerAudioContext){
            innerAudioContext = fakeAudio
         }
       }
        innerAudioContext.autoplay = !!props.autoplay
        innerAudioContext.src = props.src
        innerAudioContext.startTime = Number(props.startTime) || 0
        innerAudioContext.loop = props.loop
        innerAudioContext.onPlay(props.onPlay)
        innerAudioContext.onError(props.onError);
        innerAudioContext.onplay(props.onPlay)
        innerAudioContext.onerror(props.onError);
        this.audioContext = innerAudioContext;
        if(props.autoplay){
            innerAudioContext.play()
        }
   }
   /*
   play(){
    this.innerAudioContext.play()
   }
   pause(){
    this.innerAudioContext.pause()
   }
   stop(){
    this.innerAudioContext.stop()
   }
   next(){
    this.innerAudioContext.next()
   }
   previous(){
    this.innerAudioContext.previous()
   }
   */
   componentWillUnmount(){
    this.innerAudioContext.stop()
   }
   render(){
       return React.bindType == 'h5' ? <audio></audio> : null
   }
}


//<audio src loop controls poster name author>