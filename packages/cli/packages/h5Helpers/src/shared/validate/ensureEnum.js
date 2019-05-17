const validateEnum = options => option => options.includes(option);

const validateTabBarBorderStyle = validateEnum(['black', 'white']);

function ensureTabBarBorderStyle(option) {
  if (validateTabBarBorderStyle(option)) return option;
  throw new Error(
    `\`borderStyle\` should be \`white\` or \`black\` only, got ${option}`
  );
}

export { ensureTabBarBorderStyle };
