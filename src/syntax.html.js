export default {
	argument: null,
	keyword: null,
	number: /[+-]?\d+[\b\.\w]*/g,
	operator: /=/g,
	tag: /<\/?[\w-]+|(?<=[\w"])>/g,
	string: /["'`][^"'`]*["'`]/g,
	variable: /\$\s*{[^}]+}/g,
	function: /\w+\([^)]*\)/g,
	comment: /<!--([\s\S]*?)-->/g,
}

