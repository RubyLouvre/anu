// 过滤快应用中不支持的属性
import config from '../../config/config';

module.exports = function ignoreAttri(astPath: any, nodeName: string) {
    
    if (attributes[nodeName]) {
        astPath.node.attributes = astPath.node.attributes.filter(function (el: any) {
            const ignoreRule = attributes[nodeName].rules;
            const ignoreFunc = attributes[nodeName].ruleFunc;
            const attriName = el.name.name.toLowerCase();
            // 过滤rules中的规则
            if ((ignoreRule as any).includes(attriName)) {
                return false;
            }
            // 过滤ruleFunc中匹配的规则
            if (typeof ignoreFunc === 'function') {
                return ignoreFunc(attriName, el.value);
            }
            return true;
        });
    }

};

/**
 * rules 优先匹配，匹配到删除规则
 * ruleFunc 根据props值匹配
 */
const attributes: {
    [attrName: string]: {
        rules: Array<string>;
        ruleFunc?: (props: string, node: any) => {};
    }
} = {

    list: {
        //这里是不支持的属性
        rules: ['scroll-y','scroll-x','scroll-into-view','scroll-left','lower-threshold','enable-back-to-top','scroll-with-animation'],
        
    },
    'list-item': {
        rules: ['animation']
    },
    text: {
        rules: ['animation','size','content','decode','color','open-type']
    },
    switch: {
        rules: ['color']
    },
    stack: {
        rules: ['animation'],
        ruleFunc: function(props, node) {
            if (config.huawei) {
                var inValidProps: any = {
                    onmouseup: 1,
                    onmousemove: 1,
                    onmousedown: 1,
                    catchmousemove: 1,
                    catchmousedown: 1,
                    catchmouseup: 1
                }

                if (inValidProps[props]) {
                    return false;
                }
            }
            return true;
        }
    },
    div: {
        rules: ['animation','hover-class','formtype','type','open-type','src','action','submit','onchange','ongetuserinfo','onscale', 'getphonenumber'],
        ruleFunc: function(props, node) {
            if (config.huawei) {
                const invalidProps: any = {
                    onscale: 1,
                    onend: 1, 
                    onerror: 1, 
                    onpause: 1, 
                    onchange: 1,
                    onplay: 1,
                    ongetuserinfo: 1
                }

                if (invalidProps[props]) {
                    return false;
                }
            }
            return true;
        }
    },
    input: {
        rules: ['placeholder-style','placeholder-class'],
        ruleFunc: function(props, node) {
            if (config.huawei) {
                if (props === 'type') {
                    const validValues: any = ['button', 'checkbox', 'radio', 'text', 'email', 'date', 'time', 'number', 'password'];
                    if (node.type !== 'StringLiteral' || !validValues.includes(node.value))  {
                        return false;
                    }
                }
            }
            return true;
        }
    },
    image: {
        rules: ['mode','width','height','confirm','focus','confirm-type'],
        ruleFunc: function(props, node) {
            if (config.huawei) {
                if (props === 'onload') {
                    return false;
                }
            }
            return true;
        }
    },
    swiper: {
        rules: ['indicator-dots','duration','indicator-active-color','indicator-color','circular']
    },
    video: {
        rules: ['show-center-play-btn','objectfit,show-play-btn','direction']
    },
    textarea: {
        rules: ['placeholder-class','show-confirm-bar','focus','value','cursor-spacing'],
        ruleFunc: function(props, node) {
            if (config.huawei) {
                if (props === 'onlinechange') {
                    return false;
                }
            }
            return true;
        }
    }
};