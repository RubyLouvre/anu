function getActiveElement() {
    if (typeof document === 'object') {
        return document.activeElement
    }
}


function containsNode(outerNode, innerNode) {
    if (!outerNode || !innerNode) {
        return false;
    } else if (outerNode === innerNode) {
        return true;
    } else if (outerNode.nodeType === 3) {
        return false;
    } else if (innerNode.nodeType === 3) {
        return containsNode(outerNode, innerNode.parentNode);
    } else if ('contains' in outerNode) {
        return outerNode.contains(innerNode);
    } else if (outerNode.compareDocumentPosition) {
        return !!(outerNode.compareDocumentPosition(innerNode) & 16);
    } else {
        return false;
    }
}

function isInDocument(node) {
    return containsNode(document.documentElement, node);
}
export var  ReactInputSelection = {

    hasSelectionCapabilities: function (elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
    },

    getSelectionInformation: function () {
        var focusedElem = getActiveElement();
        return {
            focusedElem: focusedElem,
            selectionRange: ReactInputSelection.hasSelectionCapabilities(focusedElem) ? ReactInputSelection.getSelection(focusedElem) : null
        };
    },

    /**
     * @restoreSelection: If any selection information was potentially lost,
     * restore it. This is useful when performing operations that could remove dom
     * nodes and place them back in, resulting in focus being lost.
     */
    restoreSelection: function (priorSelectionInformation) {
        var curFocusedElem = getActiveElement();
        var priorFocusedElem = priorSelectionInformation.focusedElem;
        var priorSelectionRange = priorSelectionInformation.selectionRange;
        if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
            if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
                ReactInputSelection.setSelection(priorFocusedElem, priorSelectionRange);
            }
            focusNode(priorFocusedElem);
        }
    },

    /**
     * @getSelection: Gets the selection bounds of a focused textarea, input or
     * contentEditable node.
     * -@input: Look up selection bounds of this input
     * -@return {start: selectionStart, end: selectionEnd}
     */
    getSelection: function (input) {
        var selection;

        if ('selectionStart' in input) {
            // Modern browser with input or textarea.
            selection = {
                start: input.selectionStart,
                end: input.selectionEnd
            };
        } else if (document.selection && input.nodeName) {
            // IE8 input.
            var range = document.selection.createRange();
            // There can only be one selection per document in IE, so it must
            // be in our element.
            if (range.parentElement() === input) {
                selection = {
                    start: -range.moveStart('character', -input.value.length),
                    end: -range.moveEnd('character', -input.value.length)
                };
            }
        }
        return selection || {
            start: 0,
            end: 0
        };
    },

    /**
     * @setSelection: Sets the selection bounds of a textarea or input and focuses
     * the input.
     * -@input     Set selection bounds of this input or textarea
     * -@offsets   Object of same form that is returned from get*
     */
    setSelection: function (input, offsets) {
        var start = offsets.start;
        var end = offsets.end;
        if (end === undefined) {
            end = start;
        }

        if ('selectionStart' in input) {
            input.selectionStart = start;
            input.selectionEnd = Math.min(end, input.value.length);
        } else if (document.selection && input.nodeName) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveStart('character', start);
            range.moveEnd('character', end - start);
            range.select();
        }
    }
};

function focusNode(node) {
    // IE8 can throw "Can't move focus to the control because it is invisible,
    // not enabled, or of a type that does not accept the focus." for all kinds of
    // reasons that are too expensive and fragile to test.
    try {
        node.focus();
    } catch (e) {}
}