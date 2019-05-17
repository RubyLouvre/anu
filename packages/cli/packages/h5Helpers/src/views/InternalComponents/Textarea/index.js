import React from 'react';

export default class Textarea extends React.Component {
  constructor(props) {
    super(props);

    this.bindRef = this.bindRef.bind(this);
    this.resize = this.resize.bind(this);
    this.bindTextAreaBlur = this.bindTextAreaBlur.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  bindRef(ref) {
    if (ref) {
      this.inputRef = ref;
      if (this.props.inputRef) {
        this.props.inputRef(ref);
      }
    }
  }

  bindTextAreaBlur(e) {
    this.props.onBlur && this.props.onBlur(e.target);
  }

  componentDidMount() {
    this.resize();
  }

  resize() {
    if (this.inputRef) {
      this.inputRef.style.height = 'auto';
      this.inputRef.style.height = this.inputRef.scrollHeight + 'px';
    }
  }

  onChange(e) {
    this.resize();
    this.props.onChange && this.props.onChange(e);
  }

  onInput(e) {
    this.resize();
    this.props.onInput && this.props.onInput(e);
  }

  render() {
    const { autoHeight } = this.props;

    return (
      <div>
        <textarea
          ref={autoHeight && this.bindRef}
          {...this.props}
          onBlur={this.bindTextAreaBlur}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
