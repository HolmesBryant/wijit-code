export default {
	argument: null,
	attribute: null,
	comment: null,
	function: null,
	keyword: [
		//https://www.w3.org/TR/css-2023/
		':active', '::after', '::before', ':checked', ':disabled', ':empty', ':enabled', ':first-child',
		'::first-letter', '::first-line', ':first-of-type', ':focus', ':hover', ':lang', ':last-child', ':last-of-type',
		':link', ':not', ':nth-child', ':nth-last-child', ':nth-last-of-type', ':nth-of-type', ':only-child', ':only-of-type',
		':root', ':target', ':visited', '@annotation', '@character-variant', '@charset', '@counter-style', '@font-face',
		'@font-feature-values', '@font-palette-values', '@historical-forms', '@import', '@keyframes', '@media',
		'@namespace', '@ornaments', '@styleset', '@stylistic', '@supports', '@swash', 'align-content', 'align-items',
		'align-self', 'all', 'animation', 'animation-delay', 'animation-direction', 'animation-duration', 'animation-fill-mode',
		'animation-iteration-count', 'animation-name', 'animation-play-state', 'animation-timing-function', 'azimuth',
		'background', 'background-attachment', 'background-blend-mode', 'background-clip', 'background-color',
		'background-image', 'background-origin', 'background-position', 'background-repeat', 'background-size',
		'border', 'border-bottom', 'border-bottom-color', 'border-bottom-left-radius', 'border-bottom-right-radius',
		'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-image', 'border-image-outset',
		'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left',
		'border-left-color', 'border-left-style', 'border-left-width', 'border-radius', 'border-right', 'border-right-color',
		'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color',
		'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width', 'border-width',
		'bottom', 'box-decoration-break', 'box-shadow', 'box-sizing', 'break-after', 'break-before', 'break-inside',
		'caption-side', 'caret-color', 'clear', 'clip', 'clip-path', 'clip-rule', 'color', 'color-interpolation-filters',
		'column-count', 'column-fill', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style',
		'column-rule-width', 'columns', 'column-span', 'column-width', 'contain', 'content', 'counter-increment',
		'counter-reset', 'cue', 'cue-after', 'cue-before', 'cursor', 'direction', 'display', 'elevation', 'empty-cells',
		'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap',
		'float', 'flood-color', 'flood-opacity', 'font', 'font-family', 'font-feature-settings', 'font-kerning',
		'font-language-override', 'font-optical-sizing', 'font-palette', 'font-size', 'font-size-adjust', 'font-stretch',
		'font-style', 'font-synthesis', 'font-synthesis-position', 'font-synthesis-small-caps', 'font-synthesis-style',
		'font-synthesis-weight', 'font-variant', 'font-variant-alternates', 'font-variant-caps', 'font-variant-east-asian',
		'font-variant-emoji', 'font-variant-ligatures', 'font-variant-numeric', 'font-variant-position', 'font-variation-settings',
		'font-weight', 'gap', 'glyph-orientation-vertical', 'grid', 'grid-area', 'grid-auto-columns', 'grid-auto-flow',
		'grid-auto-rows', 'grid-column', 'grid-column-end', 'grid-column-gap', 'grid-column-start', 'grid-gap',
		'grid-row', 'grid-row-end', 'grid-row-gap', 'grid-row-start', 'grid-template', 'grid-template-areas', 'grid-template-columns',
		'grid-template-rows', 'hanging-punctuation', 'height', 'hyphens', 'image-orientation', 'image-rendering',
		'isolation', 'justify-content', 'justify-items', 'justify-self', 'left', 'letter-spacing', 'lighting-color',
		'line-break', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin',
		'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'mask', 'mask-border', 'mask-border-mode', 'mask-border-outset',
		'mask-border-repeat', 'mask-border-slice', 'mask-border-source', 'mask-border-width', 'mask-clip', 'mask-composite',
		'mask-image', 'mask-mode', 'mask-origin', 'mask-position', 'mask-repeat', 'mask-size', 'mask-type', 'max-height',
		'max-width', 'min-height', 'min-width', 'mix-blend-mode', 'object-fit', 'object-position', 'order', 'orphans',
		'outline', 'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-wrap',
		'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page-break-after', 'page-break-before',
		'page-break-inside', 'pause', 'pause-after', 'pause-before', 'pitch', 'pitch-range', 'place-content', 'place-items',
		'place-self', 'play-during', 'position', 'property-name', 'quotes', 'resize', 'rest', 'rest-after', 'rest-before',
		'richness', 'right', 'row-gap', 'scroll-margin', 'scroll-margin-block', 'scroll-margin-block-end', 'scroll-margin-block-start',
		'scroll-margin-bottom', 'scroll-margin-inline', 'scroll-margin-inline-end', 'scroll-margin-inline-start',
		'scroll-margin-left', 'scroll-margin-right', 'scroll-margin-top', 'scroll-padding', 'scroll-padding-block',
		'scroll-padding-block-end', 'scroll-padding-block-start', 'scroll-padding-bottom', 'scroll-padding-inline',
		'scroll-padding-inline-end', 'scroll-padding-inline-start', 'scroll-padding-left', 'scroll-padding-right',
		'scroll-padding-top', 'scroll-snap-align', 'scroll-snap-stop', 'scroll-snap-type', 'shape-image-threshold',
		'shape-margin', 'shape-outside', 'speak', 'speak-as', 'speak-header', 'speak-numeral', 'speak-punctuation',
		'speech-rate', 'stress', 'table-layout', 'tab-size', 'text-align', 'text-align-all', 'text-align-last',
		'text-combine-upright', 'text-decoration', 'text-decoration-color', 'text-decoration-line', 'text-decoration-style',
		'text-emphasis', 'text-emphasis-color', 'text-emphasis-position', 'text-emphasis-style', 'text-indent',
		'text-justify', 'text-orientation', 'text-overflow', 'text-shadow', 'text-transform', 'text-underline-position',
		'top', 'transform', 'transform-box', 'transform-origin', 'transition', 'transition-delay', 'transition-duration',
		'transition-property', 'transition-timing-function', 'unicode-bidi', 'vertical-align', 'visibility',
		'voice-balance', 'voice-duration', 'voice-family', 'voice-pitch', 'voice-range', 'voice-rate', 'voice-stress',
		'voice-volume', 'volume', 'white-space', 'widows', 'width', 'will-change', 'word-break', 'word-spacing',
		'word-wrap', 'writing-mode', 'z-index'
	],
	number: /\b\d+\w+\b/g,
	operator: null,
	string: null,
	tag: null,
}
