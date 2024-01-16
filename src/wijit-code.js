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
	#firstPaint = true;
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
					--tabsize: ${this.tabsize};
					display: inline-block;
				}

				pre {
					display: block;
					tab-size: var(--tabsize);
				}

				.inline {
					margin: 0;
					overflow: auto;
					white-space: nowrap;
				}
			</style>

			<pre><code><slot></slot></code></pre>
		`;
	}

	/**
	 * @function connectedCallback
	 * @description Called when the element is connected to the DOM.
	 * - Adjusts indentation to match surrounding text.
	 */
	connectedCallback() {
		this.pre = this.shadowRoot.querySelector('pre');
		const slot = this.shadowRoot.querySelector('slot');
		const result = this.resetSpaces(this);

		if (this.inline) this.pre.classList.add('inline');
		this.textContent = result;

		slot.addEventListener('slotchange', event => {
			if (!this.#firstPaint) {
				this.textContent = this.resetSpaces(this);
			}
			this.#firstPaint = false;
		});
	}

	attributeChangedCallback (attr, oldval, newval) {
		this[attr] = newval;
	}

	resetSpaces (container) {
		const html = container.innerHTML.replace(
			/^\s+/gm,
			(spaces) => '\t'.repeat(spaces.length)
		).trim();
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

	get tabsize () { return this.#tabsize; }
	set tabsize (value) {
		this.style.setProperty('--tabsize', value);
		this.#tabsize = value;
	}
}

document.addEventListener('DOMContentLoaded', customElements.define('wijit-code', WijitCode));
