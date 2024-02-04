export default {
	argument: null,
	comment: /<!--([\s\S]*?)-->/g,
	function: null,
	keyword: null,
	number: /[+-]?\d+[\b\.\w]*/g,
	operator: /=/g,
	string: /["'][^"']*["']/g,
	tag: function (string, node) {
		const ranges = [];
		const regex = /(<\/?[\w-]+).*?(>)/gs;
		const matches = string.matchAll(regex);
		for (const match of matches) {
			const idx = match.index;
			const fullmatch = match.shift();
			match.forEach (item => {
				const start = idx + fullmatch.indexOf(item);
				const end = start + item.length;
				const range = new Range();
				range.setStart(node, start);
				range.setEnd(node, end);
				ranges.push(range);
			});
		}

		return ranges;
	}
}

