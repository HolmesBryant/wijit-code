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
	observer;
	static observedAttributes = ['inline', 'tabsize'];

	/**
	 * @constructor
	 * @description Creates a shadow root and sets up the initial structure.
	 */
	constructor() {
		super();
	}

	/**
	 * @function connectedCallback
	 * @description Called when the element is connected to the DOM.
	 * - Adjusts indentation to match surrounding text.
	 */
	connectedCallback() {
		const content = this.resetSpaces(this);
		this.mutationConfig = { childList: true, subtree: true };
		this.observer = new MutationObserver ((mutationList, observer) => {
			this.observer.disconnect();
			const content = this.resetSpaces(this);
			console.log(content)
			// this.wrapCode(this, content);
			this.observer.observe(this, this.mutationConfig);
		});

		this.addCss();
		this.wrapCode(this, content);
		this.observer.observe(this, this.mutationConfig);
	}

	disconnectedCallback () {
		this.observer.disconnect();
	}

	attributeChangedCallback (attr, oldval, newval) {
		this[attr] = newval;
	}

	observe(mutationList, observer) {
		this.observer.disconnect();
		const content = this.resetSpaces(this);
		this.wrapCode(this, content);
		this.observer.observe(this, this.mutationConfig);
	}

	wrapCode(container, content) {
		const pre = document.createElement('pre');
		const code = document.createElement('code');
		if (this.inline) pre.classList.add('inline');
		pre.append(code);
		code.textContent = content;
		container.replaceChildren(pre);
	}

	resetSpaces (container) {
		const html = container.innerHTML.replace(
			/^ +/gm,
			(spaces) => '\t'.repeat(spaces.length)
		).trim();
		const lines = html.split("\n");
		const spaces = lines.at(-1).match(/^\s*/)[0].length;
		const regex = new RegExp(`^\\s{${spaces}}`, "g");
		return lines.map (line => line.replace(regex, '')).join("\n");
	}

	addCss () {
		const id = 'wijit-code-css';
		const style = document.createElement('style');
		const css = `
			wijit-code {
				--tabsize: ${this.tabsize};
				display: inline-block;
				vertical-align: middle;
			}

			wijit-code pre { tab-size: var(--tabsize); }

			wijit-code pre.inline {
				margin: 0;
				white-space: nowrap;
			}
		`;

		if (!document.head.querySelector(`#${id}`)) {
			style.id = id;
			style.textContent = css;
			document.head.append(style);
		}
	}

	get inline () { return this.#inline; }
	set inline (value) {
		const pre = this.querySelector('pre');
		switch (value) {
		case '':
		case 'true':
		case true:
			value = true;
			if (pre) this.pre.classList.add('inline');
			break;
		default:
			value = false;
			this.removeAttribute('inline');
			if (pre) this.pre.classList.remove('inline');
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
