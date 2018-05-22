
export function insertList(a) {
    var v = a.version, parent = a.parent;
    var list = [], b = a;
    while (a) {
        list.unshift(a.index);
        if (a.return && a.return.tag < 3) {
            a = a.return;
        } else {
            break;
        }
    }
    var nv = list.join(".");
    if (nv !== v) {
        b.version = nv;
        var head = parent.__head;
        if (!head) {
            parent.__head = b;
        } else {
            _insertList(parent, head, b);
        }
    }
}
export function _insertList(parent, head, fiber) {
    //如果fiber在head的前面
    if (versionCompare(head, fiber) == 1) {
        fiber.next = head;
        parent.__head = fiber;
        return;
    }
    while (head.next) {
        //fiber在head.next前面，在head后面
        if (versionCompare(head.next, fiber) == 1) {
            var b = head.next;
            head.next = fiber;
            fiber.next = b;
            break;
        }
    }
}
export function removeList(fiber) {
    var parent = fiber.parent;
    var head = parent.__head;
    if (head) {
        if (head.stateNode == fiber.stateNode) {
            parent.__head = head.next;
            return;
        }
        while (head.next) {
            if (head.next.stateNode == fiber.stateNode) {
                head.next = head.next.next;
                break;
            }
        }
    }
}

export function versionCompare(stra, strb) {
    var straArr = stra.split(".");
    var strbArr = strb.split(".");
    var maxLen = Math.max(straArr.length, strbArr.length);
    var result, sa, sb;
    for (var i = 0; i < maxLen; i++) {
        sa = ~~straArr[i];
        sb = ~~strbArr[i];
        if (sa > sb) {
            result = 1;
        } else if (sa < sb) {
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



