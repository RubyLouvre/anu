const util = {
  getRAF: () => {
    const basicRAF = cb => setTimeout(cb, 1000 / 60);
    let rAF = requestAnimationFrame || basicRAF;
    let cancelrAF = cancelAnimationFrame || clearTimeout;
    return { rAF, cancelrAF };
  },
  getTime: () => Date.now(),
  ease: {
    in: (k) => Math.pow(k, 2)
  },
  getArray: (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(1);
    }
    return arr;
  }
};

export default util;