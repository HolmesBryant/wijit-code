# Wijit-Code Web Component

A custom element for displaying code snippets with consistent formatting and optional highlighting.

Demo: [https://holmesbryant.github.io/wijit-code/](https://holmesbryant.github.io/wijit-code/)

## Changelog
- v1.01
    - added 'scriptLoaded' event which fires on document when the full text of the script being tested has been loaded. This only occurs when lineNumbers is true (or the 'line-numbers' attribute is present).
    - Changed the default white-space wrapping to 'pre' from 'pre-wrap'.
    - Exposed css custom variable '--wrap' which affects white-space wrapping.

## Note ##

This component makes use of some fairly modern features such as: Dynamic Imports and the CSS Custom Highlight API. If you must support older browsers, please test thoroughly before deploying. 

As of this writing (2024-02-04), Firefox requires you to set a custom flag in order to enable this feature. In Chrome and Edge it is already enabled. Other browsers have not been tested.
 - In Firefox, enter "about:config" in the address bar.
 - In the field labeled "Search preference name", enter "dom.customHighlightAPI.enabled"
 - set dom.customHighlightAPI.enabled to "true"

## Features ##

- Ensures consistent spacing within the code block, regardless of how the code was originally indented.
- Removes any common leading whitespace from all lines to create a visually cleaner block.
- Customize the amount of indentation within a code block.
- Display the code inline or as a block.
- Optional line numbers
- Can highlight HTML or Javascript code out of the box.
- The highlighter does not inject any spans (or other elements) into your code.
- Uses the CSS Custom Highlight API.
- Define custom color palettes on a per-instance basis.
- Easy system for making your own syntax highlighters.

## Available Attributes ##

- **inline** (default: false) | Acceptable values [' ', 'true', 'false']
	- Add this attribute if you want the code to appear inline instead of as a block of text.
	It does not require a value, but if you need to give it a value for some reason, use "true" or "false".
	"false" negates the effect as if the attribute were not present at all.
	If you need to adjust the css for inline code, the css selector is: `wijit-code[inline]{...}`

- **indent** (default: 2) | Acceptable values [integer, css length value]
	- Add this attribute to customize the degree of indentation.
	  It will take an integer or a css length value such as 4px, 2rem etc.

- **highlight** (default: false) | Acceptable values ['false', keyword, url]
	- Add this attribute to highlight your code.
	  The code which determines what text to highlight resides in its own "syntax" file named "syntax.[language].js".
	  Ideally, this file should be located in the same directory as wijit-code.js.
	  The value "false" will negate the effect, as if the attribute were not present at all.

	  - **Keywords:** You can provide a simple keyword, such as "html" or "javascript".
   	    - The component will look for a file named "syntax.[keyword].js" in the **same folder** as wigit-code.js, and try to import it.
		    - Make sure you have the appropriate syntax file in this folder.

	  - **URLs:** Alternatively, you can provide a network url or a file path.
		    - If you are importing over a network, you should include the appropriate protocol such as "http://" or "https://".
		    - If the file you are importing is located on a different domain, make sure the server hosting the file allows cross-origin resource sharing (CORS).
		    - Example: "https://mydomain/path/to/file.js"
		    - If you are importing a file path, the path should begin with "/", "./", or "../" AND must be be somewhere inside the Document Root.
		    - Example: "../parentFolder/otherFolder/syntax.html.js"

- **line-numbers** (default: false) | Acceptable values [truthy values, 'false']
    - Add this attribute to display a line number in front of each line of code. A truthy value is any string except "false".

- **palette** (default: null) | Acceptable values [JSON parsable string reresenting two dimensional array]
	- You may define your own color palette on a per-instance basis. The value of this attribute must be a valid JSON string representing a two-dimensional array of key => value pairs. The keys correspond to the properties defined in the syntax file. The values can be any valid css color value.
	Example: [["tag", "red"], ["function", "blue"]]
	- You may also define a custom palette using javascript.
	The process is described below.


## Usage ##

### Add the Script ###

	<script type="module" src="wijit-code.js"></script>

### Wrap your code in a `<wijit-code>...</wijit-code>` tag ##

	<wijit-code>
		function someFunction(value) {
			return value;
		}
	</wijit-code>

If the code you wish to display contains self-executing javascript, or if you wish to display an html tag having each attribute on a seperate line, wrap your code in a textarea tag.
This will prevent the browser from interpreting your code.

	<wijit-code>
		<textarea>
			<img src="false" onerror="alert('foo!')">
		</textarea>
	</wijit-code>

	<wijit-code>
		<textarea>
			<p
				id="foo"
				class="bar">
				some text
			</p>
		</textarea>
	</wijit-code>


## Examples ##

### Inline Code ###

	<wijit-code inline>...</wijit-code>

### Custom Tab Size (integer) ###

	<wijit-code indent="4">...</wijit-code>

### Custom Tab Size (css length) ###

	<wijit-code indent=".5rem">...</wijit-code>

### Highlight HTML Code ###

	<wijit-code highlight="html">...</wijit-code>

### Highlight Javascript Code ###

	<wijit-code highlight="javascript">...</wijit-code>

### Providing a URL to the Highlighter ###

	<wijit-code highlight="../path/to/syntax.my_syntax.js">...</wijit-code>

## Custom Color Palettes ##

If you have enabled syntax highlighting, you may define custom color palettes via the "palette" attribute or by directly setting the palette property.
You may define your palette as a two dimensional array of key => value pairs, a javascript Map or a JSON string representing a two dimensional map (regardless, the component will convert it into a Map).
Each key should correspond to a property in the syntax definition file you are using.
Each value should be a valid css color value.

The default keys are "argument", "comment", "function", "keyword", "number", "operator", "string", "tag" and "variabe".

Unless your syntax definition file adds new key words, you can just use the default keys. You do not have to include every key, the the properties/values are merged into the default scheme, so any keys you omit will take the default color.

	// Array
	customElements.whenDefined('wijit-code')
	.then (() => {
		const instance = document.querySelector('wijit-code#instance');
		const colors = [
			[ "argument", "hsl(32, 93%, 66%)" ],
			[ "comment", "hsl(221, 12%, 69%)" ],
			[ "function", "hsl(210, 50%, 60%)" ],
			[ "keyword", "hsl(300, 30%, 68%)" ],
			[ "number", "hsl(32, 93%, 66%)" ],
			[ "operator", "red" ],
			[ "string", "hsl(114, 31%, 68%)" ],
			[ "variable", "whitesmoke" ],
			[ "tag", "indianred" ]
		];
		// assign Array to palette
		instance.palette = colors;
	});


	// Map
	customElements.whenDefined( 'wijit-code' )
	.then (() => {
		const instance = document.querySelector( 'wijit-code#instance' );
		const colors = new Map();
		colors.set( "argument", "orange" );
		colors.set( "comment", "gray" );
		colors.set( "function", "dodgerblue" );
		colors.set( "keyword", "purple" );
		colors.set( "number", "darksalmon" );
		colors.set( "operator", "darkred" );
		colors.set( "string", "darkgreen" );
		colors.set( "tag", "olive" );
		colors.set( "variable", "whitesmoke" )
		// assign Map to palette
		instance.palette = colors;
	});

	// JSON string
	<wijit-code palette="[["key", "color"]]">...</wijit-code>

## Custom Syntax Definitions ##

Syntax files are used when highlighting code.
These files are javascript modules which are imported into the component upon initialization.
The value of the "highlight" attribute on the <wijit-code> tag corresponds to a syntax file.
If "highlight" has a value of "html", the component looks for a file named "syntax.html.js" in the same directory as the component script.

You may use your own syntax definitions by creating a syntax definition file.
The default naming scheme for this file is "syntax.[language_name].js", so if you want to create a syntax file for Python, the file name would be "syntax.python.js".
Even though the default location for this type of file is in the same directory as the wijit-code.js file, it is not mandatory to place your file there. You may place a definition file anywhere that can be imported by javascript, but if you do this, you must give the "highlight" attribute a path or url instead of a simple key word.

A syntax definition file consists of a single exported object containing several properties. You must define this object as the default export.

	// syntax.example.js
	export default {
		argument: ... ,
		comment: ... ,
		function ... ,
		keyword: ... ,
		number: ... ,
		operator: ...,
		string: ...,
		tag: ...,
		variable: ...
	};

Each property corresponds to a CSS Custom Highlight API css rule which is injected in a style tag into the head of the document.
The default properties are the same as those desctribed in **Custom Color Palettes**.
If you add a new property name, you must add a new color palette entry which includes the new property name and a color.

	//syntax.example.js
	export default {
		...
		newProperty: ...
	}

	//scripts.js
	customElements.whenDefined( 'wijit-code' )
	.then (() => {
		const instance = document.querySelector( 'wijit-code#instance' );
		instance.palette.set( "newProperty", "LemonChiffon" );
	});

The value for each property can be an Array, Function, RexExp or null.

Arrays are useful for defining things like keywords.

	export default {
		keywords: ['some', 'key', 'words'],
		...
	}

RegExp expressions are useful for simple matches that do not require extra processing or capture groups.
The RexExp **must** include the "g" flag.
Do not put quotes around the expression.

	export default {
		number: /\b\d+\b/g,
		...
	}

Functions are useful for more complex processing.
Each function takes two arguments (string, node) and must return a flat array of Range objects.

"node" is the node containing the textContent of everything inside the component's start/end tags.
Use "node" when invoking range.setStart(node, index) and range.setEnd(node, index).

"string" is the actual content. It includes spaces, tabs, line breaks etc.

	export default {
		tag: function ( string, node ) {
			let match, range;
			const ranges = [];
			const regex = /<\/?[^>]+>/g;
		    while( match = regex.exec( string ) ) {
				range = new Range();
				range.setStart( node, match.index );
				range.setEnd( node, match.index + match[0].length );
				ranges.push( range );
		    }
		    // return flat array of Range objects
			return ranges;
		},
		...
	}

Null is used when you want to include a property, but don't really have a use for it at the moment.

	export default {
		keywords: null,
		...
	}

**It is important to note that the effect of each following item supercedes the effect of the previous one (depending, of course, on how the definitions are written).**
In the following example, the "tag" definition will match everyting between and including angle brackets (including strings), but since the "string" definition follows it, any strings within the angle brackets will be colored according the the string color, not the tag color.

	// example
	export default {
		tag: /<[^>]+>/g,
		string: /['"].*['"]/g
		...
	}


Under the hood, the component takes the ranges from a supplied Function,
or creates ranges from a supplied RexExp or Array,
and passes those ranges to [an instance of Highlight](https://developer.mozilla.org/en-US/docs/Web/API/Highlight).

The Highlight instance is then passed to the global [CSS:highlights static property](https://developer.mozilla.org/en-US/docs/Web/API/CSS/highlights_static).

Then a style tag is inserted into the head of the document containing a set of style highlights.

	<style>
		::highlight(propertyName) {
			color: someColor;
		}
		...
	</style>

[More information about the CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API "More information about the CSS Custom Highlight API")
