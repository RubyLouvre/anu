// eslint-disable-next-line
import React from '@react';

import { observer } from "mobx-react"
import { observable } from "mobx"

@observer
class Timer extends React.Component {
  state = {}
  @observable secondsPassed = 0

  componentWillMount() {
    setInterval(() => {
     
      this.secondsPassed++
      console.log('this.secondsPassed ',this.secondsPassed)
      this.state.secondsPassed = this.secondsPassed
    }, 1000)
  }

  render() {
    console.log("更新!!!!")
    return <span>Seconds passed: {this.state.secondsPassed} </span>
  }
}

export default Timer;
