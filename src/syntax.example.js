/**
 * @summary Syntax definition file for wijit-code web component
 * @description This file exports a single default object
 *              containing several properties.
 *
 * 				Each property name corresponds to an argument given to a
 * 				::highlight() css pseudo-element which should be defined
 * 				in a stylesheet. The css pseudo element should define a
 * 				text color for all elements matched.
 * 				Example:
 * 				<style>
 * 					::highlight(argument) {
 * 						color: orange;
 * 					}
 * 				</style>
 *
 * 				The value for each property in this file can be one of
 * 				three types: Array, RegExp or Function.
 *
 * 				Arrays are useful for defining things like keywords.
 * 				Example: ['some', 'key', 'words']
 *
 * 				RegExp expressions are useful for simple matches that
 * 				do not require extra processing. The RexExp *must* include
 * 				the "g" flag. Do not put quotes around the expression.
 * 				Example: /\b\d+\b/g
 *
 * 				Functions are useful for more complex processing.
 * 				Each function must take two arguments (string, node)
 * 				and return a flat array of Range objects.
 *
 * 				"node" is this.childNodes[0] which is the node containing
 *				the textContent of everything inside the component's
 *				start/end tags. Use "node" when invoking
 *				range.setStart(node, index) and range.setEnd(node, index);
 *
 *				"string" is the textContent contained by the component.
 *				It inclues spaces, tabs, line breaks etc.
 */
export default {
	argument: null,
	attribute: null,
	comment: null,
	function: function(string, node) {
		let ranges = [];
		const regex = /(?<!\w)\bfunction\s+([^\s(]+)|^\s+(?:(?!do|while|for)\b)([^\s(]+)\s*\(/gm;
		const matches = string.matchAll(regex);
		for (const item of matches) {
			if (!item[0]) continue;
			const word = item.flat().filter(value => value && value.trim()).pop();
			const re = new RegExp(`\\b${word}\\b`);
			const start = item.index + item[0].search(re);
			const range = new Range();
			range.setStart(node, start);
			range.setEnd(node, start + word.length);
			ranges.push(range);
		}
		return ranges;
	},
	keyword: ['some','key', 'words'],
	number: /\b\d+\b/g,
	operator: null,
	string: null,
	tag: null,
}
