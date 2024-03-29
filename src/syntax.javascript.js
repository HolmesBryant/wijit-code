/**
 * Javascript syntax definition file for wijit-code web component
 *
 *  @author Holmes Bryant <https://github.com/HolmesBryant>
 *  @license GPL-3.0
 */
export default {
	argument: function(string, node) {
		const ranges = [];
		const regex = /\(\s*[\w]+(?:\s*,\s*([\w]+))*\s*\)/g
		const matches = string.matchAll(regex);

		for (const match of matches) {
			const idx = match.index;
			const items = match[0].split(',').map (item => item.replace(/[()]/g, '').trim());
			for (const item of items) {
				// avoid partial matches which indexOf would trip on
				const re = new RegExp('\\b' + item + '\\b');
				const start = idx + match[0].search(re);
				const range = new Range();
				range.setStart (node, start);
				range.setEnd (node, start + item.length);
				ranges.push(range);
			}
		}
		return ranges;
	},
	operator: /\+|-|(?<!(\/|\/\*{1,}|\n\s*))\*(?!\/)|(?<![\/\*])\/(?![\/\*])|%|===|!==|>=|<=|>|<|!=|=|&&|\|\||(?<!#)!/g,
	number: /[+-]?\d+[\^\b\.\w]*/g,
	string: /['"][^'"\n]*['"]|`[^`]*`/g,
	variable: /\$\s*{[^}]+}/g,
	function: /(?<=\(|\b)\w+\s*\(|\(|\)/g,
	tag: /<\/?[\w-]+|(?<=[\w"])>/g,
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
		'external',
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
		'navigation',
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
	comment: /\#\!.*|\/\/.*|\/\*(?!\*\/)[\s\S]+?\*\//gm,
}
