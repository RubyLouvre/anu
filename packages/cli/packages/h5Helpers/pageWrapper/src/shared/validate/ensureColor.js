function expandCollapsedColor(color) {
  return color.length === 4 ? color + color.slice(-3) : color;
}

function ensureColorIsValidHexColor(position) {
  return function(color) {
    if (/^#([\da-f]{3}|[\da-f]{6})$/i.test(color))
      return expandCollapsedColor(color);
    throw new Error(
      `Color ${color} you provided in ${position} is not a valid HEX color.`
    );
  };
}

const ensureTabBarColorIsHexColor = ensureColorIsValidHexColor('tabBar');

export { ensureTabBarColorIsHexColor };
