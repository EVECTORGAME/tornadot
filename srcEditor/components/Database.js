import { h } from 'preact';
import { useCallback, useLayoutEffect } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../windows/Window.js';

const theme = createStylesheet('Database', {
	container: {
		'display': 'flex',
		'flex-direction': 'column',
		// 'gap': '3px',
		// 'flex-wrap': 'nowrap',
		// // 'margin-bottom': '1em',
		// 'align-items': 'center',
	},
	rows: {

	},
	row: {
		'display': 'flex',
		'flex-direction': 'row',
		'flex-wrap': 'no-wrap',
		'border': '1px solid red',
	},
	pixel: {
		'border': '1px solid blue',
		'font-size': '0.5em',
		'width': '20px',
		'height': '20px',
	},
});

export default function Database({ apiRef }) {
	useLayoutEffect(() => {
		apiRef.current = {
			// setSelectedHslColor(selectedHsl) {
			// 	selectedHslRef.current = selectedHsl;
			// },
			// checkIsGridShowed() {
			// 	return showGrid;
			// },
			// setShouldShowGrid(should) {
			// 	setShowGrid(should);
			// },
			// setShowTransparentUnderlay(should) {
			// 	setShouldTransparentUnderlay((prev) => {
			// 		return should === undefined ? !prev : should;
			// 	});
			// },
			// setLetterUnderlay(text, styles) {
			// 	underlayLetterRef.current.innerText = text;
			// 	underlayLetterRef.current.style.cssText = styles;
			// 	// setLetterUnderlay([text, styles]);
			// },
		};
	}, []);

	return (
		h(Window,
			{
				title: 'Toolbox',
				childrenTitleBarButtons: [
					h(TitleBarButtonClose),
					h(TitleBarButtonMinimize),
					h(TitleBarButtonMaximize),
					h(TitleBarButtonHelp),
				],
				childrenClassName: theme.container,
			},
			h('div', { className: 'sunken-panel' }, // style: { height: 120px; width: 240px;">
				h('table', { className: 'interactive' },
					h('thead', null,
						h('tr', null,
							h('th', null, 'Name'),
							h('th', null, 'Version'),
							h('th', null, 'Company'),
						),
					),
					h('tbody', null,
						h('tr', null,
							h('td', null, 'MySQL ODBC 3.51 Driver'),
							h('td', null, '3.51.11.00'),
							h('td', null, 'MySQL AB'),
						),
					),
				),
			),
		)
	);
}
