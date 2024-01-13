# Wijit-Code Web Component

A custom element for displaying code snippets with consistent formatting and entity encoding.

Demo: [https://holmesbryant.github.io/wijit-code/](https://holmesbryant.github.io/wijit-code/)


## Features ##

- Removes the leading spaces which the vanilla `pre` element preserves.
- Display the code inline or as a block.
- Customize the amount of indentation within a block.
- Use your own css styles to style code blocks and inline code.

## Available Attributes ##

- **inline** (default: false) | Acceptable values [null, 'true', 'false']
	- Add this attribute if you want the code to appear inline instead of as a block of text. It does not require a value, but if you need to give it a value for some reason, use "true" or "false". "false" negates the effect as if the attribute were not present at all. If you need to adjust the css for inline code, the css selector is: `wijit-code[inline]{...}`

- **tabsize** (default: 2) | Acceptable values [any positive integer or any valid css length]
	- Add this attribute to customize the width of tab characters. Larger values result in increased indentation.


## Usage ##

### Add the Script ###

	<script type="module" src="wijit-code.js"></script>

### Wrap your code in a `<wijit-code></wijit-code>` tag ##

	<wijit-code>
		<div>
			<strong>Some HTML</strong>
		</div>
	</wijit-code>

	<wijit-code>
		function someFunction(value) {
			return value;
		}
	</wijit-code>

## Examples ##

### Inline Code ###

	<wijit-code inline> return "some value"; </wijit-code>

### Custom Tab Size (integer) ###
	<wijit-code tabsize="4">
		<article>
			<header>
				<h1>Title</h1>
			</header>
			<p>Some text</p>
		</article>
	</wijit-code>

### Custom Tab Size (css length) ###
	<wijit-code tabsize=".5rem">
		<article>
			<header>
				<h1>Title</h1>
			</header>
			<p>Some text</p>
		</article>
	</wijit-code>
