import { contextStack } from "../share";
//import { NOWORK } from "../effectTag";

export function completeWork(fiber, topWork) {
    //收集effects
    var parentFiber = fiber.return;
    if (fiber.tag < 3) {
        fiber.stateNode._reactInternalFiber = fiber;
        if (fiber.stateNode.getChildContext) {
            contextStack.pop(); // pop context
        }
    }
    console.log("收集副作用", fiber.name, fiber.effectTag, fiber.onlyPlace);
    // delete fiber.onlyPlace;

    if (parentFiber && fiber !== topWork) {
        const childEffects = fiber.effects || [];
        const thisEffect = fiber.effectTag > 1 ? [fiber] : [];
        const parentEffects = parentFiber.effects || [];

        parentFiber.effects = parentEffects.concat(childEffects, thisEffect);
    }
}


function completeWork(fiber, shouldUpdate) {
    var effects = fiber.effects;
    var isHost = fiber.tag > 3;
    if (effects) {
        delete fiber.effects;
    } else {
        effects = [];
    }
    for (var i in fiber._children) {
        var child = fiber[i];
        if (!child.onlyPlace) {
            effects = effects.concat(completeWork(fiber));
        }else{
            if(isHost){
                effects.push(child);
            }else{
                effects = effects.concat(completeWork(fiber, true ));
            }
         
            delete child.onlyPlace; 
        }
    }

    if (fiber.effectTag) {
        effects.push(fiber);
    }
    
   
    return effects;
}