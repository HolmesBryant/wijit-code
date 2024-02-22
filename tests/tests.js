import {Highlighter} from '../src/wijit-code.js'

export default {
	tag: 'wijit-code',
	attributes: {
		inline: {
			test: (instance, value) => instance.shadowRoot.querySelector('pre').classList.contains('inline'),
			values: [
				["", true],
				["true", true],
				["false", false],
				["foo", false]
			],
		},
		indent: {
			test: (instance, value) => instance.style.getPropertyValue('--indent') === value,
			values: [
				["2", true],
				["2rem", true],
				["", false]
			]
		},
		highlight: {
			test: (instance, value) => instance.highlighter instanceof Highlight,
			values: [
				["", false],
				["false", false],
				["html", true],
				["./syntax.html.js", true]
			]
		}
	},

	properties: {
		inline : {
			test: (instance, value) => instance.shadowRoot.querySelector('pre').classList.contains('inline'),
			values: [
				[null, true],
				["", true],
				["true", true],
				["false", false],
				["foo", false],
			]
		},
		indent: {
			test: (instance, value) => instance.style.getPropertyValue('--indent') === value,
			values: [
				["2", true],
				["2rem", true],
				["", false]
			]
		},
		highlight: {
			test: (instance, value) => instance.highlighter instanceof Highlight,
			values: [
				["", false],
				["false", false],
				["html", true],
				["./syntax.html.js", true]
			]
		}
	},

	methods: {
		highlightCode: {
			test: (instance, args) => instance.highlightCode(...args) instanceof Highlighter,
			values: [
				[ ['html', this], true ],
				[ ['./syntax.html.js', this], true ]
			],
		},
		resetSpaces: {
			test: (instance, args) => typeof instance.resetSpaces(...args),
			values: [
				[ ["\t function(foo){\t\t return foo;\t}"], 'string'],
				[ ['<section id="foo"><article class="bar"><p>foo</p></article></section>'], 'string']
			]
		}
	}

}

