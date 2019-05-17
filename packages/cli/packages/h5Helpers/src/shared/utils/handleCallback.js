export function handleSuccess(options, success, complete, resolve) {
  success(options);
  complete(options);
  resolve(options);
}

export function handleFail(options, fail, complete, reject) {
  fail(options);
  complete(options);
  reject(options);
}
