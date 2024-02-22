/**
 * @class WijitCode
 * @extends HTMLElement
 * @description A custom element for displaying code snippets with consistent formatting and optional highlighting.
 * @author Holmes Bryant <webbmaastaa@gmail.com>
 * @license GPL-3.0
 *
 *
 * @example
 * <wijit-code>
 *   function () {
 *   	return "This is some code";
 *   }
 * </wijit-code>
 */

export default class WijitCode extends HTMLElement {

	/**
	 * @private
	 * @type AbortController
	 * @description Used to remove event listeners when element is disconnected.
	 */
	#abortController = new AbortController();

	#editorAbortController = new AbortController();

	/**
	 * @private
	 * @type boolean
	 * @description Whether to make the content editable.
	 * @comment Has public getter (edit)
	 */
	#edit = false;

	/**
	 * @private
	 * @type boolean | string
	 * @description If this is a string, either the name of the syntax to use for highlighting OR the importable url to the syntax file.
	 *              The syntax file should be named "syntax.[name].js".
	 *              For example, for HTML, this value would be either:
	 *              "html", with the syntax file "syntax.html.js" in the same dir as wijit-code.js,
	 *              OR "./path/to/syntax.html.js", with the syntax file located at that path.
	 * @comment Has public getter (highlight)
	 */
	#highlight = false;

	/**
	 * @private
	 * @type Highlighter
	 * @description An instance of the Highlighter class
	 */
	#highlighter;

	/**
	 * @private
	 * @type boolean
	 * @description Whether to display the code inline.
	 * @comment Has public getter (inline)
	 */
	#inline = false;

	/**
	 * @private
	 * @type number | string
	 * @description The number of spaces to represent a tab character. Can use most css length values.
	 * @comment Has public getter (indent)
	 */
	#indent = 4;

	/**
	 * @private
	 * @type Number (milliseconds)
	 * @description The last time a mutation event occurred.
	 */
	#lastMutationTime = 0;

	/**
	 * @private
	 * @type boolean
	 * @description Tracks if a content update is needed.
	 */
	#needsUpdate = false;

	/**
	 * @static
	 * @type string[]
	 * @description A list of attributes to observe for changes.
	 */
	static observedAttributes = ['edit', 'highlight', 'inline', 'indent', 'palette'];

	/**
	 * @constructor
	 * @description Creates a new WijitCode instance and sets up its shadow DOM.
	 */
	constructor() {
		super();
		// this.contentNode = this;
		this.attachShadow({mode:'open'});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					--indent: ${this.indent};
					display: inline-block;
					overflow-x: auto;
					vertical-align: middle;
				}

				div {
					position: relative;
					font-family: "Courier New", monospace;
				}

				pre
				{
					font-family: "Courier New", monospace;
					margin: 0;
					tab-size: var(--indent);
				}

				textarea {
					all: inherit;
					bottom: 0;
					caret-color: white;
					color: transparent;
					display: block;
					height: 100%;
					overflow-y: hidden;
					position: absolute;
					tab-size: var(--indent);
					top: 0;
					width: 100%;
				}

				textarea:focus {
					outline: 2px dashed silver;
				}

				.hidden {
					display: none;
				}

				.inline {
					display: inline;
					margin: 0;
					white-space: nowrap;
				}
			</style>

			<div>
				<pre><slot></slot></pre>
				<textarea class="hidden" spellcheck="false"></textarea>
			</div>
		`;
	}

	/**
	 * Called when the element is inserted into the DOM.
	 * @remarks Perform initial setup and establish event listeners after the element is connected.
	 */
	connectedCallback() {
		const slot = this.shadowRoot.querySelector ('slot');
		this.contentNode = this.shadowRoot.querySelector ('pre');
		this.textContent = this.resetSpaces(this.getContent());
		if (this.highlight) this.highlightCode ();

		slot.addEventListener('slotchange', () => {
			this.updateIfNeeded();
	    }, { signal:this.#abortController.signal });
	}

	/**
	 * Called when attributes change.
	 */
	attributeChangedCallback (attr, oldval, newval) {
		this[attr] = newval;
	}

	/**
	 * Called when the element is removed from the DOM. Cleans up resources and removes event listeners.
	 */
	disconnectedCallback () {
		this.#abortController.abort();
	}

	/**
	 * Updates the text content of the element if slot changes have occurred.
	 * @param {number} [delay] The time delay within which to ignore changes.
	 * @remarks If a previous slot change indicated a content update was needed, perform the update
	 *			If a slot change just occurred, set a flag to indicate an update
     *              is needed on the next call to this method. This helps prevent
     *              redundant updates during rapid slot changes.
	 */
	updateIfNeeded(delay = 500, elem = this) {
		const currentTime = Date.now();
		if (this.#needsUpdate) {
			if (currentTime - this.#lastMutationTime > delay) {
			    this.#lastMutationTime = currentTime;
				this.textContent = this.resetSpaces(this.getContent(elem));
				if (this.highlighter) this.destroyHighlights();
				if (this.highlight) this.highlightCode();
			}
		} else {
			this.#needsUpdate = true;
		}
	}

	/**
	 * Highlights code using a specified syntax and applies it to an element.
	 *
	 * @param 	{string} 		syntax 	- The syntax to use for highlighting.
	 * @param 	{HTMLElement}	element - The element to highlight.
	 * @returns {Highlighter}			- Instance of Highlighter object.
	 * @throws 	{Error}					- Throws Error if highlighter.highlight() fails.
	 *
	 * @test self.highlightCode('html', self) // true
	 */
	async highlightCode (syntax = this.highlight, element = this) {
		this.highlighter = this.highlighter || new Highlighter(element);
		try {
	    	return await this.highlighter.highlight(syntax, element.childNodes[0])
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Destroys all current highlights.
	 * @returns {string} The suffix used to identify the highlights used by this instance in the CSS HighlightRegistry
	 * @test self.destroyHighlights() // self.highlighter.suffix;
	 */
	destroyHighlights () {
		try {
			return this.highlighter.removeAll();
		} catch (error) {
			console.error (error);
		}
	}

	/**
	 * Normalizes indentation in code blocks by converting leading spaces to tabs.
	 *
	 * @param {HTMLElement} container - The element containing the code to be formatted.
	 * @returns {string} The formatted code with normalized indentation.
	 * @remarks Ensures consistent spacing within the code block, regardless
	 *          of how the code was originally indented. It also removes any common
	 *          leading whitespace from all lines to create a visually cleaner block.
	 *          - Reset the flag indicating a slot change needs an update.
	 *          - Replace leading spaces with tabs, trim extra whitespace, and split the content into lines.
	 *          - Determine the number of leading whitespaces in the last line.
	 *          - Create a regular expression to match the leading whitespace.
	 *          - Remove the leading whitespace from each line and return the formatted code as a string.
	 * @test self.resetSpaces('\t\t\tfoo\t\t\t') // 'foo'
	 */
	resetSpaces (string) {
		this.needsUpdate = false;
		string = string
			.replace(/^ +/gm, (spaces) => '\t'.repeat(spaces.length) )
			.trim();

		const lines = string.split("\n");
		const spaces = lines.at(-1).match(/^\s*/)[0].length;
		const regex = new RegExp(`^\\s{${spaces}}`, "g");
		return lines.map (line => line.replace(regex, '')).join("\n");
	}

	/**
	 * Retrieves the content from the given element.
	 * If no element is provided, it retrieves the content from `this` element.
	 *
	 * @param 	{HTMLElement} [elem] 	- The element from which to retrieve the content.
	 * @returns {string} 				- The content of the element.
	 *
	 * @test self.getContent (self) // ""
	 */
	getContent (elem = this) {
		if (elem.localName === 'textarea') return elem.value;
		const ta = elem.querySelector ('textarea');
		const content = (ta) ? ta.value : this.convertHTML(elem.innerHTML);
		if (ta) ta.remove();
		return content;
	}

	/**
	 * Converts any string that would be rendered in the browser into plain text.
	 *
	 * @param 	{string} html 	Any string
	 * @returns {string} 		The html converted into plain text that will not be rendered.
	 * @test self.convertHTML('<script>alert("foo")</script>') // '\x3Cscript>alert("foo")\x3C/script>'
	 */
	convertHTML(html) {
		const elem = document.createElement('textarea');
		elem.innerHTML = html;
		return elem.value;
	}

	/**
	 * Enables editing.
	 */
	enableEdit () {
		const ta = this.shadowRoot.querySelector('textarea');
		ta.classList.remove('hidden');
		ta.value = this.textContent;
		this.interceptKeyPress (ta);
		ta.addEventListener ('input', (event) => {
			this.updateIfNeeded(500, event.target)
		}, { signal:this.#editorAbortController.signal });
	}

	/**
	 * Disables editing.
	 */
	disableEdit () {
		const ta = this.shadowRoot.querySelector('textarea');
		ta.classList.add('hidden');
		this.editorAbortController.abort();
	}

	interceptKeyPress (element) {
		element.addEventListener ('keydown', event => {
			switch (event.key) {
			case 'Tab':
				event.preventDefault();
			    const ta = event.target;
				const start = ta.selectionStart;
				const end = ta.selectionEnd;
				const before = ta.value.substring(0, start);
				const after = ta.value.substring(end);
				ta.value = before + "\t" + after;
				ta.selectionStart = ta.selectionEnd = start + 1;
				const inputEvent = new Event ('input');
				ta.dispatchEvent(inputEvent);
			    break;
			}

		}, { signal: this.#editorAbortController.signal });
	}

	/**
	 * Gets the value of the inline property
	 *
	 * @returns {boolean} The value of the inline property.
	 *
	 * @test typeof self.inline === 'boolean'  // true
	 */
	get inline () { return this.#inline; }

	/**
	 * Sets whether the code block should be displayed inline or as a block element.
	 *
	 * @param {boolean | string} value - The new value for the inline property.
	 * @remarks Handle different input values for the inline property:
	 *          - Empty string, 'true', or true: Set to true and apply inline styling.
	 *          - Any other value: Set to false and remove inline styling.
	 *
	 * @test (self => {self.inline = 'false'; return self.inline})(self) // false
	 */
	set inline (value) {
		const node = this.shadowRoot.querySelector('pre');
		switch (value) {
		case 'false':
		case false:
			value = false;
			this.removeAttribute('inline');
			if (node) node.classList.remove('inline');
			break;
		default:
			value = true;
			if (node) node.classList.add('inline');
			break;
		}

		this.#inline = value;
	}

	/**
	 * Gets the value of the indent property
	 *
	 * @returns {string | number} The value of the indent property.
	 * @test (typeof self.indent === 'string' || typeof self.indent === 'number') // true
	 */
	get indent () { return this.#indent; }

	/**
	 * Sets the tab size for the code block, affecting its indentation.
	 *
	 * @param {string | number} value - The width of a tab character. Can take numbers or most css length measurements.
	 *
	 * @test (self => {self.indent = '2rem'; return self.indent})(self) // '2rem'
	 * @test (self => {self.setAttribute('indent', '5'); return self.indent})(self) // '5'
	 */
	set indent (value) {
		this.style.setProperty('--indent', value);
		this.#indent = value;
	}

	/**
	 * Gets the value of the this#highlight property.
	 *
	 * @returns {string}
	 */
	get highlight () { return this.#highlight; }

	/**
	 * Sets the value of this#highlight property
	 *
	 * @param  {string} value Either a keyword, a url or a file path pointing to a syntax file.
	 */
    set highlight (value) {
    	switch (value) {
    	case 'false':
    	case false:
    		value = false;
    		break;
    	}
    	this.#highlight = value;
    	if (this.contentNode) this.updateIfNeeded();
    }

    /**
     * Gets the this.#edit property
     *
     * @returns {string}
     */
    get edit () { return this.#edit; }

    /**
     * Sets the value of this.#edit and enables editing of content
     *
     * @param  {string} value Whether to enable editing.
     *                        Empty string or "true" enables editing.
     *                        Any other string disables editing.
     */
    set edit (value) {
    	switch (value) {
    	case 'false':
    	case false:
    		this.#edit = false;
    		if (this.contentNode) this.disableEdit();
    		break;
    	default:
    		this.#edit = true;
    		if (this.contentNode) {
	    		this.enableEdit();
    		} else {
    			customElements.whenDefined (this.localName)
    			.then (cls => {
    				this.enableEdit();
    			})
    		}
    		break;
    	}
    }

    /**
     * Gets the custom color palette, if there is one.
     *
     * @returns {Map | false} The custom highlighter palette
     */
    get palette () {
    	if (this.highlighter) return this.highlighter.palette;
    	return false;
    }

   	/**
   	 * Set custom color palette for code highlighting.
   	 *
   	 * @param  {String|Array|Map} value The new palette definitions.
   	 *                                  Array must be a two dimensional array where each entry is a key => value pair.
   	 *                                  String must be JSON string representing a two dimensional Array.
   	 * @return {void}
   	 */
    set palette (value) {
    	if (this.highlighter) {
    		this.highlighter.palette = value;
    	} else {
    		console.error ('highlighter has not been initialized')
    	}
    }
}

/**
 * @class Highlighter
 * @summary Uses CSS Custom Highlight API to highlight ranges of text in different colors.
 * @author Holmes Bryant <webbmaastaa@gmail.com>
 * @license GPL-3.0
 */
export class Highlighter {
	#palette;
	container;
	suffix = '_' + Math.random().toString(36).substring(2, 15);
	defaultColors = new Map ([
		['argument', 'hsl(32, 93%, 66%)'],
		['comment', 'hsl(221, 12%, 69%)'],
		['function', 'hsl(210, 50%, 60%)'],
		['keyword', 'hsl(300, 30%, 68%)'],
		['number', 'hsl(32, 93%, 66%)'],
		['operator', 'hsl(13, 93%, 66%)'],
		['string', 'hsl(114, 31%, 68%)'],
		['tag', 'hsl(300, 30%, 68%)']
	]);

	/**
		* Creates a new instance of the class.
		* @param {HTMLElement} element - The container element for the instance.
		* @param {Palette} palette - The palette object to use.
		* @returns {ClassName} - The new instance of the class.
		*/
	constructor (element, palette) {
		this.container = element;
		this.palette = palette;
		return this;
	}

	/**
	 * Highlights the specified text node using the provided syntax rules.
	 * @param {string} syntax - The syntax to use for highlighting.
	 * @param {Text} [textNode] - The text node to highlight. If not provided, uses the first child node of the container element.
	 * @throws {Error} - If the browser does not support CSS Custom Highlight API.
	 */
	async highlight(syntax, textNode) {
		if (typeof window.Highlight === 'undefined') {
			console.error('Browser does not support CSS Custom Highlight API');
			return false;
		}

		textNode = textNode || this.container.childNodes[0] || document.createTextNode('');

		const styleId = `highlights${this.suffix}`;
		const existingStyle = document.head.querySelector(`#${styleId}`);
		if (!existingStyle) document.head.append(this.getStyle());

		try {
			const defs = await this.getSyntax(syntax);
			this.highlightCode(defs, textNode);
			return true;
		} catch (error) {
			console.error('Error loading Highlight Syntax: ', error);
			throw error;
		}
	}

	/**
	 * Retrieves the syntax object for the specified syntax.
	 * If a string is provided, it attempts to import the syntax module dynamically.
	 * @param {string|Syntax} syntax - The syntax string or syntax object.
	 * @returns {Promise<Syntax>} - A promise that resolves to the syntax object.
	 * @throws {Error} - If there was an error loading the syntax module.
	 */
	async getSyntax (syntax = 'html') {
		if (typeof syntax === 'string') {
	        	let url = syntax;
	        	const regex = /^(http|\.|\/)/;
	        	if (!regex.test (syntax)) url = `./syntax.${syntax}.js`;
			try {
				syntax = await import (url);
			} catch (error) {
				console.error ("Error loading Highlight Syntax: ", error);
				return error;
			}
		}

		return syntax.default;
	}

	/**
	 * Highlights the code within the specified text node using the provided syntax rules.
	 * @param {Object} [syntax={}] - The syntax rules for highlighting.
	 * @param {Text} textNode - The text node containing the code to be highlighted.
	 * @returns {Set<Range>} - A set of Range objects representing the highlighted code ranges.
	 * @throws {Error} - If the second argument is not a TEXT_NODE.
	 */
	highlightCode (syntax = {}, textNode) {
        if (textNode.nodeType !== Node.TEXT_NODE) {
        	throw new Error(`Second argument must be a TEXT_NODE (3). Given nodeType is (${textNode.nodeType})`);
        }

        let ranges;
        const string = textNode.textContent;

        for (const prop of Object.keys (syntax)) {
            const value = syntax[prop];

            if (!value) {
            	continue;
            } else if (Array.isArray (value)) {
            	// Array of key words
            	// Set() removes duplicate words
            	const words = [...new Set (value)].join('|');
            	const regex = new RegExp(`\\b(${words})\\b`, 'g');
            	ranges = this.setRanges(regex, string, textNode);
            } else if (value instanceof Function) {
            	// function returning flat array of range objects
                ranges = new Set (value(string, textNode));
            } else if (value instanceof RegExp) {
                // regular expression
                ranges = this.setRanges (value, string, textNode);
            } else {
                console.error (`Invalid syntax definition for ${prop}: `, `"${value}"`);
            }

            this.setHighlight(ranges, prop);
        }

        return true;
    }

    /**
	 * Sets ranges based on the provided regular expression and string within the specified node.
	 * @param {RegExp} regex - The regular expression to match against the string.
	 * @param {string} string - The string to search for matches.
	 * @param {Node} node - The node within which the ranges will be set.
	 * @returns {Set<Range>} - A set of Range objects representing the matched ranges.
	 */
    setRanges (regex, string, node) {
        const ranges = new Set();
        const matches = string.matchAll(regex);

        for (const match of matches) {
            const start = match.index;
            const end = start + match[0].length;
            const range = new Range();
            range.setStart (node, start);
            range.setEnd (node, end);
            ranges.add (range);
        }

        return ranges;
    }

    /**
	 * Retrieves the CSS highlights associated with the current suffix.
	 * @returns {Map<string, object>} - A map containing the CSS highlights entries.
	 */
    getHighlights () {
    	const entries = new Map ();
    	CSS.highlights.forEach ((highlight, name) => {
    		if (name.endsWith(this.suffix)) {
    			entries.set (name, highlight);
    		}
    	})
    	return entries;
    }

    /**
	 * Sets highlights for the specified ranges using the provided type.
	 * @param {Array<Range>} ranges - An array of Range objects representing the ranges to apply highlights to.
	 * @param {string} [type='test'] - The type of highlights to apply. Defaults to 'test'.
	 * @returns {Highlight} - The created Highlight object representing the applied highlights.
	 */
    setHighlight (ranges, type = 'test') {
    	// Add this.suffix to isolate entries in the CSS Highlights Registry
    	// Otherwise, highlights between instances interfere with each other
    	type = type + this.suffix;
        const highlighter = new Highlight(...ranges);
        try {
	        CSS.highlights.set (type, highlighter);
        	return true;
        } catch (error) {
        	console.error (error);
        	throw error;
        }
    }

    /**
	 * Creates and returns a style element containing the CSS styles for highlights.
	 * @returns {HTMLStyleElement} - The created style element.
	 */
    getStyle () {
    	const style = document.createElement('style');
    	let content = '';

    	style.id = `highlights${this.suffix}`;
    	this.palette.forEach ((color, key) => {
    		content += `::highlight(${key}${this.suffix}) { color: ${color}}\n`;
    	});

    	style.textContent = content;
    	return style;
    }

    /**
	 * Removes the highlights associated with the specified type.
	 * @param {string} type - The type of highlights to remove.
	 */
    remove(type) {
    	CSS.highlights.delete(type + this.suffix);
    }

    /**
	 * Removes all highlights associated with the current suffix.
	 * @returns {string} The suffix used to identify highlights on an instance
	 */
    removeAll () {
    	CSS.highlights.forEach ((highlight, name) => {
    		if (name.endsWith(this.suffix)) {
    			CSS.highlights.delete (name);
    		}
    	});

    	return this.suffix;
    }

    /**
	 * Clears the CSS highlights registry.
	 */
    clearRegistry() {
    	CSS.highlights.clear();
    }

    /**
	 * Logs the entries in the CSS highlights registry to the console.
	 */
    logRegistry () {
    	CSS.highlights.forEach ((highlight, name) => {
    		console.log (name, highlight);
    	})
    }

    /**
	 * Gets the palette of colors for highlights.
	 * @returns {Array<string>} - The palette of colors.
	 */
    get palette () { return this.#palette || this.defaultColors;}
    set palette (value) {
    	let map;
    	const style = document.head.querySelector(`#highlights${this.suffix}`);

    	if (!value || value === '' || value === undefined) {
    		this.#palette = null;
    	} else if (Array.isArray (value)) {
    		map = new Map(value);
    	} else if (value instanceof Map) {
    		map = value;
    	} else {
    		try {
    			value = JSON.parse(value);
    			map = new Map (value);
    		} catch (error) {
	    		console.error(error);
    		}
    	}

    	this.#palette = map;
    	const newStyle = this.getStyle();
    	if (!style) {
    		document.head.append (newStyle);
    	} else {
    		document.head.replaceChild(newStyle, style);
    	}
    }
}

document.addEventListener('DOMContentLoaded', customElements.define('wijit-code', WijitCode));
