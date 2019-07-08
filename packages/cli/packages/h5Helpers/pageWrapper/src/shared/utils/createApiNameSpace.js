export default function createApiNameSpace() {
  return new Proxy(
    {},
    {
      get: function(target, key, receiver) {
        if (target[key]) {
          return Reflect.get(target, key, receiver);
        }

        return function() {
          // eslint-disable-next-line no-console
          console.warn(
            `You are accessing \`React.api.${key}\`, which is not found in the React.api namespace, ` +
              `try React.${key} or check whether the method name is correct`
          );
        };
      }
    }
  );
}
