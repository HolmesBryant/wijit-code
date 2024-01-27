export default {
	argument: null,
	comment: /<!--([\s\S]*?)-->/g,
	decorator: null,
	function: null,
	keyword: null,
	number: /[+-]?\d+[\b\.\w]*/g,
	operator: null,
	string: /["'][^"']*["']/g,
	tag: function (string, node) {
		const ranges = [];
		const regex = /(<\/*\w+)[^>]*(>*)/g;
		const matches = string.matchAll (regex);
		for (const item of matches) {
			let start = item.index;
			const fullmatch = item.shift();
			for (const token of item) {
				const range = new Range();
				start = start + fullmatch.indexOf(token);
				range.setStart (node, start);
				range.setEnd (node, start + token.length);
				ranges.push (range);
			}
		}
		return ranges;
	}
}
