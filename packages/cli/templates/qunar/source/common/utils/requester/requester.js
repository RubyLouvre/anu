/**
 * 20181011 简化版本 直接调用娜娜奇的request
 * 别引这个，引上层的request.js
 *
 * requester.request({
 *      // 以下三个字段会拼接成 url
 *      host: "https://wxapp.qunar.com"
 * 	    service: requester.service.SEARCH, // 接口名：'/train/product/h5/train/TrainDetail' 必须
 *      param: { // 请求参数，拼在 url 后面 可省略
 *          searchType: 'stasta',
 *          startStation: param.startStation,
 *          endStation: param.endStation,
 *          date: param.date
 *      },
 *
 *      data: {}, // 可省略
 *      header: {}, // 可省略
 *      method: 'POST', // 默认：'GET' 可省略
 *      dataType: 'json', // 默认为 json。如果设置了 dataType 为 json，则会尝试对响应的数据做一次 JSON.parse 可省略
 *      success: function() { }, // 可省略
 *      fail: function() { }, // 可省略
 *      complete: function() { }, // 可省略
 *  });
 *
 * 注：c 参，默认会拼在 url 后面，如果需要放在其他地方，可通过 requester.getParamC() 获取 c 参，自行添加。
 *
 */

import React from '@react';
import Config from '../config/config.js';
import RequestManager from './requestManager.js';
// import util from '../util';

function request(obj, initUserData) {
    const service = obj.service;
    const globalData = React.getApp().globalData;
    let param = obj.param || {};

    if (!service || !service.length) {
        // console.error('service 为空');
        return false;
    }

    let queryComponents = [];
    // 加入请求里的param
    for (let key in param) {
        let value = param[key] || '';
        queryComponents.push(key + '=' + encodeURIComponent(value));
    }
    // 加入缓存里的cookies
    const { cookies } = initUserData;
    for (let key in cookies) {
        let value = cookies[key] || '';
        queryComponents.push(key + '=' + encodeURIComponent(value));
    }
    // 加一些埋点数据
    if (globalData.bd_origin) queryComponents.push(`bd_origin=${globalData.bd_origin}`);
    if (globalData.hd_origin) queryComponents.push(`hd_origin=${globalData.hd_origin}`);
    // todo config配置 暂时没有 先写个微信的beta,这个到时候在
    let url = (obj.host ? obj.host : Config.settings.requestDomain) + service + '?' + queryComponents.join('&');
    url = decodeURIComponent(url);
    // 处理某些业务线需要在header中传参数的情况
    let header = obj.header || {'Content-Type': 'application/json'};
    let req = {
        url: url,
        data: obj.data,
        header,
        method: (obj.method && obj.method.toUpperCase()) || 'GET',
        dataType: obj.dataType || 'json',
        success: obj.success,
        fail: obj.fail,
        complete: obj.complete
    };
    RequestManager.request(req);

    return true;
}

export default request;