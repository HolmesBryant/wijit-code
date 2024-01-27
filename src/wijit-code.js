/**
 * @class WijitCode
 * @extends HTMLElement
 * @description A custom element for displaying code snippets with consistent formatting and entity encoding.
 * @author Holmes Bryant <webbmaastaa@gmail.com>
 * @license GPL-3.0
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
	contentNode;

	/**
	 * @private
	 * @type boolean
	 * @description Whether to add color highlights.
	 */
	#highlight = false;

	highlighter;

	/**
	 * @private
	 * @type boolean
	 * @description Whether to display the code inline.
	 */
	#inline = false;

	/**
	 * @private
	 * @type number | string
	 * @description The number of spaces to represent a tab character. Can use most css length values.
	 */
	#indent = 2;

	/**
	 * @private
	 * @type boolean
	 * @description Tracks if a slot change requires content update.
	 */
	#needsUpdate = false;

	/**
	 * @private
	 * @type MutationObserver
	 * @description Used to manage mutation events.
	 */
	observer;

	/**
	 * @static
	 * @type string[]
	 * @description A list of attributes to observe for changes.
	 */
	static observedAttributes = ['inline', 'indent', 'highlight'];

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
				{ tab-size: var(--indent); }

				.inline {
					display: inline;
					margin: 0;
					white-space: nowrap;
				}
			</style>

			<pre contenteditable spellcheck="false"></pre>
			<slot></slot>
		`;
	}

	/**
	 * @method connectedCallback
	 * @description Called when the element is inserted into the DOM.
	 * @remarks Perform initial setup and establish event listeners after the element is connected.
	 */
	connectedCallback() {
		const pre = this.shadowRoot.querySelector ('pre');
		const ta = this.querySelector ('textarea');
		const slot = this.shadowRoot.querySelector ('slot');
		const config = { childList: true, characterData: true, subtree: true};
		this.contentNode = pre;
		this.highlighter = new Highlighter(this.contentNode);
		this.inline = this.getAttribute('inline') || this.inline;
		let lastMutationTime = 0;

		this.observer = new MutationObserver ((mutations, observer) => {
			const currentTime = Date.now();

		    if (currentTime - lastMutationTime >= 1000) {
		        lastMutationTime = currentTime;
		        this.updateContentIfNeeded();
		    }
		});

		if (ta) {
			pre.textContent = ta.value;
			ta.remove();
		} else {
			pre.textContent = this.innerHTML;
		}

		this.replaceChildren();
		pre.textContent = this.resetSpaces();
		if (this.highlight) this.highlightCode();
		this.observer.observe (pre, config)
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
	updateContentIfNeeded() {
		// console.log(this.#needsUpdate)
		// if (this.#needsUpdate) {
			// this.contentNode.innerText = this.resetSpaces();
			if (this.highlight) this.highlightCode ();
		// } else {
			// this.#needsUpdate = true;
		// }
	}

	highlightCode (syntax, string) {
		// console.log('highlighting');
		syntax = syntax || this.highlight;
		const content = string || this.contentNode.textContent;
		this.highlighter.clear();
    	this.highlighter.highlight(syntax, content);
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
	resetSpaces (container) {
		this.#needsUpdate = false;
		container = container || this.contentNode;
		const html = container.innerText.replace(
			/^ +/gm,
			(spaces) => '\t'.repeat(spaces.length)
		).trim();

		const lines = html.split("\n");
		const spaces = lines.at(-1).match(/^\s*/)[0].length;
		const regex = new RegExp(`^\\s{${spaces}}`, "g");
		return lines.map (line => line.replace(regex, '')).join("\n");
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
		const node = this.contentNode;
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
    	this.#highlight = value;
    }
}

export class Highlighter {
	element;
	highlights = new Map();
	highlighter = new Map();

	constructor (element) {
		this.element = element;
	}

	highlight (syntax, string) {
		string = string || this.element.innerHTML;

		if (typeof window.Highlight === 'undefined') {
    		console.error('Browser does not support CSS Custom Highlight API');
    		return;
    	}

        this.getSyntax (syntax).then ( response => {
        	this.highlightCode(response.default, string);
        });
	}

	async getSyntax (syntax) {
		try {
			if (typeof syntax === 'string') {
	        	const url = syntax.startsWith(("http", ".", "/")) ? syntax : `./syntax.${syntax}.js`;
				syntax = await import (url);
			}
		} catch (error) {
			console.error ("Error loading Highlight Syntax: ", error);
			throw error;
		}

		return syntax;
	}

	highlightCode (syntax, content) {
		content = content || this.element.textContent;
        let ranges = [];
        for (const prop of Object.keys (syntax)) {
            const value = syntax[prop];

            if (!value) {
            	continue;
            } else if (Array.isArray (value)) {
                value.forEach (word => {
                    const regex = new RegExp(`\\b${word}\\b`, "g");
                    ranges.push (this.setRanges(regex));
                });

                ranges = ranges.filter (sub => sub.length > 0).flat();
                this.setHighlights (ranges, prop);
            } else if (value instanceof Function) {
                ranges = value(content, this.element.childNodes[0]);
                this.setHighlights(ranges, prop);
            } else if (value instanceof RegExp) {
                ranges = this.setRanges (value);
                this.setHighlights(ranges, prop);
            } else {
                console.error (`Invalid syntax definition for ${prop}: `, `"${value}"`);
            }
        }

        return ranges;
    }

    setRanges (regex, string, node) {
        node = node || this.element.childNodes[0];
        const content = string || this.element.textContent;
        const ranges = [];
        const matches = content.matchAll(regex);

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

    setHighlights (ranges = [], type = 'test') {
    	if (this.highlights.get(type) !== undefined) this.clearHighlight(type);
        const highlighter = new Highlight(...ranges);
        CSS.highlights.set (type, highlighter);
        this.highlights.set (type, highlighter);
        // console.log(this.highlighter.size);
        return highlighter;
    }

    clearHighlight(type) {
    	this.highlights.delete(type);
    }

    clear () {
    	this.highlights.clear();
    }
}

document.addEventListener('DOMContentLoaded', customElements.define('wijit-code', WijitCode));
