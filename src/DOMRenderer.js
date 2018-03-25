import { inputControll, formElements } from './inputControll';
import { diffProps } from './diffProps';
import { get } from './util';
import { Refs } from './Refs';
import { emptyObject, topNodes, topFibers, updateQueue } from './share';
import { emptyElement, createElement, insertElement, removeElement } from './browser';
//其他Renderer也要实现这些方法
export let DOMRenderer = {
	updateAttribute(fiber) {
		let { type, props, lastProps, stateNode } = fiber;
		diffProps(stateNode, lastProps || emptyObject, props, fiber);
		if (formElements[type]) {
			inputControll(fiber, stateNode, props);
		}
	},
	updateContext(fiber) {
		fiber.stateNode.nodeValue = fiber.props.children;
	},
	updateRoot(vnode, root, callback) {
		if (!(root && root.appendChild)) {
			throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
		}
		let hostRoot = {
			stateNode: root,
			root: true,
			tag: 5,
			type: root.tagName.toLowerCase(),
			props: {
				children: vnode
			},
			namespaceURI: root.namespaceURI, //必须知道第一个元素的文档类型
			effectTag: 19, //CALLBACK
			alternate: get(root),
			callback() {
				let instance = hostRoot.child ? hostRoot.child.stateNode : null;
				callback && callback.call(instance);
			}
		};
		if (topNodes.indexOf(root) == -1) {
			topNodes.push(root);
			topFibers.push(hostRoot);
		}
		return hostRoot;
	},
	createElement,
	insertElement,
	emptyElement(fiber) {
		emptyElement(fiber.stateNode);
	},
	removeElement(fiber) {
		let instance = fiber.stateNode;
		removeElement(instance);
		let j = topNodes.indexOf(instance);
		if (j !== -1) {
			topFibers.splice(j, 1);
			topNodes.splice(j, 1);
		}
	}
};
