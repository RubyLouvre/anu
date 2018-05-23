

export function insertVersion(fiber, remove) {
    var parent = fiber.parent;
    if (remove) {
        removeVersion(fiber);
    }
    var head = parent._link;
    if (!head) {
        parent._link = fiber;
    } else {
        _insertList(parent, head, fiber);
    }
}

export function findNext(fiber) {
    for (var head = fiber.parent._link; head; head = head._link) {
        if (head.stateNode === fiber.stateNode) {
            return head.next ? head.next.stateNode : null;
        }
    }
    return null;
}
function _insertList(parent, head, fiber) {
    // 0， 1， 2， 3， 5 插入 4
    if (versionCompare(head, fiber) == 1) {
        fiber._link = head;
        parent._link = fiber;
        return;
    }
    while (head) {
        if (!head._link) {
            head._link = fiber;
            return;
        }
        if (versionCompare(head._link, fiber) == 1) {
            var b = head._link;
            head._link = fiber;
            fiber._link = b;
            break;
        }
        head = head._link;
    }
}
export function removeVersion(fiber) {
    var parent = fiber.parent;
    var head = parent._link;
    if (head) {
        if (head.stateNode == fiber.stateNode) {
            parent._link = head._link;
            return;
        }
        while (head._link) {
            if (head._link.stateNode == fiber.stateNode) {
                head._link = head._link._link;
                break;
            }
        }
    }
}
//versionCompare(a, b) = -1时， b在a的后面， = 1时相反
export function versionCompare(a, b) {
    var straArr = a.version.split(".");
    var strbArr = b.version.split(".");
    var maxLen = Math.max(straArr.length, strbArr.length);
    var result, sa, sb;
    for (var i = 0; i < maxLen; i++) {
        sa = ~~straArr[i];
        sb = ~~strbArr[i];
        if (sa > sb) {//2，1
            result = 1;
        } else if (sa < sb) {// 1， 2
            result = -1;
        } else {
            result = 0;
        }
        if (result !== 0) {
            return result;
        }
    }
    return result;
}



