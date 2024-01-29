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
	comment: /\#\!.*|\/\/.*|\/\*(?!\*\/)[\s\S]+?\*\//gm,
	decorator:  /\b@\w+(?:\([^)]*\))?\b/g,
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
	number: /[+-]?\d+[\^\b\.\w]*/g,
	operator: /\+|-|(?<!(\/|\/\*{1,}|\n\s*))\*(?!\/)|(?<![\/\*])\/(?![\/\*])|%|===|!==|>=|<=|>|<|!=|=|&&|\|\||(?<!#)!/g,
	string: /["'`][^"'`]*["'`]/g,
	tag: null,
	keyword: [
		// Interfaces
		// https://html.spec.whatwg.org/dev/indices.html#all-interfaces'
		'AudioTrack',
		'AudioTrackList',
		'BarProp',
		'BeforeUnloadEvent',
		'BroadcastChannel',
		'CanvasGradient',
		'CanvasPattern',
		'CanvasRenderingContext2D',
		'CloseWatcher',
		'CustomElementRegistry',
		'CustomStateSet',
		'DOMParser',
		'DOMStringList',
		'DOMStringMap',
		'DataTransfer',
		'DataTransferItem',
		'DataTransferItemList',
		'DedicatedWorkerGlobalScope',
		'DragEvent',
		'Element',
		'ElementInternals',
		'ErrorEvent',
		'EventSource',
		'External',
		'FormDataEvent',
		'HTMLAllCollection',
		'HTMLAnchorElement',
		'HTMLAreaElement',
		'HTMLAudioElement',
		'HTMLBRElement',
		'HTMLBaseElement',
		'HTMLBodyElement',
		'HTMLButtonElement',
		'HTMLCanvasElement',
		'HTMLDListElement',
		'HTMLDataElement',
		'HTMLDataListElement',
		'HTMLDetailsElement',
		'HTMLDialogElement',
		'HTMLDirectoryElement',
		'HTMLDivElement',
		'HTMLElement',
		'HTMLEmbedElement',
		'HTMLFieldSetElement',
		'HTMLFontElement',
		'HTMLFormControlsCollection',
		'HTMLFormElement',
		'HTMLFrameElement',
		'HTMLFrameSetElement',
		'HTMLHRElement',
		'HTMLHeadElement',
		'HTMLHeadingElement',
		'HTMLHtmlElement',
		'HTMLIFrameElement',
		'HTMLImageElement',
		'HTMLInputElement',
		'HTMLLIElement',
		'HTMLLabelElement',
		'HTMLLegendElement',
		'HTMLLinkElement',
		'HTMLMapElement',
		'HTMLMarqueeElement',
		'HTMLMediaElement',
		'HTMLMenuElement',
		'HTMLMetaElement',
		'HTMLMeterElement',
		'HTMLModElement',
		'HTMLOListElement',
		'HTMLObjectElement',
		'HTMLOptGroupElement',
		'HTMLOptionElement',
		'HTMLOptionsCollection',
		'HTMLOutputElement',
		'HTMLParagraphElement',
		'HTMLParamElement',
		'HTMLPictureElement',
		'HTMLPreElement',
		'HTMLProgressElement',
		'HTMLQuoteElement',
		'HTMLScriptElement',
		'HTMLSelectElement',
		'HTMLSlotElement',
		'HTMLSourceElement',
		'HTMLSpanElement',
		'HTMLStyleElement',
		'HTMLTableCaptionElement',
		'HTMLTableCellElement',
		'HTMLTableColElement',
		'HTMLTableElement',
		'HTMLTableRowElement',
		'HTMLTableSectionElement',
		'HTMLTemplateElement',
		'HTMLTextAreaElement',
		'HTMLTimeElement',
		'HTMLTitleElement',
		'HTMLTrackElement',
		'HTMLUListElement',
		'HTMLUnknownElement',
		'HTMLVideoElement',
		'HashChangeEvent',
		'History',
		'history',
		'ImageBitmap',
		'ImageBitmapRenderingContext',
		'ImageData',
		'Location',
		'location',
		'MediaError',
		'MessageChannel',
		'MessageEvent',
		'MessagePort',
		'MimeType',
		'MimeTypeArray',
		'NavigateEvent',
		'Navigation',
		'NavigationActivation',
		'NavigationCurrentEntryChangeEvent',
		'NavigationDestination',
		'NavigationHistoryEntry',
		'NavigationTransition',
		'Navigator',
		'navigator',
		'OffscreenCanvas',
		'OffscreenCanvasRenderingContext2D',
		'PageRevealEvent',
		'PageTransitionEvent',
		'Path2D',
		'Plugin',
		'PluginArray',
		'PopStateEvent',
		'PromiseRejectionEvent',
		'RadioNodeList',
		'ShadowRoot',
		'SharedWorker',
		'SharedWorkerGlobalScope',
		'Storage',
		'StorageEvent',
		'SVGImageElement',
		'SubmitEvent',
		'TextMetrics',
		'TextTrack',
		'TextTrackCue',
		'TextTrackCueList',
		'TextTrackList',
		'TimeRanges',
		'ToggleEvent',
		'TrackEvent',
		'UserActivation',
		'ValidityState',
		'VideoTrack',
		'VideoTrackList',
		'VisibilityStateEntry',
		'Window',
		'window',
		'Worker',
		'WorkerGlobalScope',
		'WorkerLocation',
		'WorkerNavigator',
		'Worklet',
		'WorkletGlobalScope',

		// DOM Objects
		'Attr',
		'CharacterData',
		'Comment',
		'CSSStyleDeclaration',
		'classList',
		'CustomEvent',
		'Document',
		'DOMPoint',
		'DOMRect',
		'DOMRectList',
		'Element',
		'Event',
		'HTMLCollection',
		'HTMLElement',
		'KeyboardEvent',
		'MouseEvent',
		'NamedNodeMap',
		'Node',
		'NodeIterator',
		'NodeList',
		'NodeList',
		'Text',
		'TreeWalker',
		'UIEvent',

		// DOM Methods
		'appendChild',
		'getBoundingClientRect',
		'.closest',
		'cloneNode',
		'createTextNode',
		'dispatchEvent',
		'getElementsByClassName',
		'getElementsByTagName',
		'getElementById',
		'getAttribute',
		'getBoundingClientRect',
		'getComputedStyle',
		'hasAttribute',
		'hasChildNodes',
		'importNode',
		'insertBefore',
		'isConnected',
		'matches',
		'normalize',
		'offsetLeft',
		'offsetTop',
		'querySelector',
		'querySelectorAll',
		'removeAttribute',
		'removeChild',
		'replaceChild',
		'scrollIntoView',
		'scrollTo',
		'setAttribute',
		'addEventListener',
		'removeEventListener',

		// DOM Properties
		'.attributes',
		'.childNodes',
		'.firstChild',
		'.id',
		'.innerHTML',
		'.lastChild',
		'.nextSibling',
		'.nodeName',
		'.nodeType',
		'.nodeValue',
		'.ownerDocument',
		'.parentElement',
		'.parentNode',
		'.previousSibling',
		'.style',
		'.textContent',
		'.className',
		'.dataset',
		'.elements',
		'.innerText',
		'.innerHTML',
		'.outerHTML',
		'.tagName',

		// ecma keywords
		'as',
		'break',
		'break',
		'case',
		'catch',
		'class',
		'const',
		'continue',
		'constructor',
		'debugger',
		'default',
		'delete',
		'do',
		'else',
		'enum',
		'export',
		'extends',
		'false',
		'finally',
		'for',
		'function',
		'global',
		'if',
		'implements',
		'import',
		'in',
		'instanceof',
		'interface',
		'let',
		'new',
		'null',
		'null',
		'of',
		'package',
		'private',
		'protected',
		'public',
		'return',
		'static',
		'super',
		'switch',
		'this',
		'throw',
		'true',
		'try',
		'typeof',
		'var',
		'void',
		'while',
		'with',
		'yield',

		// ecma Objects
		'Array',
		'ArrayBuffer',
		'AsyncFunction',
		'Atomics',
		'BigInt',
		'BigInt64Array',
		'BigUint64Array',
		'Boolean',
		'crypto',
		'DataView',
		'Date',
		'Error',
		'EvalError',
		'Float32Array',
		'Float64Array',
		'Function',
		'Generator',
		'GeneratorFunction',
		'globalThis',
		'Highlight',
		'Int16Array',
		'Int32Array',
		'Int8Array',
		'InternalError',
		'Intl',
		'JSON',
		'localStorage',
		'Map',
		'Math',
		'Navigator',
		'navigator',
		'Number',
		'Object',
		'Promise',
		'Proxy',
		'RangeError',
		'ReferenceError',
		'Reflect',
		'RegExp',
		'sessionStorage',
		'Set',
		'SharedArrayBuffer',
		'String',
		'Symbol',
		'SyntaxError',
		'TypeError',
		'Uint16Array',
		'Uint32Array',
		'Uint8Array',
		'Uint8Array',
		'Uint8ClampedArray',
		'URIError',
		'WeakMap',
		'WeakSet',
		'WebAssembly',

		// Globals
		'arguments',
		'console',
		"crypto",
		'document',
		'global',
		"globalThis",
		'history',
		'localStorage',
		'location',
		'module',
		'sessionStorage',
		'super',
		'this',
		'window',
	],
}
