/**
 * HTML syntax definition file for wijit-code web component
 *
 *  @author Holmes Bryant <https://github.com/HolmesBryant>
 *  @license GPL-3.0
 */
export default {
	argument: /(?<=\()[^)]+/g,
	function: /[\w-]+\s*\(|\)/g,
	property: /(?<!}[\r\n\s]+)\b([\w\d-]+:)/g,
	number: /(?<!\w)[#+-.]?\d+[%\b\.\w]*/g,
	operator: /=/g,
	tag: /<\/?[\w-]+|(?<=[\w"])>/g,
	string: /["'`][^"'`]*["'`]/g,
	variable: /--[\w\d]+/g,
	comment: /(<!--|\/\*)([\s\S]*?)(-->|\*\/)/g,
	keyword: /@[\w]+\b/g
}

