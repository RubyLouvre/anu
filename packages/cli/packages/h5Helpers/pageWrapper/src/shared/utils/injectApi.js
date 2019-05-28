export default (src, dest, apis) => apis.forEach(api => (dest[api] = src[api]));
