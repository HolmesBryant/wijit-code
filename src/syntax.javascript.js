export default {
	argument: function(string, node) {
		const ranges = [];
		const regex = /\(\s*[\w]+(?:\s*,\s*([\w]+))*\s*\)/g
		const matches = string.matchAll(regex);

		for (const match of matches) {
			let thisStart, range;
			const startIdx = match.index;
			const items = match[0].split(',').map (item => item.replace(/[()]/g, '').trim());
			for (const item of items) {
				// avoid partial matches which indexOf would trip on
				const re = new RegExp('\\b' + item + '\\b');
				thisStart = startIdx + match[0].search(re);
				range = new Range();
				range.setStart (node, thisStart);
				range.setEnd (node, thisStart + item.length);
				ranges.push(range);
			}
		}
		return ranges;
	},
	attribute: null,
	comment: /(?:\#\!.*|\/\/.*|\/\*[\s\S]*?\*\/)/g,
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
	keyword: [
	    // DOM
	    'Attr', 'CDATASection', 'CharacterData', 'Comment', 'DOMImplementation', 'Document', 'DocumentFragment',
	    'DocumentType', 'Element', 'EntityReference', 'Event', 'EventTarget', 'HTMLCollection', 'NamedNodeMap',
	    'Node', 'NodeList', 'ProcessingInstruction', 'Text', 'TreeWalker', 'appendChild', 'class', 'classList',
	    'className', 'closest', 'constructor', 'contains', 'firstChild', 'getElementById', 'getElementsByClassName',
	    'getElementsByTagName', 'hasAttribute', 'hasChildNodes', 'id', 'innerHTML', 'innerText', 'insertBefore',
	    'isConnected', 'lastChild', 'nextSibling', 'nodeName', 'nodeType', 'nodeValue', 'ownerDocument',
	    'parentElement', 'parentNode', 'previousSibling', 'querySelector', 'querySelectorAll', 'removeChild',
	    'replaceChild', 'style', 'textContent', 'title', 'value',
	    // javascript keywords
	    "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do",
	    "else", "enum", "export", "extends", "false", "finally", "for", "function",
	    "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "of",
	    "package", "private", "protected", "public", "return", "static", "super", "switch",
	    "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "yield",
	    // Objects
	    "Array", "ArrayBuffer", "Boolean", "DataView", "Date", "Error", "Function", "Highlight", "Intl", "Math", "Number",
	    "Object", "Proxy", "RegExp", "String", "Symbol", "Map", "Set", "WeakMap", "WeakSet", "Promise",
	    "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array",
	    "Float32Array", "Float64Array", "JSON", "Reflect", "Atomics", "Intl", "document", "window", "navigator",
	    "localStorage", "sessionStorage", "globalThis", "console", "process", "crypto", "timers", "Reflect",
	    // Events
	    'abort', 'afterprint', 'animationcancel', 'animationend', 'animationiteration', 'animationstart',
	    'beforeprint', 'beforeunload', 'blur',
	    'canplay', 'canplaythrough', 'change', 'click', 'compositionend', 'compositionstart',
	    'compositionupdate', 'contextmenu', 'copy', 'cuechange', 'cut',
	    'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange',
	    'emptied', 'ended', 'error',
	    'focus', 'focusin', 'focusout', 'formdata',
	    'gotpointercapture', 'hashchange', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'load',
	    'loadeddata', 'loadedmetadata', 'loadstart', 'lostpointercapture',
	    'message', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel',
	    'offline', 'online',
	    'pagehide', 'pageshow', 'paste', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter',
	    'pointerleave', 'pointermove', 'pointerout', 'pointerover', 'pointerup', 'popstate', 'progress',
	    'ratechange', 'readystatechange', 'reset', 'resize',
	    'scroll', 'seeked', 'seeking', 'select', 'show', 'stalled', 'storage', 'submit', 'suspend',
	    'timeupdate', 'toggle', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'transitionend',
	    'unload', 'volumechange', 'waiting', 'wheel'
	],
	number: /\b\d+\w*\b/g,
	operator: /\+|-|(?<!\/)\*(?!\/)|(?<![\/\*])\/(?![\/\*])|%|===|!==|>=|<=|>|<|!=|=|&&|\|\||(?<!#)!/g,
	string: /['"`][^'"`"]*['"`]/g,
	tag: null
}
