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
export default class WijitCode extends HTMLElement {
	/**
	 * @private
	 * @type string
	 * @description Url to the default file which defines the highlight syntax
	 */
	#defaultHighlighter = './syntax.default.js';

	/**
	 * @private
	 * @type boolean
	 * @description Whether to add color highlights.
	 */
	#highlight = false;

	highlights = new Map();

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
	#needSlotChange = false;

	/**
	 * @private
	 * @type AbortController
	 * @description Used to manage event listeners and prevent memory leaks.
	 */
	abortController = new AbortController();

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

			<pre><code><slot></slot></code></pre>
		`;
	}

	/**
	 * @method connectedCallback
	 * @description Called when the element is inserted into the DOM.
	 * @remarks Perform initial setup and establish event listeners after the element is connected.
	 */
	connectedCallback() {
		// this.setAttribute('contenteditable', 'true');
		this.pre = this.shadowRoot.querySelector('pre');
		const slot = this.shadowRoot.querySelector('slot');

		this.inline = this.getAttribute('inline') || this.inline;
		this.textContent = this.resetSpaces();
		slot.addEventListener('slotchange', event => {
			this.updateContentIfNeeded();
	    }, this.abortController.signal);
	}

	test () {

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
		this.abortController.abort();
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
		if (this.#needSlotChange) {
			this.innerHTML = this.resetSpaces(this);
			this.highlightCode (this.highlight);
		} else {
			this.#needSlotChange = true;
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
	resetSpaces (container) {
		this.#needSlotChange = false;
		container = container || this;
		const html = container.innerHTML.replace(
			/^ +/gm,
			(spaces) => '\t'.repeat(spaces.length)
		).trim();

		const lines = html.split("\n");
		const spaces = lines.at(-1).match(/^\s*/)[0].length;
		const regex = new RegExp(`^\\s{${spaces}}`, "g");
		return lines.map (line => line.replace(regex, '')).join("\n");
	}

	highlightCode (obj = {}, content) {
		content = content || this.textContent;
        let ranges = [];
        for (const prop of Object.keys (obj)) {
            const value = obj[prop];

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
                ranges = value(content, this.childNodes[0]);
                this.setHighlights(ranges, prop);
            } else if (value instanceof RegExp) {
                ranges = this.setRanges (value);
                this.setHighlights(ranges, prop);
            } else {
                console.error (`Invalid syntax definition for ${prop}: `, `"${value}"`);
            }
        }
    }

    setRanges (regex) {
        const content = this.textContent;
        const node = this.childNodes[0];
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

    setHighlights (ranges = [], type = '') {
        const highlight = new Highlight(...ranges);
        CSS.highlights.set (type, highlight);
        this.highlights.set (type, highlight);
    }

	get highlight () { return this.#highlight; }

    set highlight (value) {
    	if (typeof Highlight === 'undefined') {
    		console.error('Browser does not support CSS Custom Highlight API');
    		return;
    	}

    	if (!value) {
    		console.error ('No highlight value');
    		return;
    	}

        if (value instanceof Object) {
            this.#highlight = value;
            this.highlight (value);
        } else {
        	value = value.startsWith(("http", ".", "/")) ? value : `./syntax.${value}.js`;
            import (value)
            .then (response => {
                this.#highlight = response.default;
                this.highlightCode (response.default)
            });
        }
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
		switch (value) {
		case '':
		case 'true':
		case true:
			value = true;
			if (this.pre) this.pre.classList.add('inline');
			break;
		default:
			value = false;
			this.removeAttribute('inline');
			if (this.pre) this.pre.classList.remove('inline');
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
}

document.addEventListener('DOMContentLoaded', customElements.define('wijit-code', WijitCode));
