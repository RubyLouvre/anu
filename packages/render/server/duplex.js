import { Children } from 'react-core/Children';

//收集option元素的文本
function flattenOptionChildren(children) {
    let content = '';
    // 忽略掉里面的元素节点
    Children.forEach(children, function(child) {
        if (child == null) {
            return;
        }
        if (typeof child === 'string' || typeof child === 'number') {
            content += child;
        }
    });
    return content;
}
export var duplexMap = {
    input(props, inst) {
        return Object.assign(
            {
                type: undefined
            },
            props,
            {
                defaultChecked: undefined,
                defaultValue: undefined,
                value: props.value != null ? props.value : props.defaultValue,
                checked: props.checked != null ? props.checked : props.defaultChecked
            }
        );
    },
    textarea(props, inst) {
        let initialValue = props.value;
        if (initialValue == null) {
            let defaultValue = props.defaultValue;
            // TODO (yungsters): Remove support for children content in <textarea>.
            let textareaChildren = props.children;
            if (textareaChildren != null) {
                if (Array.isArray(textareaChildren)) {
                    textareaChildren = textareaChildren[0];
                }

                defaultValue = '' + textareaChildren;
            }
            if (defaultValue == null) {
                defaultValue = '';
            }
            initialValue = defaultValue;
        }

        return Object.assign({}, props, {
            value: undefined,
            children: '' + initialValue
        });
    },
    select(props, inst) {
        inst.currentSelectValue =
      props.value != null ? props.value : props.defaultValue;
        return Object.assign({}, props, {
            value: undefined
        });
    },
    option(props, inst) {
        let selected = null;
        const selectValue = inst.currentSelectValue;
        const optionChildren = flattenOptionChildren(props.children);
        if (selectValue != null) {
            let value;
            if (props.value != null) {
                value = props.value + '';
            } else {
                value = optionChildren;
            }
            selected = false;
            if (Array.isArray(selectValue)) {
                // multiple
                for (let j = 0; j < selectValue.length; j++) {
                    if ('' + selectValue[j] === value) {
                        selected = true;
                        break;
                    }
                }
            } else {
                selected = '' + selectValue === value;
            }

            return Object.assign(
                {
                    selected: undefined,
                    children: undefined
                },
                props,
                {
                    selected: selected,
                    children: optionChildren
                }
            );
        } else {
            return props;
        }
    }
};
