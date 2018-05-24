
//查找它后面的节点
export function getHostSibling(fiber) {
    let parent = fiber.parent;
    while(fiber){
        if(fiber.stateNode === parent || fiber.isPortal  ){
            return null;
        }
        //首先往右找，找不到找这的父亲的右边
        let found = searchSibling(fiber);
        if(found){
            return found;
        }
        fiber = fiber.return;
    }
}


function searchSibling(fiber) {
    var found;
    while (fiber.sibling) {
        fiber = fiber.sibling;
        //如果这已经被销毁或者是传送门
        if(fiber.disposed || fiber.isPortal ){
           
            continue;
        }
        if (fiber.tag > 3) {
            return fiber.stateNode;
        }
        if (fiber.child) {
            found = searchChild(fiber);
            if (found) {
                return found;
            }
        }
    }
}

function searchChild(fiber) {
    var found;
    while(fiber.child){
        fiber = fiber.child;
        if(fiber.disposed || fiber.isPortal ){
            return;
        }
        if (fiber.tag > 3) {
            return fiber.stateNode;
        }
        if(fiber.sibling){
            found = searchSibling(fiber);
            if (found) {
                return found;
            }
        }
    }
}