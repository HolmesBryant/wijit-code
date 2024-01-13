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
	#inline = false;
	#tabsize = 2;
	static observedAttributes = ['inline', 'tabsize'];

	/**
	 * @constructor
	 * @description Creates a shadow root and sets up the initial structure.
	 */
	constructor() {
		super();
		this.attachShadow({mode:'open'});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: inline-block;
					width: max-content;
					--tabsize: ${this.tabsize};
				}

				pre {
					display: block;
					tab-size: var(--tabsize);
					width: max-content;
				}

				.inline {
					display: inline;
					white-space: nowrap;
					margin: 0;
				}
			</style>

			<pre><slot></slot></pre>
		`;
	}

	/**
	 * @function connectedCallback
	 * @description Called when the element is connected to the DOM.
	 * - Adjusts indentation to match surrounding text.
	 * - Encodes HTML entities within the code content.
	 */
	connectedCallback() {
		const pre = this.shadowRoot.querySelector('pre');
		const result = this.resetSpaces(this);

		if (this.inline) pre.classList.add('inline');
		this.textContent = result;
	}

	attributeChangedCallback (attr, oldval, newval) {
		this[attr] = newval;
	}

	resetSpaces (container) {
		let i = 0;
		// const html = container.innerHTML.trim();
		const html = container.innerHTML.replace(/^\s+/gm, (spaces) => '\t'.repeat(spaces.length)).trim();
		const lines = html.split("\n");
		const spaces = lines.at(-1).match(/^\s*/)[0].length;
		const regex = new RegExp(`^\\s{${spaces}}`, "g");
		return lines.map (line => line.replace(regex, '')).join("\n");
	}

	get inline () { return this.#inline; }
	set inline (value) {
		switch (value) {
		case '':
		case 'true':
		case true:
			this.#inline = true;
			break;
		default:
			this.#inline = false;
		}
	}

	get tabsize () { return this.#tabsize; }
	set tabsize (value) {
		this.style.setProperty('--tabsize', value);
		this.#tabsize = value;
	}
}

document.addEventListener('DOMContentLoaded', customElements.define('wijit-code', WijitCode));
