export function showToast(obj) {
    var prompt = require('@system.prompt');
    obj.message = obj.title;
    obj.duration = obj.duration / 1000;
    prompt.showToast(obj);
}