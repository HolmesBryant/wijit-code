/**
 * @class WijitCode
 * @extends HTMLElement
 * @description A custom element for displaying code snippets with consistent formatting and entity encoding.
 * @author Holmes Bryant <webbmaastaa@gmail.com>
 * @license GPL-3.0
 *
 * In Firefox about:config set dom.customHighlightAPI.enabled to true
 *
 * @example
 * <wijit-code>
 *   <div>This is some HTML</div>
 *   function () {
 *   	return "This is some code";
 *   }
 * </wijit-code>
 */
export class WijitCode extends HTMLElement {
	/**
	 * @private
	 * @type AbortController
	 * @description Used to remove event listeners when element is disconnected.
	 */
	#abortController = new AbortController();

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
	#indent = 2;

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
	 * @private
	 * @type MutationObserver
	 * @description Used to manage mutation events.
	 */
	mutationObserver;

	/**
	 * @static
	 * @type string[]
	 * @description A list of attributes to observe for changes.
	 */
	static observedAttributes = ['edit', 'highlight', 'inline', 'indent'];

	/**
	 * @constructor
	 * @description Creates a new WijitCode instance and sets up its shadow DOM.
	 */
	constructor() {
		super();
		this.attachShadow({mode:'open'});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					--indent: ${this.indent};
					display: inline-block;
					overflow-x: auto;
					vertical-align: middle;
				}

				pre
				{
					tab-size: var(--indent);
					white-space: pre-wrap;
				}

				.inline {
					display: inline;
					margin: 0;
					white-space: nowrap;
				}
			</style>

			<pre spellcheck="false"><slot></slot></pre>
		`;
	}

	/**
	 * @method connectedCallback
	 * @description Called when the element is inserted into the DOM.
	 * @remarks Perform initial setup and establish event listeners after the element is connected.
	 */
	connectedCallback() {
		// if (!this.hasAttribute('test')) return;
		const container = this.shadowRoot.querySelector('pre');
		const slot = this.shadowRoot.querySelector ('slot');
		this.contentNode = this.shadowRoot.querySelector ('pre');
		this.textContent = this.resetSpaces(this.getContent());
		if (this.highlight) this.highlightCode ();

		slot.addEventListener('slotchange', () => {
			this.updateIfNeeded();
	    }, this.#abortController.signal);
	}

	/**
	 * @method attributeChangedCallback
	 * @description Called when attributes change.
	 */
	attributeChangedCallback (attr, oldval, newval) {
		this[attr] = newval;
	}

	/**
	 * @method disconnectedCallback
	 * @description Called when the element is removed from the DOM.
	 * @remarks Clean up resources and remove event listeners.
	 */
	disconnectedCallback () {
		this.#abortController.abort();
		this.observer.disconnect();
	}

	/**
	 * @method updateContentIfNeeded
	 * @description Updates the text content of the element if slot changes have occurred.
	 * @remarks If a previous slot change indicated a content update was needed, perform the update
	 *			If a slot change just occurred, set a flag to indicate an update
     *              is needed on the next call to this method. This helps prevent
     *              redundant updates during rapid slot changes.
	 */
	updateIfNeeded(delay = 500) {
		const currentTime = Date.now();
		if (this.#needsUpdate) {
			if (currentTime - this.#lastMutationTime > delay) {
			    this.#lastMutationTime = currentTime;
				this.textContent = this.resetSpaces(this.getContent());
				if (this.highlighter) this.destroyHighlights();
					if (this.highlight) this.highlightCode();
			}
		} else {
			this.#needsUpdate = true;
		}
	}

	highlightCode (syntax, element) {
		syntax = syntax || this.highlight;
		element = element || this;
		this.highlighter = this.highlighter || new Highlighter(element);
		try {
	    	this.highlighter.highlight(syntax, this.childNodes[0]);
		} catch (error) {
			console.error (error);
		}
	}

	destroyHighlights () {
		try {
			this.highlighter.removeAll();
		} catch (error) {
			console.error (error);
		}
	}

	/**
	 * @method resetSpaces
	 * @param {HTMLElement} container - The element containing the code to be formatted.
	 * @description Normalizes indentation in code blocks by converting leading spaces to tabs.
	 * @remarks Ensures consistent spacing within the code block, regardless
	 *          of how the code was originally indented. It also removes any common
	 *          leading whitespace from all lines to create a visually cleaner block.
	 *          - Reset the flag indicating a slot change needs an update.
	 *          - Replace leading spaces with tabs, trim extra whitespace, and split the content into lines.
	 *          - Determine the number of leading whitespaces in the last line.
	 *          - Create a regular expression to match the leading whitespace.
	 *          - Remove the leading whitespace from each line and return the formatted code as a string.
	 * @returns {string} The formatted code with normalized indentation.
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

	getContent (elem) {
		elem = elem || this;
		const ta = elem.querySelector ('textarea');
		const content = (ta) ? ta.value : this.unencodeHtmlEntities(elem.innerHTML);
		if (ta) ta.remove();
		return content;
	}

	unencodeHtmlEntities(encodedText) {
		const elem = document.createElement('textarea');
		elem.innerHTML = encodedText;
		return elem.value;
	}

	enableEdit (element, delay = 1000) {
		element = element || this.contentNode;
		const config = { childList: true, characterData: true, subtree: true};
		const callback = (mutations) => {
			const currentTime = Date.now();
		    if (currentTime - this.#lastMutationTime > delay) {
		        this.#lastMutationTime = currentTime;
		        this.updateIfNeeded ();
		    }
		}

		if (!this.mutationObserver) this.mutationObserver = new MutationObserver (callback);
		element.setAttribute('contenteditable', 'true');
		this.mutationObserver.observe (element, config);
	}

	disableEdit (element, mutationObserver) {
		element = element || this.contentNode;
		mutationObserver = mutationObserver || this.mutationObserver;
		element.removeAttribute ('contenteditable');
		if (mutationObserver) mutationObserver.disconnect();
	}

	/**
	 * @method get inline
	 * @description Gets the value of the inline property
	 * @returns {boolean | string} The value of the inline property.
	 */
	get inline () { return this.#inline; }

	/**
	 * @method set inline
	 * @param {boolean | string} value - The new value for the inline property.
	 * @description Sets whether the code block should be displayed inline or as a block element.
	 * @remarks Handle different input values for the inline property:
	 *          - Empty string, 'true', or true: Set to true and apply inline styling.
	 *          - Any other value: Set to false and remove inline styling.
	 */
	set inline (value) {
		const node = this.shadowRoot.querySelector('pre');
		switch (value) {
		case '':
		case 'true':
		case true:
			value = true;
			if (node) node.classList.add('inline');
			break;
		default:
			value = false;
			this.removeAttribute('inline');
			if (node) node.classList.remove('inline');
			break;
		}
		this.#inline = value;
	}

	/**
	 * @method get indent
	 * @description Gets the value of the indent property
	 * @returns {string | number} The value of the indent property.
	 */
	get indent () { return this.#indent; }

	/**
	 * @method set indent
	 * @param {string | number} value - The width of a tab character. Can take numbers or most css length measurements.
	 * @description Sets the tab size for the code block, affecting its indentation.
	 */
	set indent (value) {
		this.style.setProperty('--indent', value);
		this.#indent = value;
	}

	get highlight () { return this.#highlight; }
    set highlight (value) {
    	switch (value) {
    	case '':
    	case 'false':
    		value = false;
    		break;
    	}
    	this.#highlight = value;
    	if (this.contentNode) this.updateIfNeeded();
    }

    get edit () { return this.#edit; }
    set edit (value) {
		const elem = this.contentNode || this.shadowRoot.querySelector('pre');
    	switch (value) {
    	case '':
    	case 'true':
    		this.#edit = true;
    		this.enableEdit(elem);
    		break;
    	default:
    		this.#edit = false;
    		this.disableEdit(elem);
    	}
    	console.log(this.#edit)
    }
}

class Highlighter {
	container;
	suffix = '_' + Math.random().toString(36).substring(2, 15);
	colors = new Map ([
		['argument', 'hsl(32, 93%, 66%)'],
		['attribute', 'hsl(300, 30%, 68%)'],
		['comment', 'hsl(221, 12%, 69%)'],
		['function', 'hsl(210, 50%, 60%)'],
		['keyword', 'hsl(300, 30%, 68%)'],
		['number', 'hsl(32, 93%, 66%)'],
		['operator', 'hsl(13, 93%, 66%)'],
		['punctuation', 'hsl(180, 36%, 54%)'],
		['string', 'hsl(114, 31%, 68%)'],
		['tag', 'hsl(357, 79%, 65%)']
	]);

	constructor (element) {
		this.container = element;
		return this;
	}

	highlight (syntax, textNode) {
		if (typeof window.Highlight === undefined) {
    		console.error('Browser does not support CSS Custom Highlight API');
    		return;
    	}

		textNode = textNode || this.container.childNodes[0];

	    // inserting ::highlight styles into a custom element's shadowRoot doesn't seem to work in Firefox
	    // this.element.shadowRoot.prepend (this.getStyle());
	    const style = document.head.querySelector(`#highlights${this.suffix}`);
	    if (!style) document.head.append (this.getStyle());

        this.getSyntax (syntax).then ( response => {
        	const defs = response.default || response;
        	this.highlightCode(defs, textNode);
        });
	}

	async getSyntax (syntax) {
		if (typeof syntax === 'string') {
			try {
	        	const url = syntax.startsWith(("http", ".", "/")) ? syntax : `./syntax.${syntax}.js`;
				syntax = await import (url);
			} catch (error) {
				console.error ("Error loading Highlight Syntax: ", error);
				throw error;
			}
		}

		return syntax;
	}

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
            	const range = [];
                value.forEach (word => {
                    const regex = new RegExp(`\\b${word}\\b`, "g");
                    range.push (this.setRanges(regex, string, textNode));
                });
                ranges = range.filter (sub => sub.length > 0).flat();
            } else if (value instanceof Function) {
            	// function returning flat array of range objects
                ranges = value(string, textNode);
            } else if (value instanceof RegExp) {
                // regular expression
                ranges = this.setRanges (value, string, textNode);
            } else {
                console.error (`Invalid syntax definition for ${prop}: `, `"${value}"`);
            }

            this.setHighlight(ranges, prop);
        }

        return ranges;
    }

    setRanges (regex, string, node) {
        const ranges = [];
        const matches = string.matchAll(regex);

        for (const match of matches) {
            if (!match[0]) continue;
            const start = match.index;
            const range = new Range();
            range.setStart (node, start);
            range.setEnd (node, start + match[0].length);
            ranges.push (range);
        }

        return ranges;
    }

    getHighlights () {
    	const entries = new Map ();
    	CSS.highlights.forEach ((highlight, name) => {
    		if (name.endsWith(this.suffix)) {
    			entries.set (name, highlight);
    		}
    	})
    	return entries;
    }

    setHighlight (ranges = [], type = 'test') {
    	// Add this.suffix to isolate entries in the CSS Highlights Registry
    	// Otherwise, highlights between class instances interfere with each other
    	type = type + this.suffix;
        const highlighter = new Highlight(...ranges);
        CSS.highlights.set (type, highlighter);
        return highlighter;
    }

    getStyle () {
    	const style = document.createElement('style');
    	let content = '';

    	style.id = `highlights${this.suffix}`;
    	this.colors.forEach ((color, key) => {
    		content += `::highlight(${key}${this.suffix}) { color: ${color}}\n`;
    	});

    	style.textContent = content;
    	return style;
    }

    remove(type) {
    	CSS.highlights.delete(type + this.suffix);
    }

    removeAll () {
    	CSS.highlights.forEach ((highlight, name) => {
    		if (name.endsWith(this.suffix)) {
    			CSS.highlights.delete (name);
    		}
    	});
    }

    clearRegistry() {
    	CSS.highlights.clear();
    }

    logRegistry () {
    	CSS.highlights.forEach ((highlight, name) => {
    		console.log (name, highlight);
    	})
    }
}

document.addEventListener('DOMContentLoaded', customElements.define('wijit-code', WijitCode));
