import { updateClassComponent, updateHostComponent } from "./beginWork";
import { gSBU } from "react-core/util";


/**
 * COMMIT阶段也做成深度调先遍历
 * @param {*} fiber 
 * @param {*} topFiber 
 */

function commitDFS(fiber, topFiber) {
    do {
        //确保先删除后添加
        if (fiber.effects || fiber.hasError) {

            //NULLREF, DETACH
        }

        if (fiber.effectTag & PLACE === 0) {
            //PlACE
        }
        if (fiber.hasMounted && fiber.stateNode[gSBU]) {
            // 执行 getSnapshotBeforeUpdate
            // updater.snapshot = guardCallback(instance, gSBU, [updater.prevProps, updater.prevState]);
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


var pendingFiber = []
function reconcileDFS(fiber, topFiber, info, dl) {
    do {

        if (dl.timeRemaining < 1) { //时间不够，下次处理
            pendingFiber.push(fiber);
            break
        }

        //没有销毁， 就实例化或更新组件
        if (!fiber.disposed) {
            if (fiber.tag < 3) {
                updateClassComponent(fiber, info);
                //在批处理中，它的updateFail会失效
            } else {
                updateHostComponent(fiber, info);
            }
            //没有发生异常 或 没有SCU 
            if (!fiber.occurError && !fiber.updateFail && fiber.child) {
                fiber = fiber.child;
                continue;
            }
        }
        if (fiber.sibling) {
            fiber = fiber.sibling;
            continue;
        }
        if (fiber.return) {
            //流程开始往上寻找时, 处理containerStack， contextStack, parent.insertPoint
            let instance = fiber.stateNode;
            let updater = instance && instance.updater;
            if (fiber.shiftContainer) {
                delete fiber.shiftContainer;
                info.containerStack.shift(); 
            } else if (updater) {
                if (fiber.shiftContext) {
                    delete fiber.shiftContext;
                    info.contextStack.shift(); 
                }
            }
            //instance为元素节点
            if (instance.insertPoint) {
                instance.insertPoint = null;
            }

            //处理contextStack, containerStack
            if (fiber.return !== topFiber) {
                fiber = fiber.return;
            } else {
                //清空所有栈
                break;
            }
        }

    } while (1);
}