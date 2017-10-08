
//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
function errRef() {
    throw "ref位置错误";
}
export var pendingRefs = [];
export var Refs = {
    currentOwner: null,
    clearRefs: function(){
        var refs = pendingRefs.splice(0,pendingRefs.length );
        refs.forEach(function(fn) {
            fn();
        });
    },
    detachRef:function(ref, nextRef, dom) {
        ref = ref || getDOMNode;
        nextRef = nextRef || getDOMNode;   
        if(ref === nextRef) {
            return;
        }    
        if(ref){
            if (ref.string && nextRef.string ? ref.string !== nextRef.string: ref !== getDOMNode ) {
                ref(null);
            }
        }
        if(dom && nextRef !== getDOMNode){
            nextRef(dom);
        }
    },
    createInstanceRef: function(updater, ref){
        updater._ref = function(){
            if(ref){
                var inst = updater._instance;
                ref(inst.__isStateless ? null: inst);
            }
            updater._ref = getDOMNode;
        };
    },
    createStringRef: function (owner, ref) {
        var stringRef = owner === null
            ? errRef
            : function (dom) {
                if (dom) {
                    if (dom.nodeType) {
                        dom.getDOMNode = getDOMNode;
                    }   
                    owner.refs[ref] = dom;
                }else{
                    delete owner.refs[ref];
                }
            };
        stringRef.string = ref;
        return stringRef;
    }
};

