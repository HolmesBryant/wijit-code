export default {
	argument: null,
	attribute: null,
	comment: null,
	function: null,
	keyword: ['some','key', 'words'],
	number: /\b\d+\b/g,
	operator: null,
	string: null,
	tag: function (string, node) {
		const ranges = [];
		const regex = /(<\w+\b).*(>)/g;
		// const regex = /(<\/\w+>)/g;
		const matches = string.matchAll (regex);
		for (const item of matches) {
			// console.log(item);
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
