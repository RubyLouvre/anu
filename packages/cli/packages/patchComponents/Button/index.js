// eslint-disable-next-line
import React from '@react';
import './index.scss';

function handleStyle(props, active) {
  let activeStyle = active ?  'active ' : ''
  let buttonStyle = props.size + ' ' + activeStyle;
  let textStyle = '';
  let value;
  if (props.disabled) {
    if (props.plain) {
      value = props.type + '-disabled-plain';
    } else {
      value = props.type + '-disabled';
    }
  } else {
    if (props.plain) {
      value = props.type + '-plain';
    } else {
      value = props.type;
    }
  } 

  textStyle = colorStyleMap[value];
  buttonStyle += value;
  let fontStyle = fontStyleMap[props.size]

  return {
    textStyle,
    buttonStyle,
    fontStyle
  };
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    let { buttonStyle, textStyle, fontStyle } = handleStyle(props);
    if (typeof props.children === 'object') {
      console.wan('button内部只能传字符串与数字'); //eslint-disable-line
    }
    props.value = props.children;
    this.state = {
      buttonStyle,
      textStyle,
      fontStyle
    }; 
  }

   

  componentWillReceiveProps(nextProps) {
    let { buttonStyle, textStyle, fontStyle } = handleStyle(nextProps);
    nextProps.value = nextProps.children;
    this.setState({
      buttonStyle,
      textStyle,
      fontStyle
    });
  }
  click(e) {
    console.log(222);
  
    var fn = this.props.click;
    fn && fn.call(this, e);

    this.setState({
      buttonStyle: handleStyle(this.props, true).buttonStyle
    });
    setTimeout(() => {
      this.setState({
        buttonStyle: handleStyle(this.props).buttonStyle
      });
    }, 150);
  }
  render() {
    return (
      <div
        class={'center button ' + this.state.buttonStyle}
        disabled={this.props.disabled}
        onClick={this.click.bind(this)}
      >
        <image  show={this.props.loading} class='loading-style' src="https://s.qunarzz.com/flight_qzz/loading.gif" />

        <text style={{ color: this.state.textStyle, fontSize: this.state.fontStyle }}>{this.props.value}</text>
      </div>
    );
  }
}

Button.defaultProps = {
  type: 'default',
  disabled: false,
  plain: false,
  size: 'default',
  loading: false
};

const colorStyleMap = {
  default: '#000000',
  primary: '#ffffff',
  warn: '#ffffff',
  'default-disabled': 'rgba(0, 0, 0, 0.3)',
  'primary-disabled': 'rgba(255, 255, 255, 0.6)',
  'warn-disabled': 'rgba(255, 255, 255, 0.6)',
  'default-disabled-plain': 'rgba(0, 0, 0, 0.2)',
  'primary-disabled-plain': 'rgba(0, 0, 0, 0.2)',
  'warn-disabled-plain': 'rgba(0, 0, 0, 0.2)',
  'default-plain': '#353535',
  'primary-plain': '#1aad19',
  'warn-plain': '#e64340'
};

const fontStyleMap = {
  'default': '18px',
  'mini': '13px'
}

export default Button;
