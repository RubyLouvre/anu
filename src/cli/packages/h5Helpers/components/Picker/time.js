/**
 * @module time工具
 */

function throwIfInvalidDate(date) {
  if (Object.prototype.toString.call(date, null) !== '[object Date]') {
    return false;
  }

  return true;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * @param  {Date}       日期
 * @return {String}     字符串格式
 */
export function convertDate(date, format) {
  let str = format;
  const o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if (/(Y+)/.test(format)) {
    str = str.replace(
      RegExp.$1,
      date
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    );
  }

  for (const k in o) {
    // eslint-disable-line
    if (new RegExp(`(${k})`).test(format)) {
      str = str.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(o[k].toString().length)
      );
    }
  }

  return str;
}

/**
 * 获取相对日期的偏移日期
 * @param  {Date}       日期
 * @return {number}     相对的天数
 */
export function nextYear(now, index = 0) {
  if (throwIfInvalidDate(now)) {
    const date = new Date(now.getTime());
    date.setFullYear(date.getFullYear() + index);
    return date;
  } else {
    return parseInt(now) + index;
  }
}

// 谨慎使用这个函数
export function nextMonth(now, index = 0) {
  throwIfInvalidDate(now);
  const month = now.getMonth() + index;
  const date = new Date(now.getTime());
  // 为了避免 2 月份没有 30号导致的 bug，这里统一设成 1
  date.setDate(1);
  date.setMonth(month);
  return date;
}

export function nextDate(now, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 24 * 60 * 60 * 1000);
  return date;
}

export function nextHour(now, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 60 * 60 * 1000);
  return date;
}

export function nextMinute(now, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 60 * 1000);
  return date;
}

export function nextSecond(now, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 1000);
  return date;
}

// 时间
const convert2Decimal = num => (num > 9 ? num : `0${num}`)// 时间


export function getDate(date) {
  throwIfInvalidDate(date);
  return `${date.getFullYear()}-${convert2Decimal(date.getMonth() + 1)}-${convert2Decimal(date.getDate())}`;
}

export function getTime(time) {
  throwIfInvalidDate(time);
  return `${convert2Decimal(time.getHours())}: ${convert2Decimal(time.getMinutes())}`;
}

/**
 * 时间字符串 "08:00:00" | "2016-03-02" 转换成日期对象
 * @param  {String} str 08:00:00
 * @param {String} type 'time' | 'date'
 * @return {Date}     日期对象
 */
export const timeStrToDate = (str = '', type) => {
  
  if (typeof str === 'string') {
    const d = new Date();
    if (type === 'time') {
      const arr = str.split(':');
      d.setHours(arr[0], arr[1], '00');
    } else if (type === 'date') {
      const arr = str.split('-');
      d.setFullYear(arr[0], arr[1] - 1, arr[2]);
    }
    
    return d;
  } else {
    return str;
  }
};
