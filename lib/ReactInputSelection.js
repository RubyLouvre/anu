(function umd(root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory(require("react"));
    } else if (typeof define === "function" && define.amd) {
        define(["react"], factory);
    } else if (typeof exports === "object") {
        exports["ReactInputSelection"] = factory(require("react"));
    } else {
        root["ReactInputSelection"] = factory(root["React"]);
    }
})(this, function (ReactInAnujs) {
    var isBrowser = typeof document === "object";

    function isInDocument(node) {
        if (!isBrowser) {
            return false;
        }
        return containsNode(document.documentElement, node);
    }
    function containsNode(a, b) {
        if (b) {
            while ((b = b.parentNode)) {
                if (b === a) {
                    return true;
                }
            }
        }
        return false;
    }

    function focusNode(node) {
        //如果此元素不可见，IE8会抛错
        try {
            node.focus();
        } catch (e) {
            // no catch
        }
    }

    function getNodeTag(node) {
        return node.nodeName
            ? node
                .nodeName
                .toLowerCase()
            : "";
    }

    function getActiveElement(doc) {
        doc = doc || (isBrowser
            ? document
            : undefined);
        if (typeof doc === "undefined") {
            return null;
        }
        try {
            return doc.activeElement || doc.body;
        } catch (e) {
            return doc.body;
        }
    }
    /**
     * @ReactInputSelection: React input selection module. Based on Selection.js,
     * but modified to be suitable for react and has a couple of bug fixes (doesn"t
     * assume buttons have range selections allowed).
     * Input selection module for React.
     */
    var ReactInputSelection = {
        hasSelectionCapabilities: function (elem) {
            var nodeName = getNodeTag(elem || {});
            return nodeName && (nodeName === "input" && elem.type === "text" || nodeName === "textarea" || elem.contentEditable === "true");
        },

        getSelectionInformation: function () {
            let focusedElem = getActiveElement();
            var selectionRange = ReactInputSelection.hasSelectionCapabilities(focusedElem)
                ? ReactInputSelection.getSelection(focusedElem)
                : null;
            return {focusedElem, selectionRange};
        },
        restoreSelection: function (lastInformation) {
            var curFocusedElem = getActiveElement();
            var priorFocusedElem = lastInformation.focusedElem;
            var priorSelectionRange = lastInformation.selectionRange;

            if (curFocusedElem && isInDocument(priorFocusedElem)) {
                if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
                    ReactInputSelection.setSelection(priorFocusedElem, priorSelectionRange);
                }
                focusNode(priorFocusedElem);
            }
        },
        getSelection: function (input) {
            var selection;

            if ("selectionStart" in input) {
                // Modern browser with input or textarea.
                selection = {
                    start: input.selectionStart,
                    end: input.selectionEnd
                };
            } else if (document.selection && getNodeTag(input) === "input") {
                // IE8 input.
                var range = document
                    .selection
                    .createRange();
                // There can only be one selection per document in IE, so it must be in our
                // element.
                if (range.parentElement() === input) {
                    selection = {
                        start: -range.moveStart("character", -input.value.length),
                        end: -range.moveEnd("character", -input.value.length)
                    };
                }
            } else {
                // Content editable or old IE textarea.
                selection = ReactDOMSelection.getOffsets(input);
            }

            return selection || {
                start: 0,
                end: 0
            };
        },

        setSelection: function (input, offsets) {
            var start = offsets.start;
            var end = offsets.end;
            if (end === undefined) {
                end = start;
            }

            if ("selectionStart" in input) {
                input.selectionStart = start;
                input.selectionEnd = Math.min(end, input.value.length);
            } else if (document.selection && getNodeTag(input) === "input") {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveStart("character", start);
                range.moveEnd("character", end - start);
                range.select();
            } else {
                ReactDOMSelection.setOffsets(input, offsets);
            }
        }
    };

    function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
        return anchorNode === focusNode && anchorOffset === focusOffset;
    }

    function getIEOffsets(node) {
        var selection = document.selection;
        var selectedRange = selection.createRange();
        var selectedLength = selectedRange.text.length;

        // Duplicate selection so we can move range without breaking user selection.
        var fromStart = selectedRange.duplicate();
        fromStart.moveToElementText(node);
        fromStart.setEndPoint("EndToStart", selectedRange);

        var startOffset = fromStart.text.length;
        var endOffset = startOffset + selectedLength;

        return {start: startOffset, end: endOffset};
    }

    /**
     * @param {DOMElement} node
     * @return {?object}
     */
    function getModernOffsets(node) {
        var selection = window.getSelection && window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return null;
        }

        var anchorNode = selection.anchorNode;
        var anchorOffset = selection.anchorOffset;
        var focusNode = selection.focusNode;
        var focusOffset = selection.focusOffset;

        var currentRange = selection.getRangeAt(0);

        // In Firefox, range.startContainer and range.endContainer can be "anonymous
        // divs", e.g. the up/down buttons on an <input type="number">. Anonymous divs
        // do not seem to expose properties, triggering a "Permission denied error" if
        // any of its properties are accessed. The only seemingly possible way to avoid
        // erroring is to access a property that typically works for non-anonymous divs
        // and catch any error that may otherwise arise. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
        try {
            /* eslint-disable no-unused-expressions */
            currentRange.startContainer.nodeType;
            currentRange.endContainer.nodeType;
            /* eslint-enable no-unused-expressions */
        } catch (e) {
            return null;
        }

        // If the node and offset values are the same, the selection is collapsed.
        // `Selection.isCollapsed` is available natively, but IE sometimes gets this
        // value wrong.
        var isSelectionCollapsed = isCollapsed(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);

        var rangeLength = isSelectionCollapsed
            ? 0
            : currentRange
                .toString()
                .length;

        var tempRange = currentRange.cloneRange();
        tempRange.selectNodeContents(node);
        tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

        var isTempRangeCollapsed = isCollapsed(tempRange.startContainer, tempRange.startOffset, tempRange.endContainer, tempRange.endOffset);

        var start = isTempRangeCollapsed
            ? 0
            : tempRange
                .toString()
                .length;
        var end = start + rangeLength;

        // Detect whether the selection is backward.
        var detectionRange = document.createRange();
        detectionRange.setStart(anchorNode, anchorOffset);
        detectionRange.setEnd(focusNode, focusOffset);
        var isBackward = detectionRange.collapsed;

        return {
            start: isBackward
                ? end
                : start,
            end: isBackward
                ? start
                : end
        };
    }

    /**
     * @param {DOMElement|DOMTextNode} node
     * @param {object} offsets
     */
    function setIEOffsets(node, offsets) {
        var range = document
            .selection
            .createRange()
            .duplicate();
        var start,
            end;

        if (offsets.end === undefined) {
            start = offsets.start;
            end = start;
        } else if (offsets.start > offsets.end) {
            start = offsets.end;
            end = offsets.start;
        } else {
            start = offsets.start;
            end = offsets.end;
        }

        range.moveToElementText(node);
        range.moveStart("character", start);
        range.setEndPoint("EndToStart", range);
        range.moveEnd("character", end - start);
        range.select();
    }

    /**
     * In modern non-IE browsers, we can support both forward and backward
     * selections.
     *
     * Note: IE10+ supports the Selection object, but it does not support
     * the `extend` method, which means that even in modern IE, it"s not possible
     * to programmatically create a backward selection. Thus, for all IE
     * versions, we use the old IE API to create our selections.
     *
     * @param {DOMElement|DOMTextNode} node
     * @param {object} offsets
     */
    function setModernOffsets(node, offsets) {
        if (!window.getSelection) {
            return;
        }

        var selection = window.getSelection();
        var length = node.textContent.length;
        var start = Math.min(offsets.start, length);
        var end = offsets.end === undefined
            ? start
            : Math.min(offsets.end, length);

        // IE 11 uses modern selection, but doesn"t support the extend method. Flip
        // backward selections, so we can set with a single range.
        if (!selection.extend && start > end) {
            var temp = end;
            end = start;
            start = temp;
        }

        var startMarker = getNodeForCharacterOffset(node, start);
        var endMarker = getNodeForCharacterOffset(node, end);

        if (startMarker && endMarker) {
            var range = document.createRange();
            range.setStart(startMarker.node, startMarker.offset);
            selection.removeAllRanges();

            if (start > end) {
                selection.addRange(range);
                selection.extend(endMarker.node, endMarker.offset);
            } else {
                range.setEnd(endMarker.node, endMarker.offset);
                selection.addRange(range);
            }
        }
    }

    var useIEOffsets = isBrowser && "selection" in document && !("getSelection" in window);
    var ReactDOMSelection = {
        getOffsets: useIEOffsets
            ? getIEOffsets
            : getModernOffsets,
        setOffsets: useIEOffsets
            ? setIEOffsets
            : setModernOffsets
    };

    function getLeafNode(node) {
        while (node && node.firstChild) {
            node = node.firstChild;
        }
        return node;
    }

    function getSiblingNode(node) {
        while (node) {
            if (node.nextSibling) {
                return node.nextSibling;
            }
            node = node.parentNode;
        }
    }

    function getNodeForCharacterOffset(root, offset) {
        var node = getLeafNode(root);
        var nodeStart = 0;
        var nodeEnd = 0;
        while (node) {
            if (node.nodeType === 3) {
                nodeEnd = nodeStart + node.textContent.length;

                if (nodeStart <= offset && nodeEnd >= offset) {
                    return {
                        node: node,
                        offset: offset - nodeStart
                    };
                }
                nodeStart = nodeEnd;
            }
            node = getLeafNode(getSiblingNode(node));
        }
    }
    //重写options
    var priorSelectionInformation = {};
    var options = ReactInAnujs.options;
    function restoreSelectionInterface() {
        ReactInputSelection.restoreSelection(priorSelectionInformation);
    }
    function getSelectionInterface() {
        var a = ReactInputSelection.getSelectionInformation();
        if (a.focusedElem && a.selectionRange) {
            priorSelectionInformation = a;
        }else{
            priorSelectionInformation = {};
        }
    }
    var newOptions = {
        beforePatch: getSelectionInterface,
        afterPatch: restoreSelectionInterface,
    };
    function fixOptions(obj, name, oldFn, fn) {
        if (oldFn) {
            obj[name] = function (a) {
                fn(a);
                oldFn(a);
            };
        } else {
            obj[name] = fn;
        }
    }

    for (let i in newOptions) {
        fixOptions(options, i, options[i], newOptions[i]);
    }
    return ReactInputSelection;
});