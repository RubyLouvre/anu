
export const Children = {
	only(children) {
		return children && children[0] || null;
	},
	count(children) {
		return children && children.length || 0;
	},
};
/*
function proptype() {}
proptype.isRequired = proptype;

export const PropTypes = {
	element: proptype,
	func: proptype,
	shape: () => proptype,
	instanceOf: ()=> proptype
};
*/