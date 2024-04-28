import { h } from 'preact';
import { useCallback } from 'preact-hooks';
import createStylesheet from 'createStylesheet';
import Window, {
	TitleBarButtonClose,
	TitleBarButtonMinimize,
	TitleBarButtonMaximize,
	TitleBarButtonHelp,
} from '../windows/Window.js';

// TINPAEYALF

const theme = createStylesheet('CommandBox', {
	container: {
		'display': 'flex',
		'gap': '3px',
		'flex-wrap': 'nowrap',
		// 'margin-bottom': '1em',
		'align-items': 'center',
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

// TODO transparent background base64

export default function CommandBox({
	// width,
	// height,
	selectedHsl,
}) {
	const handleClick = useCallback((event) => {
		event.target.style.backgroundColor = selectedHsl;
		// console.log(event);
	}, [selectedHsl]);

	const handleMouseOver = useCallback((event) => {
	//	console.log(event);
	}, []);

	return (
		h(Window,
			{
				title: 'Picel Grid',
				childrenTitleBarButtons: [
					h(TitleBarButtonClose),
					h(TitleBarButtonMinimize),
					h(TitleBarButtonMaximize),
					h(TitleBarButtonHelp),
				],
			},
			h('div',
				{ className: theme.selectedColor },
				h('div', {
					style: {
						'background-color': selectedHsl,
					},
				}, 'selected color'),
			),
			h('div',
				{ className: theme.backgroundUrl },
				h('input', { type: 'text' }),
			),
			h('div', // TODO obrazek z urla czy ma być repeating czy nie etc
				{ className: theme.backgroundUrl },
				h('input', { type: 'text' }),
			),
			h('div', // TODO kontrolki do powiększania i pomniejzania, ustawiania opacity, link do google font i możłiowść podania urla
				{ className: theme.backgroundText },
				h('input', { type: 'text' }),
			),
			h('button', {}, 'toggle grid'),
			h('button', {}, 'toggle spacing'),
			h('button', {}, 'color picker'),
			h('button', {}, 'erase'),
			h('button', {}, 'set darker'),
			h('button', {}, 'set lighter'),
			h('button', {}, 'save'), // wypluwa bitmape i użyte ustawienia
			// h('div', {}, 'edit hitory');
		)
	);
}
