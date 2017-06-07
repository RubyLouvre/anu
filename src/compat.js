
export const Children = {
	only(children) {
		return children && children[0] || null;
	},
	count(children) {
		return children && children.length || 0;
	},
};
