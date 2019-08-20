import React from 'react';

export default class Audio extends React.Component {
  constructor(props) {
    super(props);
    // if(React.appType === 'h5' ){
    // } else if(React.appType === 'quick') {
    // }
    
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onError = this.onError.bind(this);
    this.onEnded = this.onEnded.bind(this);
  }

  onPlay() {
    this.props.onPlay && this.props.onPlay();
  }

  onPause() {
    this.props.onPause && this.props.onPause();
  }

  onError() {
    this.props.onError && this.props.onError();
  }

  onEnded() {
    this.props.onEnded && this.props.onEnded();
  }

  render() {
    return (
      <audio
          {...this.props}
          onplay={this.onPlay}
          onended={this.onEnded}
          onpause={this.onPause}
          onerror={this.onError}
        />
    );
  }
}
