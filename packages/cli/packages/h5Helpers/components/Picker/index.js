import React from '@react';
import ReactDOM from 'react-dom';
import './index.scss';
import Overlay from '../Overlay/index';
import PickerItem from './PickerItem/index';
import DatePickerItem from './DatePickerItem/index';
import { nextDate, timeStrToDate, getDate, nextMinute, getTime } from './time';
import cnCity from './cnCity';
/* eslint-disable */
function handleSelect(selected) {
  if (selected) {
    return Array.isArray(selected) ? selected : [selected];
  } else {
    return [];
  }
}

// 由于 nanachi 语法的限制，无法在 schnee-ui 中按平台使用 ReactDOM.createPortal
// 所以将 schnee-ui 的代码拷贝到 mini-html5 中
class Picker extends React.Component {
  constructor(props) {
    super(props);
    this.selectedValue = props.value;
    this.prevSelectedValue = this.selectedValue;
    const { range, dataMap, value, mode, start, end } = props;
    let rangeValue = mode === 'region' ? cnCity : range;
    const { groups, newselected } = this.parseData(rangeValue, dataMap.items, value);
    this.state = {
      animationClass: '',
      groups,
      selected: newselected,
      start: timeStrToDate(start, mode),
      end: timeStrToDate(end, mode)
    };
    this.prevSelected = newselected;
    this.prevGroups = groups;
    this.picker = React.createRef();

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  parseData(data, subKey, selected, group = [], newselected = []) {
    if (this.props.mode === 'date') {
      selected = selected ? new Date(selected) : new Date();
      let groups = [
        { format: 'YYYY', caption: '年', step: 1, type: 'Year' },
        { format: 'MM', caption: '月', step: 1, type: 'Month' },
        { format: 'DD', caption: '日', step: 1, type: 'Date' }
      ];

      let newselected = nextDate(selected);
      return { groups, newselected };
    }

    if (this.props.mode === 'time') {
      selected = selected ? timeStrToDate(selected, 'time') : new Date();


      let groups = [
        { format: 'hh', caption: '时', step: 1, type: 'Hour' },
        { format: 'mm', caption: '分', step: 1, type: 'Minute' }
      ];
      let newselected = nextMinute(selected);

      return { groups, newselected };
    }

    selected = handleSelect(selected);
    let _selected = 0;


    if (Array.isArray(selected) && selected.length > 0) {
      let _selectedClone = selected.slice(0);
      _selected = _selectedClone.shift();
      selected = _selectedClone;
    }

    data.forEach((item, index) => {
      if (item[this.props.dataMap.id] === _selected) {
        _selected = index;
      }
    });

    if (typeof data[_selected] === 'undefined') {
      _selected = 0;
    }

    newselected.push(_selected);
    let item = data[_selected] || {};

    var _group = JSON.parse(JSON.stringify(data));
    _group.forEach(g => delete g[subKey]);

    group.push({ items: _group, mapKeys: { label: this.props.dataMap.id } });

    if (typeof item[subKey] !== 'undefined' && Array.isArray(item[subKey])) {
      return this.parseData(item[subKey], subKey, selected, group, newselected);
    } else {
      return { groups: group, newselected };
    }
  }

  updateVisible(visible) {
    this.timeoutId && clearTimeout(this.timeoutId); //防止更改太快
    if (visible) {
      this.setState({
        show: true,
        animationClass: 'pickerenter'
      });
    } else {
      this.setState({
        animationClass: 'pickerleave'
      });

      this.timeoutId = setTimeout(() => {
        this.setState({
          show: false
        });
      }, 200);
    }
  }

  componentDidMount() {
    this.picker.current.addEventListener('touchmove', e => {
      e.preventDefault();
    }, {
      passive: false
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mode !== nextProps.mode || this.props.value !== nextProps.value) {
      const { range, dataMap, value, mode, start, end } = nextProps;
      let rangeValue = mode === 'region' ? cnCity : range;

      const { groups, newselected } = this.parseData(rangeValue, dataMap.items, value);
      this.setState({
        groups,
        selected: newselected,
        start: timeStrToDate(start, mode),
        end: timeStrToDate(end, mode)
      });
    }
  }

  cancelClick() {
    // 恢复之前的选项
    this.setState({
      selected: this.prevSelected,
      groups: this.prevGroups
    });
    this.selectedValue = this.prevSelectedValue;
    this.updateVisible(false);
  }

  confirmClick() {
    this.updateVisible(false);
    this.prevSelected = this.state.selected;
    this.prevGroups = this.state.groups;
    this.prevSelectedValue = this.selectedValue;
    this.props.onChange && this.props.onChange({ value: this.selectedValue });
    // this.props.onChange && this.props.onChange({value: this.selectedDate});
  }

  click(e) {
    this.updateVisible(true);
  }

  //  动态更新用户选择
  updateDataBySelected(selected, cb) {
    const { range, dataMap, mode } = this.props;
    let rangeValue = mode === 'region' ? cnCity : range;
    const { groups, newselected } = this.parseData(rangeValue, dataMap.items, selected);
    let text = [];
    switch (mode) {
      case 'region':
      case 'multiSelector':
        groups.forEach((group, _i) => {
          text.push(group.items[newselected[_i]][this.props.dataMap.id]);
        });
        break;
      case 'selector':
        text = newselected[0];
        break;
    }
    // 单列类型

    this.setState({
      groups,
      selected: newselected
    });

    cb(text);
  }

  handleItemChange(selected, groupIndex) {
    // 普通选择器和多列选择器，左侧列更改，右侧所有列 index 重置为0
    const selectedArr = this.state.selected.map((select, index) => {
      if (index < groupIndex) {
        return select;
      } else if (index === groupIndex) {
        return selected;
      } else {
        return 0;
      }
    });
    this.updateDataBySelected(selectedArr, value => {
      this.selectedValue = value;
    });
  }

  handleDateChange(data) {
    let { date, disabled } = data;
    if (!disabled) {
      this.selectedValue = this.props.mode === 'date' ? getDate(date) : getTime(date);
    } else {
      if (date > this.state.end) {
        this.selectedValue = this.props.end;
        date = this.state.end;
      } else {
        this.selectedValue = this.props.start;
        date = this.state.start;
      }
    }

    this.setState({
      selected: date
    })
  }

  // 先去掉 Picker、Overlay 的动画来避免 qreact 的 createPortal 产生的闪烁问题
  render() {
    return (
      <div>
        <div onClick={this.click.bind(this)}>{this.props.children}</div>
        {
          ReactDOM.createPortal((
            <div
              className='quist-picker'
              // className={'quist-picker  ' + this.state.animationClass}
              ref={this.picker}
              hidden={!this.state.show}
            >
              <div className="quist-picker-title">
                <span className="quist-picker-cancel" onClick={this.cancelClick.bind(this)}>
                  {this.props.cancelText}
                </span>
                <span
                  className="quist-picker-confirm"
                  style={{ color: this.props.okStyle }}
                  onClick={this.confirmClick.bind(this)}
                >
                  {this.props.okText}
                </span>
              </div>
              <div className="quist-picker-content">
                {this.state.groups.map(function(group, index) {
                  return (
                    <div className="anu-picker-item" key={this.props.mode + index}>
                      {this.props.mode === 'date' || this.props.mode === 'time' ? (
                        <DatePickerItem
                          value={this.state.selected}
                          onChange={this.handleDateChange}
                          step={group.step}
                          type={group.type}
                          format={group.format}
                          start={this.state.start}
                          end={this.state.end}
                          visible={this.state.show}
                        />
                      ) : (
                        <PickerItem
                          items={group.items}
                          mapKeys={group.mapKeys}
                          groupIndex={index}
                          onChange={this.handleItemChange.bind(this)}
                          defaultIndex={this.state.selected[index]}
                        />
                      )}
                    </div>
                  );
                }, this)}
              </div>
            </div>
          ), document.body)
        }
        <Overlay visible={this.state.show} onClose={this.cancelClick.bind(this)} />
      </div>
    );
  }
}

Picker.defaultProps = {
  cancelText: '取消',
  okText: '确定',
  mode: 'selector',
  dataMap: { id: 'name', items: 'sub' },
  okStyle: '#1AAD19'
};

export default Picker;
