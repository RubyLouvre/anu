/**
 * COMMIT阶段也做成深度调先遍历
 * @param {*} fiber 
 * @param {*} topFiber 
 */

function dfs(fiber, topFiber) {
    do {
         //确保先删除后添加
        if (fiber.effects || fiber.hasError) {
           
            //NULLREF, DETACH
        }

        if (fiber.effectTag & PLACE === 0) {
            //PlACE
        }
        if (fiber.child) {
            fiber = fiber.child;
            continue;
        }
        if (fiber.sibling) {
            fiber = fiber.sibling;
            continue;
        }
        if (fiber.return) {
            //流程开始往上寻找时，它就会执行任务
            if (fiber.effectTag > 1) {
                //ATTR  REF HOOK  CALLBACK 
                executeEffects(fiber);
            }
            if (fiber.return !== topFiber) {
                fiber = fiber.return;
            } else {
                executeEffects(topFiber);
                break;
            }
        }

    } while (1);
}