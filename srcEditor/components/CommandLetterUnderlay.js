import { h } from 'preact';
import { useCallback, useRef } from 'preact-hooks';
import createStylesheet from 'createStylesheet';

const theme = createStylesheet('CommandLetterUnderlay', {
	container: {
		'display': 'flex',
		'flex-direction': 'column',
		// 'gap': '3px',
		// 'flex-wrap': 'nowrap',
		// // 'margin-bottom': '1em',
		// 'align-items': 'center',
	},
	// rows: {
	//
	// },
	// row: {
	// 	'display': 'flex',
	// 	'flex-direction': 'row',
	// 	'flex-wrap': 'no-wrap',
	// 	'border': '1px solid red',
	// },
	// pixel: {
	// 	'border': '1px solid blue',
	// 	'font-size': '0.5em',
	// 	'width': '20px',
	// 	'height': '20px',
	// },
});

export default function CommandLetterUnderlay({ pixelartGridRef }) {
	const letterRef = useRef();
	const stylesRef = useRef();
	const handleToggle = useCallback(() => {
		// const isShowed = pixelartGridRef.current.checkIsGridShowed();
		const letter = letterRef.current.value;
		const styles = stylesRef.current.value;

		pixelartGridRef.current.setLetterUnderlay(letter, styles); // !isShowed);
	}, []);

	return (
		h('fieldset', { className: theme.container },
			h('legend', null, 'letter'),
			h('input', { type: 'text', ref: letterRef }),
			h('textarea', { ref: stylesRef }),
			h('button',
				{
					onclick: handleToggle,
				},
				'set letter',
			),
		)
	);
}
