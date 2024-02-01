export class WijitTabs extends HTMLElement {
	constructor () {
		super();
		this.attachShadow ({mode: 'open'});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					border: 1px solid orange;
					display: grid;
					grid-template-columns: repeat(3, 1fr); /* Adjust columns as needed */
					grid-gap: 10px;
				}

			</style>
			<slot></slot>
		`;
	}

	connectedCallback() {
		console.log (this.shadowRoot.innerHTML);
	}

}

export class WijitTab extends HTMLElement {
	constructor () {
		super();
		this.attachShadow ({mode: 'open'});
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					border: 1px solid lime;
					display: grid;
  					grid-template-rows: auto 1fr;
				}
			</style>
			<details>
				<summary><slot name="title"></slot></summary>
				<slot></slot>
			</details>
		`;
	}
}

document.addEventListener('DOMContentLoaded', customElements.define('wijit-tabs', WijitTabs));
document.addEventListener('DOMContentLoaded', customElements.define('wijit-tab', WijitTab));
