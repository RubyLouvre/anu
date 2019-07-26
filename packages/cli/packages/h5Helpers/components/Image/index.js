import React from 'react';

export default class InternalImage extends React.Component {
  constructor(props) {
    super();
    const {
      width = 300,
      height = 225,
      className,
      class: internalClass
    } = props;

    this.state = {
      modeClassName: '',
      containerWidth: width,
      containerHeight: height,
      imageWidth: width,
      imageHeight: height
    };
    this.originalContainerWidth = width;
    this.originalContainerHeight = height;
    this.naturalWidth = width;
    this.naturalHeight = height;
    this.className = className || internalClass;
    this.image = React.createRef();
    this.onLoad = this.onLoad.bind(this);
    this.randomClassName = 'r' + Math.floor(Math.random()*100000);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateSize(nextProps);
  }

  calculateSize({ mode }) {
    const state = {
      modeClassName: this.state.modeClassName,
      containerWidth: this.originalContainerWidth,
      containerHeight: this.originalContainerHeight
    };
    const { naturalWidth, naturalHeight } = this;
    const { containerWidth, containerHeight } = this.state;
    const isWidthLonger = naturalWidth > naturalHeight;
    const ratio = naturalWidth / naturalHeight;

    switch (mode) {
      case 'scaleToFill':
        state.modeClassName = 'scale-to-fill';
        break;

      case 'aspectFit':
        state.modeClassName = 'aspect-fit';
        state.imageWidth = isWidthLonger ? '100%' : 'auto';
        state.imageHeight = isWidthLonger ? 'auto' : '100%';

        break;

      case 'aspectFill':
        state.modeClassName = 'aspect-fill';
        state.imageWidth = isWidthLonger
          ? containerHeight * ratio
          : containerWidth;
        state.imageHeight = isWidthLonger
          ? containerHeight
          : containerWidth / ratio;

        break;

      case 'widthFix':
        state.modeClassName = 'width-fix';
        state.imageWidth = isWidthLonger ? '100%' : 'auto';
        state.containerHeight = containerWidth / ratio;

        break;

      case 'top left':
      case 'top right':
      case 'bottom left':
      case 'bottom right':
        state.modeClassName = mode.replace(/\s/, '-');

        break;

      case 'top':
      case 'left':
      case 'bottom':
      case 'right':
      case 'center':
        state.modeClassName = mode;

        break;

      default:
        break;
    }

    this.setState(state);
  }

  onLoad(event) {
    const { onLoad } = this.props;
    const { naturalHeight, naturalWidth } = this.image.current;
    this.naturalHeight = naturalHeight;
    this.naturalWidth = naturalWidth;

    this.calculateSize(this.props);

    if (onLoad) onLoad.call(event);
  }

  render() {
    const { width, height, className } = this;
    const { modeClassName } = this.state;
    const { mode } = this.props;

    if (mode) {
      return (
        <div
          className={['__internal__image__', modeClassName, className, this.randomClassName].join(
            ' '
          )}
        >
          <img ref={this.image} {...this.props} onLoad={this.onLoad} />
          <style ref={(node) => {
              Object(node).textContent = `
              ${this.randomClassName}.__internal__image__ {
                display: inline-block;
                vertical-align: top;
                overflow: hidden;
                position: relative;
                width: ${this.state.containerWidth}px;
                height: ${this.state.containerHeight}px;
              }
              ${this.randomClassName}.__internal__image__ img {
                position: relative;
                margin: 0;
              }
              ${this.randomClassName}.scale-to-fill {
                width: 100%;
              }
              ${this.randomClassName}.scale-to-fill img {
                width: 100%;
                height: 100%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
              ${this.randomClassName}.aspect-fit img {
                width: ${this.state.imageWidth};
                height: ${this.state.imageHeight};
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
              ${this.randomClassName}.aspect-fill img {
                width: ${this.state.imageWidth}px;
                height: ${this.state.imageHeight}px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
              ${this.randomClassName}.width-fix img {
                width: 100%;
                height: auto;
              }
              ${this.randomClassName}.top img {
                left: 50%;
                transform: translate(-50%, 0);
              }
              ${this.randomClassName}.bottom img {
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translate(-50%, 0);
              }
              ${this.randomClassName}.center img {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
              ${this.randomClassName}.left img {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translate(0, -50%);
              }
              ${this.randomClassName}.right img {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(0, -50%);
              }
              ${this.randomClassName}.top-right img {
                position: absolute;
                right: 0;
              }
              ${this.randomClassName}.bottom-left img {
                position: absolute;
                bottom: 0;
                left: 0;
              }
              ${this.randomClassName}.bottom-right img {
                position: absolute;
                bottom: 0;
                right: 0;
              }
            `;
          }}/>
        </div>
      );
    } else {
      return <img {...this.props} width={width} height={height} />;
    }
  }
}
